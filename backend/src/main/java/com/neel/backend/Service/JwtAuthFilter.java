package com.neel.backend.Service;

import com.neel.backend.Entity.UserEntity;
import com.neel.backend.Repository.UsersRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;


@Component
public class JwtAuthFilter implements Filter {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
        throws IOException, ServletException{
        HttpServletRequest request = (HttpServletRequest) req;

        String authHeader = request.getHeader("Authorization");
        if(authHeader != null && authHeader.startsWith("Bearer")){
            String token = authHeader.substring(7);

            if(jwtService.isTokenValid(token)){
                String email = jwtService.extractEmail(token);
                UserEntity user = usersRepository.findByEmail(email);
                if(user!=null){
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        chain.doFilter(req, res);
    }

}
