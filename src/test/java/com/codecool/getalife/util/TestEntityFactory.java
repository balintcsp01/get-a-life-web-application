package com.codecool.getalife.util;

import com.codecool.getalife.common.BaseEntity;
import org.springframework.test.util.ReflectionTestUtils;

public final class TestEntityFactory {

    private TestEntityFactory() {}

    public static <T extends BaseEntity> T withId(T entity, Long id) {
        ReflectionTestUtils.setField(entity, "id", id);
        return entity;
    }
}
