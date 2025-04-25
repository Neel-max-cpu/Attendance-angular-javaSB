package com.neel.backend.Service;

import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtService {
    private final String SECRET_KEY = "neel";
    private final long EXPIRATION = 1000 * 60 * 60 * 24;    //24 hrs in ms

    private Key getKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    //generate token
    public String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey())
                .compact();
    }

    // get email
    public String extractEmail(String token){
        return Jwts.parserBuilder().setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }


    // check if valid token
    public boolean isTokenValid(String token){
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        }
        catch (JwtException e){
            return false;
        }
    }
}
