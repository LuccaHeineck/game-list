package com.example.backend.repository;

import com.example.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByIgdbId(Long igdbId);
}

