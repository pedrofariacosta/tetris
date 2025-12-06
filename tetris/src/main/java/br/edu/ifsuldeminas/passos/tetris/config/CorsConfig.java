package br.edu.ifsuldeminas.passos.tetris.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera para todas as rotas da API
                .allowedOrigins("*") // Libera para QUALQUER site (GitHub Pages, localhost, etc)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}