package com.neel.backend.Controller;

import com.neel.backend.Entity.UserEntity;
import com.neel.backend.Repository.UsersRepository;
import com.neel.backend.dto.ForgotDto;
import com.neel.backend.dto.LoginDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    // using in memory
    // private Map<Long, UserEntity> userEntity = new HashMap<>();

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping("/users")
    public List<UserEntity> getAll(){
        // return new ArrayList<>(userEntity.values());
        return usersRepository.findAll();
    }

    @PostMapping("/signup")
    // @RequestBody - take from body, of what type? - type of UserEntity, and at last a variable(myEntry)
    public ResponseEntity<String> createEntry(@RequestBody UserEntity myEntry){
        // in memory --
        /*
        if(!myEntry.getPassword().equals(myEntry.getCpassword())){
            return ResponseEntity.badRequest().body("password and confirm password don't match!");
        }
        userEntity.put(myEntry.getId(), myEntry);
        return ResponseEntity.ok("User created Successfully!");
         */

        // pass and cpass
        if(!myEntry.getPassword().equals(myEntry.getCpassword())){
            return ResponseEntity.badRequest().body("password and confirm password don't match!");
        }

        // user already exist
        if(usersRepository.findByEmail(myEntry.getEmail()) != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email with that user already exists!");
        }

        usersRepository.save(myEntry);
        return ResponseEntity.ok("User created Successfully!");


    }

    @PostMapping("/login")
    public ResponseEntity<String> checkEntry(@RequestBody LoginDto myLogin){
        String email = myLogin.getEmail();
        String password = myLogin.getPassword();

        // in memory ---
        /*
        for (UserEntity user: userEntity.values()){
            if(user.getEmail().equals(email)){
                if(user.getPassword().equals(password)){
                    return ResponseEntity.ok("Login Successfully!");
                }
                else{
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password or email!");
                }
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incorrect email or password!");
         */

        UserEntity user = usersRepository.findByEmail(email);
        if(user!=null && user.getPassword().equals(password)){
            return ResponseEntity.ok("Logged in successfully!");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("incorrect email or password!");
    }

    @PostMapping("/forgot")
    public ResponseEntity<String> checkPass(@RequestBody ForgotDto myForgot){
        String email = myForgot.getEmail();
        String oldPassword = myForgot.getOldPassword();
        String newPassword = myForgot.getNewPassword();
        String cPassword = myForgot.getcPasword();

        UserEntity user = usersRepository.findByEmail(email);
        if(user==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("incorrect email!");
        }

        if(!user.getPassword().equals(oldPassword)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("enter the correct old password!");
        }

        if(!newPassword.equals(cPassword)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password and Confirm password must be same!");
        }

        user.setPassword(newPassword);
        usersRepository.save(user);

        return ResponseEntity.ok("Password updated successfully!");
    }
}
