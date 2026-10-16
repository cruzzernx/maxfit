package com.itb.inf3an.tcc.apimaxfit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Value("${app.cors-enabled}")
    private boolean corsEnabled;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        if (corsEnabled) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:8180", "http://localhost:5173", "http://localhost:5174")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT");
        }

    }
}
