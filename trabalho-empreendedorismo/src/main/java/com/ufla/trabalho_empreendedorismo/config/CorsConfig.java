package com.ufla.trabalho_empreendedorismo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Libera o frontend (Vite) para chamar a API direto, sem depender do proxy do Vite.
 * Em produção, defina CORS_ORIGINS com a URL do front (ex.: https://ecoobra.vercel.app).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.origins:http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173}")
    private String[] origins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
