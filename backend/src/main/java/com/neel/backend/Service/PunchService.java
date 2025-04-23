package com.neel.backend.Service;

import com.neel.backend.Entity.PunchRecordEntity;
import com.neel.backend.Repository.PunchRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PunchService {
    @Autowired
    private PunchRecordRepository punchRepo;

    public PunchRecordEntity punchIn(Long userId){
        // prevents mulitple punchins without punching out
        Optional<PunchRecordEntity> active = punchRepo.findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(userId);
        if(active.isPresent()){
            throw new RuntimeException("Already punched in. Punch out first!");
        }

        PunchRecordEntity record = new PunchRecordEntity(userId, LocalDate.now(), LocalDateTime.now());
        return punchRepo.save(record);
    }

    public PunchRecordEntity punchOut(Long userId){
        PunchRecordEntity record = punchRepo.findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(userId)
                .orElseThrow(()->new RuntimeException("No Active punch-in found!"));
        record.setPunchOut(LocalDateTime.now());
        return punchRepo.save(record);
    }

    public List<PunchRecordEntity> getPunchHistory(Long userId){
        return punchRepo.findByUserIdOrderByDatesDesc(userId);
    }
}
