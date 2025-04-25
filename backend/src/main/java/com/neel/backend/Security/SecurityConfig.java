package com.neel.backend.Security;

import com.neel.backend.Service.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .csrf(csrf->csrf.disable())
                .authorizeHttpRequests(auth->auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/health-check"
                        ).permitAll()   // allow all login/signups...
                        .anyRequest().authenticated()   // protect all other routes like punch in/out etc...
                )
                .sessionManagement(session->session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))       // no session use only jwt
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // custom jwt filter
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }
}
