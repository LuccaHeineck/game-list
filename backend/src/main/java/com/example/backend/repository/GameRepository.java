package com.example.backend.repository;

import com.example.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
    // Add custom queries if needed later
}
