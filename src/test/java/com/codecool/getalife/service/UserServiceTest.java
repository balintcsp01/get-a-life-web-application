package com.codecool.getalife.service;

import com.codecool.getalife.exception.hobby.HobbyNotFoundException;
import com.codecool.getalife.exception.user.UserDuplicateException;
import com.codecool.getalife.exception.user.UserNotFoundException;
import com.codecool.getalife.model.Hobby;
import com.codecool.getalife.model.User;
import com.codecool.getalife.model.dto.hobby.HobbyIdResponse;
import com.codecool.getalife.model.dto.user.UserCreateRequest;
import com.codecool.getalife.model.dto.user.UserResponse;
import com.codecool.getalife.repository.HobbyRepository;
import com.codecool.getalife.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.codecool.getalife.util.TestEntityFactory;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private HobbyRepository hobbyRepository;

    @InjectMocks
    private UserService userService;

    private Hobby hobby1;
    private Hobby hobby2;
    private User savedUser;

    @BeforeEach
    void setUp() {
        hobby1 = TestEntityFactory.withId(Hobby.builder().name("Chess").description("Board game").minPrice(0).maxPrice(50).difficulty("Beginner").build(), 1L);
        hobby2 = TestEntityFactory.withId(Hobby.builder().name("Hiking").description("Outdoor activity").minPrice(0).maxPrice(100).difficulty("Intermediate").build(), 2L);
        savedUser = TestEntityFactory.withId(User.builder().name("Luna").email("luna@meow.com").password_hash("hashed").hobbies(Set.of(hobby1)).build(), 10L);
    }


    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        @DisplayName("returns UserResponse when request is valid")
        void create_validRequest_returnsUserResponse() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of(1L));

            when(passwordEncoder.encode("purr1234")).thenReturn("hashed");
            when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby1));
            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            UserResponse response = userService.create(request);

            assertThat(response.name()).isEqualTo("Luna");
            assertThat(response.email()).isEqualTo("luna@meow.com");
            assertThat(response.id()).isEqualTo(10L);
            assertThat(response.hobbyIds()).containsExactly(new HobbyIdResponse(1L));
        }

        @Test
        @DisplayName("hashes password before saving")
        void create_encodesPassword() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "plaintext", Set.of());

            when(passwordEncoder.encode("plaintext")).thenReturn("hashed");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            userService.create(request);

            verify(passwordEncoder).encode("plaintext");
            verify(userRepository).save(argThat(u -> "hashed".equals(u.getPassword_hash())));
        }

        @Test
        @DisplayName("resolves all hobby IDs and attaches them to user")
        void create_multipleHobbies_allAttached() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of(1L, 2L));

            User userWithTwoHobbies = TestEntityFactory.withId(User.builder().name("Luna").email("luna@meow.com").password_hash("hashed").hobbies(Set.of(hobby1, hobby2)).build(), 10L);

            when(passwordEncoder.encode(anyString())).thenReturn("hashed");
            when(hobbyRepository.findById(1L)).thenReturn(Optional.of(hobby1));
            when(hobbyRepository.findById(2L)).thenReturn(Optional.of(hobby2));
            when(userRepository.save(any(User.class))).thenReturn(userWithTwoHobbies);

            UserResponse response = userService.create(request);

            assertThat(response.hobbyIds()).hasSize(2);
            assertThat(response.hobbyIds()).containsExactlyInAnyOrder(
                    new HobbyIdResponse(1L),
                    new HobbyIdResponse(2L)
            );
        }

        @Test
        @DisplayName("throws HobbyNotFoundException when a hobby ID does not exist")
        void create_unknownHobbyId_throwsHobbyNotFoundException() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of(99L));

            when(passwordEncoder.encode(anyString())).thenReturn("hashed");
            when(hobbyRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.create(request))
                    .isInstanceOf(HobbyNotFoundException.class);
        }

        @Test
        @DisplayName("throws UserDuplicateException on DataIntegrityViolationException")
        void create_duplicateUser_throwsUserDuplicateException() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of());

            when(passwordEncoder.encode(anyString())).thenReturn("hashed");
            when(userRepository.save(any(User.class))).thenThrow(DataIntegrityViolationException.class);

            assertThatThrownBy(() -> userService.create(request))
                    .isInstanceOf(UserDuplicateException.class);
        }

        @Test
        @DisplayName("works with empty hobby set")
        void create_noHobbies_savesUserWithEmptyHobbySet() {
            UserCreateRequest request = new UserCreateRequest("Luna", "luna@meow.com", "purr1234", Set.of());

            User userNoHobbies = TestEntityFactory.withId(User.builder().name("Luna").email("luna@meow.com").password_hash("hashed").hobbies(Set.of()).build(), 10L);

            when(passwordEncoder.encode(anyString())).thenReturn("hashed");
            when(userRepository.save(any(User.class))).thenReturn(userNoHobbies);

            UserResponse response = userService.create(request);

            assertThat(response.hobbyIds()).isEmpty();
            verify(hobbyRepository, never()).findById(anyLong());
        }
    }

    @Nested
    @DisplayName("get()")
    class Get {

        @Test
        @DisplayName("returns UserResponse when user exists")
        void get_existingId_returnsUserResponse() {
            when(userRepository.findById(10L)).thenReturn(Optional.of(savedUser));

            UserResponse response = userService.get(10L);

            assertThat(response.id()).isEqualTo(10L);
            assertThat(response.name()).isEqualTo("Luna");
            assertThat(response.email()).isEqualTo("luna@meow.com");
        }

        @Test
        @DisplayName("maps hobby IDs correctly")
        void get_userWithHobbies_hobbyIdsAreMapped() {
            when(userRepository.findById(10L)).thenReturn(Optional.of(savedUser));

            UserResponse response = userService.get(10L);

            assertThat(response.hobbyIds()).containsExactly(new HobbyIdResponse(1L));
        }

        @Test
        @DisplayName("throws UserNotFoundException when user does not exist")
        void get_unknownId_throwsUserNotFoundException() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.get(99L))
                    .isInstanceOf(UserNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getAll()")
    class GetAll {

        @Test
        @DisplayName("returns all users as UserResponse set")
        void getAll_multipleUsers_returnsAll() {
            User luna = TestEntityFactory.withId(User.builder().name("Luna").email("luna@meow.com").password_hash("h").hobbies(Set.of()).build(), 1L);
            User jeff = TestEntityFactory.withId(User.builder().name("Jeff").email("jeff@meow.com").password_hash("h").hobbies(Set.of()).build(), 2L);

            when(userRepository.findAll()).thenReturn(List.of(luna, jeff));

            Set<UserResponse> responses = userService.getAll();

            assertThat(responses).hasSize(2);
            assertThat(responses).extracting(UserResponse::name)
                    .containsExactlyInAnyOrder("Luna", "Jeff");
        }

        @Test
        @DisplayName("returns empty set when no users exist")
        void getAll_noUsers_returnsEmptySet() {
            when(userRepository.findAll()).thenReturn(List.of());

            Set<UserResponse> responses = userService.getAll();

            assertThat(responses).isEmpty();
        }

        @Test
        @DisplayName("maps hobby IDs for each user")
        void getAll_usersWithHobbies_hobbyIdsMapped() {
            User luna = TestEntityFactory.withId(User.builder().name("Luna").email("luna@meow.com").password_hash("h").hobbies(Set.of(hobby1, hobby2)).build(), 1L);

            when(userRepository.findAll()).thenReturn(List.of(luna));

            Set<UserResponse> responses = userService.getAll();

            UserResponse response = responses.iterator().next();
            assertThat(response.hobbyIds()).containsExactlyInAnyOrder(
                    new HobbyIdResponse(1L),
                    new HobbyIdResponse(2L)
            );
        }
    }

}
