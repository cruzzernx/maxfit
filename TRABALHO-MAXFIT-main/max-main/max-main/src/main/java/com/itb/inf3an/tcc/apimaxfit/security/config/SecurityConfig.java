package com.itb.inf3an.tcc.apimaxfit.security.config;


import com.itb.inf3an.tcc.apimaxfit.security.exceptions.CustomAccessDeniedHandler;
import com.itb.inf3an.tcc.apimaxfit.security.exceptions.CustomAuthenticationEntryPoint;
import com.itb.inf3an.tcc.apimaxfit.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static com.itb.inf3an.tcc.apimaxfit.model.enums.Permission.*;
import static org.springframework.http.HttpMethod.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static String[] WHITE_LIST = {
            "/api/v1/index",
            "/api/v2/api-docs",
            "/images/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**"
    };

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          AuthenticationProvider authenticationProvider,
                          LogoutHandler logoutHandler,
                          CustomAuthenticationEntryPoint authenticationEntryPoint,
                          CustomAccessDeniedHandler accessDeniedHandler) {

        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
        this.logoutHandler = logoutHandler;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors->cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests( req ->
                        req
                                

                                // End-Points do `Personal

                               .requestMatchers(POST,"/api/v1/personals").permitAll()
.requestMatchers(GET,"/api/v1/personals").hasAuthority(PERSONAL_LIST.name())
.requestMatchers(GET,"/api/v1/personals/**").hasAuthority(PERSONAL_READ.name())
.requestMatchers(PUT,"/api/v1/personals/**").hasAuthority(PERSONAL_UPDATE.name())
.requestMatchers(DELETE,"/api/v1/personals/**").hasAuthority(PERSONAL_DELETE.name())

                                // End-Points do Admin

                                .requestMatchers(POST,"/api/v1/admins").permitAll()
                                .requestMatchers(GET,"/api/v1/admins").hasAuthority(ADMIN_LIST.name())
                                .requestMatchers(GET,"/api/v1/admins/**").hasAuthority(ADMIN_READ.name())
                                .requestMatchers(PUT,"/api/v1/admins/**").hasAuthority(ADMIN_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/admins/**").hasAuthority(ADMIN_DELETE.name())

                                // End-Points do Funcionario

                                .requestMatchers(POST,"/api/v1/funcionarios").permitAll()
                                .requestMatchers(GET,"/api/v1/funcionarios").hasAuthority(FUNCIONARIO_LIST.name())
                                .requestMatchers(GET,"/api/v1/funcionarios/**").hasAuthority(FUNCIONARIO_READ.name())
                                .requestMatchers(PUT,"/api/v1/funcionarios/**").hasAuthority(FUNCIONARIO_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/funcionarios/**").hasAuthority(FUNCIONARIO_DELETE.name())

                                // End-Points do Cliente

                                .requestMatchers(POST,"/api/v1/clientes").permitAll()
                                .requestMatchers(GET,"/api/v1/clientes").hasAuthority(CLIENTE_LIST.name())
                                .requestMatchers(GET,"/api/v1/clientes/**").hasAuthority(CLIENTE_READ.name())
                                .requestMatchers(PUT,"/api/v1/clientes/**").hasAuthority(CLIENTE_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/clientes/**").hasAuthority(CLIENTE_MANAGE.name())

                                 // End-Points do Plano de Treino 

                                .requestMatchers(POST,"/api/v1/planotreinos").hasAuthority(PLANOTREINO_CREATE.name())
                                .requestMatchers(POST,"/api/v1/planotreinos/{planoTreinoId}/exercicios/{exercicioId}").hasAuthority(PLANOTREINO_MANAGE.name())
                                .requestMatchers(DELETE,"/api/v1/planotreinos/{planoTreinoId}/exercicios/{exercicioId}").hasAuthority(PLANOTREINO_DELETE.name())
                                .requestMatchers(GET,"/api/v1/planotreinos").hasAuthority(PLANOTREINO_READ.name())
                                .requestMatchers(GET,"/api/v1/planotreinos/**").hasAuthority(PLANOTREINO_READ.name())
                                .requestMatchers(PUT,"/api/v1/planotreinos/**").hasAuthority(PLANOTREINO_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/planotreinos/**").hasAuthority(PLANOTREINO_DELETE.name())

                                // End-Points dos Exercícios
                        
                                .requestMatchers(POST,"/api/v1/exercicios").hasAuthority(EXERCICIO_CREATE.name())
                                .requestMatchers(GET,"/api/v1/exercicios").hasAuthority(EXERCICIO_READ.name())
                                .requestMatchers(GET,"/api/v1/exercicios/**").hasAuthority(EXERCICIO_READ.name())
                                .requestMatchers(PUT,"/api/v1/exercicios/**").hasAuthority(EXERCICIO_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/exercicios/**").hasAuthority(EXERCICIO_DELETE.name())

                                // End-Points das Dietas

                                .requestMatchers(POST,"/api/v1/dietas").hasAuthority(DIETA_CREATE.name())
                                .requestMatchers(GET,"/api/v1/dietas").hasAuthority(DIETA_READ.name())
                                .requestMatchers(GET,"/api/v1/dietas/**").hasAuthority(DIETA_READ.name())
                                .requestMatchers(PUT,"/api/v1/dietas/**").hasAuthority(DIETA_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/dietas/**").hasAuthority(DIETA_DELETE.name())

                                // End-Points dos Produtos

                                .requestMatchers(POST,"/api/v1/produtos").hasAuthority(PRODUTO_CREATE.name())
                                .requestMatchers(GET,"/api/v1/produtos").hasAuthority(PRODUTO_READ.name())
                                .requestMatchers(GET,"/api/v1/produtos/**").hasAuthority(PRODUTO_READ.name())
                                .requestMatchers(PUT,"/api/v1/produtos/**").hasAuthority(PRODUTO_UPDATE.name())
                                .requestMatchers(DELETE,"/api/v1/produtos/**").hasAuthority(PRODUTO_DELETE.name())

                                // End-Points Login

                                .requestMatchers("/api/v1/auth/authenticate").permitAll()
                                .requestMatchers("/api/v1/auth/refresh-token").permitAll()
                                .requestMatchers("/api/v1/convite/**").permitAll()
                                .requestMatchers(WHITE_LIST).permitAll()
                                .anyRequest().authenticated()
                        )

                        .exceptionHandling(
                        exception ->
                                exception
                                        .authenticationEntryPoint(authenticationEntryPoint)
                                        .accessDeniedHandler(accessDeniedHandler)
                              )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .logout(logout -> logout
                        .logoutUrl("/api/v1/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                        );

        return http.build();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ORIGENS PERMITIDAS (ajuste conforme seu front-end)
        config.setAllowedOrigins(List.of(
                "http://localhost:8686", // seu front-end
                "http://localhost:5173",  // caso use Vite
                "http://localhost:5174"
        ));

        // MÉTODOS HTTP PERMITIDOS
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // CABEÇALHOS E CREDENCIAIS
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        // REGISTRA A CONFIGURAÇÃO PARA TODOS OS ENDPOINTS
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
