package com.codecool.getalife.model;

import com.codecool.getalife.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "hobbies")
@Getter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Hobby extends BaseEntity {

    @Column(nullable = false, length = 32, unique = true)
    private String name;

    @Column(name = "image_path")
    private String imagePath;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer min_price;

    @Column(nullable = false)
    private Integer max_price;

    @ManyToMany
    @JoinTable(
            name = "hobby_categories",
            joinColumns = @JoinColumn(name = "hobby_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
}
