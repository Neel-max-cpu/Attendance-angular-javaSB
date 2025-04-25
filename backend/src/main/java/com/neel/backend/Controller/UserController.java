package com.neel.backend.Controller;

import com.neel.backend.Entity.UserEntity;
import com.neel.backend.Repository.UsersRepository;
import com.neel.backend.Service.JwtService;
import com.neel.backend.dto.ForgotDto;
import com.neel.backend.dto.LoginDto;
import com.neel.backend.dto.SignupDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    // using in memory
    // private Map<Long, UserEntity> userEntity = new HashMap<>();

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/users")
    public List<UserEntity> getAll(){
        // return new ArrayList<>(userEntity.values());
        return usersRepository.findAll();
    }

    @PostMapping("/signup")
    // @RequestBody - take from body, of what type? - type of UserEntity, and at last a variable(myEntry)
    public ResponseEntity<String> createEntry(@RequestBody SignupDto signupDto){
        // in memory --  UserEntity myEntry - now using dto
        /*
        if(!myEntry.getPassword().equals(myEntry.getCpassword())){
            return ResponseEntity.badRequest().body("password and confirm password don't match!");
        }
        userEntity.put(myEntry.getId(), myEntry);
        return ResponseEntity.ok("User created Successfully!");
         */

        if(!signupDto.getPassword().equals(signupDto.getcpassword())){
            return ResponseEntity.badRequest().body("Password and confirm password don't match!");
        }

        // Check if the user already exists based on email
        if(usersRepository.findByEmail(signupDto.getEmail()) != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email with that user already exists!");
        }

        // Create a UserEntity from SignupDto
        UserEntity myEntry = new UserEntity();
        myEntry.setName(signupDto.getName());
        myEntry.setEmail(signupDto.getEmail());
        myEntry.setPassword(signupDto.getPassword());

        // Save the new user
        usersRepository.save(myEntry);

        return ResponseEntity.ok("User created Successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> checkEntry(@RequestBody LoginDto myLogin){
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
            // generate token ---
            String token = jwtService.generateToken(email);
            // Create a response object to return the token
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);  // Return the token as part of a JSON response
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("incorrect email or password!");
    }

    @PutMapping("/forgot")
    public ResponseEntity<String> checkPass(@RequestBody ForgotDto myForgot){
        String email = myForgot.getEmail();
        String oldPassword = myForgot.getOldPassword();
        String newPassword = myForgot.getNewPassword();
        String cPassword = myForgot.getcPassword();

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
