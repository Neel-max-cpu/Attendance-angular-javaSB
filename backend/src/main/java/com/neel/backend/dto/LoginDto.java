package com.neel.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class LoginDto {
    @NotEmpty(message = "email can't be empty!")
    @Email(message = "email should be valid!")
    private String email;

    @NotEmpty(message = "password can't be empty!")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
