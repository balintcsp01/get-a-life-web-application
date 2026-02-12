package com.codecool.getalife.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "user_friends")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class UserFriends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id_1", nullable = false)
    private Long userId1;

    @Column(name = "user_id_2", nullable = false)
    private Long userId2;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;


}
