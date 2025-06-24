package com.example.backend.dto.response;

public class StatusResponseDTO {
    private Integer statusId;
    private String name;

    // Getters and setters

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}