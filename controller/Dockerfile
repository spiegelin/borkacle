FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY pom.xml /app/
COPY src /app/src/

EXPOSE 8080

CMD ["sh", "-c", "mvn clean install && mvn spring-boot:run"] 