package com.itb.inf3an.tcc.apimaxfit.auth;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationRequest;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationResponse;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.RegisterRequest;
import com.itb.inf3an.tcc.apimaxfit.exceptions.BadRequest;
import com.itb.inf3an.tcc.apimaxfit.exceptions.Unauthorized;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Usuario;
import com.itb.inf3an.tcc.apimaxfit.model.repository.UsuarioRepository;
import com.itb.inf3an.tcc.apimaxfit.security.jwt.JwtService;
import com.itb.inf3an.tcc.apimaxfit.security.token.Token;
import com.itb.inf3an.tcc.apimaxfit.security.token.TokenRepository;
import com.itb.inf3an.tcc.apimaxfit.security.token.TokenType;

import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthenticationService {
	private final UsuarioRepository repository;
	private final TokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthenticationService(UsuarioRepository repository, TokenRepository tokenRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
		this.repository = repository;
		this.tokenRepository = tokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	public AuthenticationResponse register(RegisterRequest request) {

		// lógica minha, pensando na herança
		//Usuario usuario;
		// Mapa seguro: evita reflexão com input externo (CWE-470 / CWE-502)
		Map<String, Class<? extends Usuario>> tipoMap = Map.of(
			"ADMIN",       com.itb.inf3an.tcc.apimaxfit.model.entity.Admin.class,
			"PERSONAL",    com.itb.inf3an.tcc.apimaxfit.model.entity.Personal.class,
			"CLIENTE",     com.itb.inf3an.tcc.apimaxfit.model.entity.Cliente.class,
			"FUNCIONARIO", com.itb.inf3an.tcc.apimaxfit.model.entity.Funcionario.class
		);

		String tipoKey = String.valueOf(request.getTipoUsuario()).toUpperCase(Locale.ROOT);
		Class<? extends Usuario> clazz = tipoMap.get(tipoKey);
		if (clazz == null) {
			throw new BadRequest("Tipo de usuário inválido: " + tipoKey);
		}

		try {
			var usuarioDb = repository.findByEmail(request.getEmail());
			if (usuarioDb.isPresent()) {
				throw new BadRequest("Já existe este email cadastrado em nossa base de dados");
			}

			Usuario usuario = clazz.getDeclaredConstructor().newInstance();

			usuario.setCodStatus(true);
			usuario.setNome(request.getNome());
			usuario.setEmail(request.getEmail());
			usuario.setPassword(passwordEncoder.encode(request.getPassword()));
			usuario.setTipoUsuario(request.getTipoUsuario());
			var savedUser = repository.save(usuario);
			var jwtToken = jwtService.generateToken(savedUser);
			var refreshToken = jwtService.generateRefreshToken(savedUser);

			saveUserToken(savedUser, jwtToken);
			return new AuthenticationResponse(jwtToken, refreshToken);

		} catch (BadRequest e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Erro ao registrar usuário", e);
		}

	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getEmail(),
							request.getPassword()
					)
			);
		} catch (Exception e) {
			log.warn("Falha na autenticação para o email {}: {}", request.getEmail(), e.getMessage());
			throw new BadRequest("Email ou Password Incorreto");
		}
		var user = repository.findByEmail(request.getEmail()).get();
		if(!user.isCodStatus()){
			throw new Unauthorized("Conta inativa, por favor procurar o administrador da conta");
		}
				//.orElseThrow();
		var jwtToken = jwtService.generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);
		revokeAllUserTokens(user);
		saveUserToken(user, jwtToken);

		return new AuthenticationResponse(jwtToken, refreshToken);
	}

	private void saveUserToken(Usuario usuario, String jwtToken) {

		var token = new Token();
		token.setUsuario(usuario);
		token.setToken(jwtToken);
		token.setTokenType(TokenType.BEARER);
		token.setExpired(false);
		token.setRevoked(false);
		tokenRepository.save(token);
	}

	private void revokeAllUserTokens(Usuario usuario) {
		var validUserTokens = tokenRepository.findAllValidTokenByUser(usuario.getId());
		if (validUserTokens.isEmpty())
			return;
		validUserTokens.forEach(token -> {
			token.setExpired(true);
			token.setRevoked(true);
		});
		tokenRepository.saveAll(validUserTokens);
	}

	public void refreshToken(
			HttpServletRequest request,
			HttpServletResponse response
	) throws IOException {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String userEmail;
		if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
			return;
		}
		refreshToken = authHeader.substring(7);
		userEmail = jwtService.extractUsername(refreshToken);
		if (userEmail != null) {
			var user = this.repository.findByEmail(userEmail)
					.orElseThrow();
			if (jwtService.isTokenValid(refreshToken, user)) {
				var accessToken = jwtService.generateToken(user);
				revokeAllUserTokens(user);
				saveUserToken(user, accessToken);
				var authResponse = new AuthenticationResponse(accessToken, refreshToken);
				new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
			}
		}
	}
}