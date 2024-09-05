package com.IIT.personal_finance_tracker.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOrigins("*")
                        .allowedHeaders(
                                "Authorization",
                                "Content-Type",
                                "Accept",
                                "Access-Control-Allow-Origin",
                                "Access-Control-Allow-Private-Network",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers",
                                "Accept-Language",
                                "Cache-Control",
                                "Content-Disposition");
            }
        };
    }
}
