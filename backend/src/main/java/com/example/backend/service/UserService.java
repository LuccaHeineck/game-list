package com.example.backend.service;

import com.example.backend.API.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private List<User> users;

    public UserService() {
        users = new ArrayList<User>();
    }

    public Optional<User> getUser(Integer id) {
        Optional optional = Optional.empty();

        for (User user : users) {
            if (user.getId() == id) {
                optional = Optional.of(user);
                return optional;
            }
        }

        return optional;
    }
}
