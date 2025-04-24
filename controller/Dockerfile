FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY pom.xml /app/
COPY src /app/src/

RUN mvn package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/controller-0.0.1-SNAPSHOT.jar"] 