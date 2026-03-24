package com.codecool.getalife.model;

import com.codecool.getalife.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suggestions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Suggestion extends BaseEntity {

    @Column(nullable = false, length = 32)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_price")
    private Integer minPrice;

    @Column(name = "max_price")
    private Integer maxPrice;

    @Column
    private String difficulty;

    @ElementCollection
    @CollectionTable(name = "suggestion_categories", joinColumns = @JoinColumn(name = "suggestion_id"))
    @Column(name = "category")
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private User submittedBy;
}
