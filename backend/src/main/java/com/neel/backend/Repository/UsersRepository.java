package com.neel.backend.Repository;

import com.neel.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);
}
