package com.example.backend.API.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "game_genres")
public class GameGenre {
    @EmbeddedId
    private GameGenreId id;

    public GameGenreId getId() {
        return id;
    }

    public void setId(GameGenreId id) {
        this.id = id;
    }

}