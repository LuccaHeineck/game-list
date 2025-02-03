package com.example.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "user_games")
public class UserGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user_game", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_user", nullable = false)
    private User idUser;

    @Column(name = "id_game", nullable = false)
    private Integer idGame;

    @Column(name = "game_name", nullable = false)
    private String gameName;

    @Column(name = "cover_image")
    private String coverImage;

    @Lob
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "genre")
    private String genre;

    @Column(name = "year_of_release")
    private Integer yearOfRelease;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "completion_date")
    private Instant completionDate;

    @Lob
    @Column(name = "final_thoughts")
    private String finalThoughts;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getIdUser() {
        return idUser;
    }

    public void setIdUser(User idUser) {
        this.idUser = idUser;
    }

    public Integer getIdGame() {
        return idGame;
    }

    public void setIdGame(Integer idGame) {
        this.idGame = idGame;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getYearOfRelease() {
        return yearOfRelease;
    }

    public void setYearOfRelease(Integer yearOfRelease) {
        this.yearOfRelease = yearOfRelease;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Instant getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Instant completionDate) {
        this.completionDate = completionDate;
    }

    public String getFinalThoughts() {
        return finalThoughts;
    }

    public void setFinalThoughts(String finalThoughts) {
        this.finalThoughts = finalThoughts;
    }

}