package com.neel.backend.Repository;

import com.neel.backend.Entity.PunchRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PunchRecordRepository extends JpaRepository<PunchRecordEntity, Long> {

    Optional<PunchRecordEntity> findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(Long userId);

    List<PunchRecordEntity> findByUserIdOrderByDateDesc(Long userId);
    List<PunchRecordEntity> findByUserIdAndDateOrderByIdDesc(Long userId, LocalDate date);
}
