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
        if(authHeader != null){
            String token = authHeader;
            System.out.println(token);
            if(jwtService.isTokenValid(token)){
                String email = jwtService.extractEmail(token);
                UserEntity user = usersRepository.findByEmail(email);
                if(user!=null){
                    System.out.println("Authenticated user: " + user.getEmail());
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                // debug statement
                else{
                    System.out.println("User not found for email: " + email);
                }
            }
            // debug statement
            else{
                System.out.println("Invalid or expired token");
            }
        }
        // debug statement
        else{
            System.out.println("Authorization header is missing or doesn't start with Bearer");
        }
        chain.doFilter(req, res);
    }

}
