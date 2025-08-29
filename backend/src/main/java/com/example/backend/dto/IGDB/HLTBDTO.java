package com.example.backend.dto.IGDB;

public class HLTBDTO {
    private Long game_id;
    private Double hastily;
    private Double normally;
    private Double completely;

    public Long getGame_id() {
        return game_id;
    }

    public void setGame_id(Long game_id) {
        this.game_id = game_id;
    }

    public Double getHastily() {
        return hastily;
    }

    public void setHastily(Double hastily) {
        this.hastily = hastily;
    }

    public Double getNormally() {
        return normally;
    }

    public void setNormally(Double normally) {
        this.normally = normally;
    }

    public Double getCompletely() {
        return completely;
    }

    public void setCompletely(Double completely) {
        this.completely = completely;
    }
}
