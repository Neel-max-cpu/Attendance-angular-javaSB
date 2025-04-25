package com.neel.backend.Controller;

import com.neel.backend.Entity.PunchRecordEntity;
import com.neel.backend.Entity.UserEntity;
import com.neel.backend.Repository.UsersRepository;
import com.neel.backend.Service.PunchService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/punch")
public class PunchController {

    @Autowired
    private PunchService punchService;

    @Autowired
    private UsersRepository usersRepository;


    @PostMapping("/in")
    public PunchRecordEntity punchIn(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = usersRepository.findByEmail(email);
        return punchService.punchIn(user.getId());
    }

    @PostMapping("/out")
    public PunchRecordEntity punchOut(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = usersRepository.findByEmail(email);
        return punchService.punchOut(user.getId());
    }

    @GetMapping("/history")
    public List<PunchRecordEntity>getHistory(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = usersRepository.findByEmail(email);
        return punchService.getPunchHistory(user.getId());
    }
}
