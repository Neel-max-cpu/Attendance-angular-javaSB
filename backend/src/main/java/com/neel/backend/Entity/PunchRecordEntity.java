package com.neel.backend.Entity;


import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "punch_records")
public class PunchRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private LocalDate date;
    private LocalDateTime punchIn;
    private LocalDateTime punchOut;

    private Long totalTime;

    public Long getTotalTime() {
        if (punchIn != null && punchOut != null) {
            totalTime = Duration.between(punchIn, punchOut).toMinutes();
        }
        return totalTime;
    }

    public void setTotalTime(Long totalTime) {
        this.totalTime = totalTime;
    }

    public PunchRecordEntity(){}

    public PunchRecordEntity(Long userId, LocalDate date, LocalDateTime punchIn){
        this.userId = userId;
        this.date = date;
        this.punchIn = punchIn;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getuserId() {
        return userId;
    }

    public void setuserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDateTime getPunchIn() {
        return punchIn;
    }

    public void setPunchIn(LocalDateTime punchIn) {
        this.punchIn = punchIn;
    }

    public LocalDateTime getPunchOut() {
        return punchOut;
    }

    public void setPunchOut(LocalDateTime punchOut) {
        this.punchOut = punchOut;
    }
}
