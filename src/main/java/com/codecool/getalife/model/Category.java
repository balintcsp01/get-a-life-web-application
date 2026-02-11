package com.codecool.getalife.model;

import com.codecool.getalife.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Getter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, length = 32, unique = true)
    private String name;
}
