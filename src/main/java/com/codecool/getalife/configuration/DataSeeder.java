package com.codecool.getalife.configuration;

import com.codecool.getalife.model.Category;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.User;
import com.codecool.getalife.repository.CategoryRepository;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Stream;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final HobbyRepository hobbyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(@NonNull ApplicationArguments args) {
        seedCategories();
        seedHobbies();
        seedUsers();
    }

    private void seedCategories() {
        Stream.of("Outdoor", "Indoor", "Art", "Fitness", "Music", "Gaming", "Cooking")
                .filter(name -> !categoryRepository.existsCategoryByNameIgnoreCase(name))
                .map(name -> Category.builder().name(name).build())
                .forEach(categoryRepository::save);
        categoryRepository.flush();
        log.info("Categories seeded.");
    }

    private void seedHobbies() {
        Category outdoor  = findCategory("Outdoor");
        Category indoor   = findCategory("Indoor");
        Category art      = findCategory("Art");
        Category fitness  = findCategory("Fitness");
        Category music    = findCategory("Music");
        Category gaming   = findCategory("Gaming");
        Category cooking  = findCategory("Cooking");

        Stream.of(
            hobby("Hiking",         "Explore trails and nature on foot. Great for all fitness levels.",                    0,   100, "Beginner",     Set.of(outdoor),   "hobbies/72f88462-3d9b-4679-a504-abde9462a0e4.jpg"),
            hobby("Photography",    "Capture the world through a lens. From portraits to landscapes.",                   200,  2000, "Intermediate", Set.of(art),       "hobbies/15bb92ca-0c9f-4f57-9675-6d0eacb08b19.jpg"),
            hobby("Rock Climbing",  "Scale walls and cliffs with technique and strength.",                                50,   300, "Advanced",     Set.of(outdoor),   "hobbies/bbe09dd8-0dc3-4684-8319-b1c46af7a5a6.jpg"),
            hobby("Painting",       "Express yourself with color on canvas. Relaxing and rewarding.",                    20,   200, "Beginner",     Set.of(art),       "hobbies/55d5841a-0c23-404d-a1e5-7040fd431400.jpg"),
            hobby("Gardening",      "Grow flowers, vegetables, and herbs in your own outdoor space.",                    20,   200, "Beginner",     Set.of(outdoor),   "hobbies/0ca68d9f-70b1-4726-986a-286ebddc393c.jpg"),
            hobby("Chess",          "A timeless strategy game of logic and foresight.",                                   0,    50, "Beginner",     Set.of(gaming),    "hobbies/326f43ef-c8dd-4587-9908-40ccccc3a651.jpg"),
            hobby("Cooking",        "Learn to prepare delicious meals from around the world.",                           50,   300, "Beginner",     Set.of(cooking),   "hobbies/8b380f52-41b7-45ca-8010-f860db231323.jpg"),
            hobby("Guitar",         "Play chords and melodies on one of the world's most popular instruments.",         100,   800, "Intermediate", Set.of(music),     "hobbies/35f0db0e-0fc3-4bab-b3f5-5baa73c432cf.jpg"),
            hobby("Pottery",        "Shape clay into beautiful objects on the wheel or by hand.",                        50,   300, "Beginner",     Set.of(art),       "hobbies/66e4379b-08fb-4da8-9c17-7ef562a15e99.jpg"),
            hobby("Yoga",           "Improve flexibility, strength, and mindfulness through practice.",                   0,   100, "Beginner",     Set.of(fitness),   "hobbies/ef4f560d-1a8c-45eb-8d4c-53442909b2da.jpg"),
            hobby("Reading",        "Explore worlds and ideas through books of every genre.",                             0,    50, "Beginner",     Set.of(indoor),    "hobbies/aec95c1c-7f29-4a55-9790-4844a2869491.jpg"),
            hobby("Dance",          "Express yourself through movement. From salsa to contemporary.",                    50,   300, "Intermediate", Set.of(fitness),   "hobbies/a30e7420-7865-4e5d-9888-fc50b9d78e75.jpg")
        )
        .filter(h -> !hobbyRepository.existsByNameIgnoreCase(h.getName()))
        .forEach(hobbyRepository::save);
        log.info("Hobbies seeded.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@getalife.com")) {
            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@getalife.com")
                    .password_hash(passwordEncoder.encode("admin1234"))
                    .roles(Set.of("USER", "ADMIN"))
                    .hobbies(Set.of())
                    .build());
            log.info("Admin user seeded.");
        }

        if (!userRepository.existsByEmail("user@getalife.com")) {
            userRepository.save(User.builder()
                    .name("DemoUser")
                    .email("user@getalife.com")
                    .password_hash(passwordEncoder.encode("user1234"))
                    .roles(Set.of("USER"))
                    .hobbies(Set.of())
                    .build());
            log.info("Demo user seeded.");
        }
    }

    private Category findCategory(String name) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new IllegalStateException("Category not found during seeding: " + name));
    }

    private Hobby hobby(String name, String description, int minPrice, int maxPrice,
                        String difficulty, Set<Category> categories, String imagePath) {
        return Hobby.builder()
                .name(name)
                .description(description)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .difficulty(difficulty)
                .categories(categories)
                .imagePath(imagePath)
                .build();
    }
}
