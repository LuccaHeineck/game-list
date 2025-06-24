package com.example.backend.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Embeddable
public class UserGameId implements Serializable {
    private Long userId;
    private Long gameId;

    // equals() and hashCode() must be overridden
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserGameId)) return false;
        UserGameId that = (UserGameId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(gameId, that.gameId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, gameId);
    }
}

