package com.codecool.getalife.repository;

import com.codecool.getalife.model.UserFriends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserFriendsRepository extends JpaRepository<UserFriends, Long> {

    @Query("""
        select case
            when uf.userId1 = :userId then uf.userId2
            else uf.userId1
           end
        from UserFriends uf
        where uf.userId1 = :userId or uf.userId2 = :userId 
    """)
    List<Long> findFriendsIdsByUserId(@Param("userId") Long userId);

    @Query("""
        select uf
        from UserFriends uf
        where uf.userId1 = :user1 and uf.userId2 = :user2
    """)
    Optional<UserFriends> findFriendship(@Param("user1") Long user1, @Param("user2") Long user2);
}
