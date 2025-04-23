package com.neel.backend.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtAuthenticationFilter {
    private final String SECRET = "neel_secret_key";
    private final long EXPIRATION_TIME = 86400000;      // 1days

    public String generateToken(){
        return Jwts.builder().setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis())+EXPIRATION_TIME)
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();

    }
}
