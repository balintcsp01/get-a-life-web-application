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
@Table(name = "users")
@Getter @NoArgsConstructor @AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(unique = true, nullable = false, length = 32)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password_hash;

    @ManyToMany
    @JoinTable(
            name = "user_wishlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hobby_id")
    )
    private Set<Hobby> hobbies = new HashSet<>();
}
