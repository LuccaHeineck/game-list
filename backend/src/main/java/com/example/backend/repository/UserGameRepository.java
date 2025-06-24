package com.example.backend.repository;

import com.example.backend.model.UserGame;
import com.example.backend.model.UserGameId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserGameRepository extends JpaRepository<UserGame, UserGameId> {
    List<UserGame> findByUserId(Long userId);
    List<UserGame> findByGameId(Long gameId);
    List<UserGame> findByUserIdAndStatus_StatusId(Long userId, Integer statusId);
}
