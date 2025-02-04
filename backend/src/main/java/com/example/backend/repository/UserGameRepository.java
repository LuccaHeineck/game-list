package com.example.backend.repository;

import com.example.backend.model.User;
import com.example.backend.model.UserGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGameRepository extends JpaRepository<UserGame, Integer> {
    List<UserGame> findByUser(User user);
}
