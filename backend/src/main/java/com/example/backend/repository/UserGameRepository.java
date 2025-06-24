package com.example.backend.repository;

import com.example.backend.model.UserGame;
import com.example.backend.model.UserGameId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserGameRepository extends JpaRepository<UserGame, UserGameId> {
    List<UserGame> findByUserId(Long userId);
    List<UserGame> findByGameId(Long gameId);
    List<UserGame> findByUserIdAndStatus_StatusId(Long userId, Integer statusId);
    Optional<UserGame> findByUserIdAndGameId(Long userId, Long gameId);
    void deleteByUserIdAndGameId(Long userId, Long gameId);
}
