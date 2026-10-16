package com.itb.inf3an.tcc.apimaxfit.security.jwt;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.token-expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;


    // Método para decodificar a chave

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Método para extrair todas as informações do token

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    // Método para extrair uma informação especifíca, exemplo: id, email etc

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);

    }

    // Método para extrair o username (email)

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Método para extrair o id do usuário

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("id", Long.class));
    }

    // Método para extrair o tempo de expiração do token

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Agora, métodos para construção do token

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {

        ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
        ZonedDateTime agora = ZonedDateTime.now(zoneId);
        ZonedDateTime expira = agora.plus(Duration.ofMillis(expiration));

        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(agora.toInstant()))
                .setExpiration(Date.from(expira.toInstant()))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();

    }

    // Métodos polimórficos para gerar o token (dois métodos com o mesmo nome, entretanto com parâmetros diferentes )

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        if(userDetails instanceof Usuario usuario){
            extraClaims.put("role", usuario.getTipoUsuario());
            extraClaims.put("id", usuario.getId());
        }
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    // Método para veriricar a expiração do token

    private boolean isTokenExpired (String token) {
        return extractExpiration(token).before(new Date());
    }

    // Método para verificar a validade do token

    public boolean isTokenValid (String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Método para gerar a atualização do token

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshTokenExpiration);
    }

}
