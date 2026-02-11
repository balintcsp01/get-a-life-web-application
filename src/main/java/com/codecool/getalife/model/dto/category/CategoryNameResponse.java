package com.codecool.getalife.model.dto.category;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CategoryNameResponse(String name) {

}
