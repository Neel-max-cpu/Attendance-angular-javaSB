package com.neel.backend.Service;

import com.neel.backend.Entity.PunchRecordEntity;
import com.neel.backend.Repository.PunchRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PunchService {

    @Autowired
    private PunchRecordRepository punchRepo;

    // Handle punch-in
    public PunchRecordEntity punchIn(Long userId) {
        // Prevents multiple punch-ins without punching out
        Optional<PunchRecordEntity> active = punchRepo.findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(userId);
        if (active.isPresent()) {
            throw new RuntimeException("Already punched in. Punch out first!");
        }

        PunchRecordEntity record = new PunchRecordEntity(userId, LocalDate.now(), LocalDateTime.now());
        return punchRepo.save(record);
    }

    // Handle punch-out
    public PunchRecordEntity punchOut(Long userId) {
        PunchRecordEntity record = punchRepo.findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(userId)
                .orElseThrow(() -> new RuntimeException("No Active punch-in found!"));

        LocalDateTime punchIn = record.getPunchIn();
        LocalDateTime punchOut = LocalDateTime.now();
        Duration duration = Duration.between(punchIn, punchOut);
        if(duration.toHours() > 14){
            record.setPunchOut(null);
            throw new RuntimeException("Punch out rejected: more than 14 hours have passed!");
        }

        record.setPunchOut(punchOut);
        return punchRepo.save(record);
    }

    // Get punch history with calculated total time
    public List<PunchRecordEntity> getPunchHistory(Long userId) {
        List<PunchRecordEntity> records = punchRepo.findByUserIdOrderByDateDesc(userId);
        for (PunchRecordEntity record : records) {
            if (record.getPunchIn() != null && record.getPunchOut() != null) {
                long totalMinutes = Duration.between(record.getPunchIn(), record.getPunchOut()).toMinutes();
                record.setTotalTime(totalMinutes);  // Setting calculated total time
            }
        }
        return records;
    }

    //get History by date
    public List<PunchRecordEntity> getPunchHistoryByDate(Long userId, LocalDate date){
        return punchRepo.findByUserIdAndDateOrderByIdDesc(userId, date);
    }
}
