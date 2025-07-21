package com.example.backend.repository;

import com.example.backend.model.Artwork;
import com.example.backend.model.Screenshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScreenshotRepository extends JpaRepository<Screenshot, Long> {
    public Optional<Screenshot> findByUrl(String url);
}

