FROM openjdk:22

WORKDIR /app

COPY target/MyTodoList-0.0.1-SNAPSHOT.jar /app/app.jar

RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]