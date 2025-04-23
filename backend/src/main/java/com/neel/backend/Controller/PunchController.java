package com.neel.backend.Controller;

import com.neel.backend.Entity.PunchRecordEntity;
import com.neel.backend.Service.PunchService;
import org.springframework.beans.factory.annotation.Autowired;
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

    private Long tempUser = 1L;

    @PostMapping("/in")
    public PunchRecordEntity punchIn(){
        return punchService.punchIn(tempUser);
    }

    @PostMapping("/out")
    public PunchRecordEntity punchOut(){
        return punchService.punchOut(tempUser);
    }

    @GetMapping("/history")
    public List<PunchRecordEntity>getHistory(){
        return punchService.getPunchHistory(tempUser);
    }
}
