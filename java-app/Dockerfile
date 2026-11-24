FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY index.html shop.html about.html journal.html contact.html login.html register.html admin-login.html account.html admin.html privacy.html styles.css auth.css app.js auth.js pages.js ./
COPY java-app ./java-app
WORKDIR /workspace/java-app
RUN mvn --batch-mode clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/java-app/target/furnique-commerce-1.0.0.jar /app/app.jar
ENV PORT=8080
ENV DATA_DIRECTORY=/app/data
EXPOSE 8080
USER 10001
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
