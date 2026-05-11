# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy everything including the backend folder
COPY . .
# Run the build from the backend folder
RUN mvn -f backend/pom.xml clean package -DskipTests

# Run Stage
FROM openjdk:17-jdk-slim
WORKDIR /app
# Grab the built jar from the backend target folder
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]