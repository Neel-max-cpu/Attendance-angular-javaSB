package com.neel.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class ForgotDto {
    @NotEmpty(message = "email can't be empty!")
    @Email(message = "email should be valid!")
    private String email;

    @NotEmpty(message = "oldPassword can't be empty!")
    private String oldPassword;

    @NotEmpty(message = "newPassword can't be empty!")
    private String newPassword;

    @NotEmpty(message = "cPassword can't be empty!")
    private String cPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getcPassword() {
        return cPassword;
    }

    public void setcPassword(String cPassword) {
        this.cPassword = cPassword;
    }
}
