package com.neel.backend.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

import static javax.crypto.Cipher.SECRET_KEY;

@Service
public class JwtService {
    // small doen't work so auto generate --
    /*
    private final String SECRET_KEY = "neel";
    private Key getKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    */

    private static final String SECRET = "my-super-secret-key-which-is-at-least-32-bytes-long";
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    //generate token
    public String generateToken(String email){
        SecretKey key = getKey();
        //24 hrs in ms
        long EXPIRATION = 1000 * 60 * 60 * 24;
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                //.signWith(getKey())
                .signWith(key)
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
