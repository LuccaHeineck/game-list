package com.example.backend.API.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.util.Objects;

@Embeddable
public class GameGenreId implements java.io.Serializable {
    private static final long serialVersionUID = 420109715746576678L;
    @Column(name = "game_id", nullable = false)
    private Integer gameId;

    @Column(name = "genre_id", nullable = false)
    private Integer genreId;

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getGenreId() {
        return genreId;
    }

    public void setGenreId(Integer genreId) {
        this.genreId = genreId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GameGenreId entity = (GameGenreId) o;
        return Objects.equals(this.gameId, entity.gameId) &&
                Objects.equals(this.genreId, entity.genreId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, genreId);
    }

}