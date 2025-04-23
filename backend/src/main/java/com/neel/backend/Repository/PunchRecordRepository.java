package com.neel.backend.Repository;

import com.neel.backend.Entity.PunchRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PunchRecordRepository extends JpaRepository<PunchRecordEntity, Long> {
    List<PunchRecordEntity> findByUserIdOrderByDatesDesc(Long userId);
    Optional<PunchRecordEntity>findTopByUserIdAndPunchOutIsNullOrderByPunchInDesc(Long userId);
}
