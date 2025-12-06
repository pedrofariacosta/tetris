# Etapa 1: Construção (Build)
FROM maven:3.9.6-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Execução (Run)
FROM eclipse-temurin:21-jdk
COPY --from=build /target/tetris-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]