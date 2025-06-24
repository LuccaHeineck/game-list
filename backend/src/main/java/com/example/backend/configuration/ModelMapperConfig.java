package com.example.backend.configuration;

import com.example.backend.dto.response.UserResponseDTO;
import com.example.backend.model.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.addMappings(new PropertyMap<UserResponseDTO, User>() {
            @Override
            protected void configure() {
                skip(destination.getCreatedAt()); // Skip createdAt during mapping
            }
        });

        return modelMapper;
    }
}

