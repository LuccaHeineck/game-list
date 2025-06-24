package com.example.backend.repository;

import com.example.backend.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
}
