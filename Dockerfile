# 1. stage - build
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml ./
COPY .mvn/ .mvn/
COPY mvnw ./

RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

COPY src ./src

RUN ./mvnw clean package -DskipTests

# 2. stage - run
FROM eclipse-temurin:17

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY uploads ./uploads

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
