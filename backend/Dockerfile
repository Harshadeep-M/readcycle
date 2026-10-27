
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
COPY backend/src/ src/

RUN chmod +x mvnw
RUN ./mvnw -B clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/readcycle-0.0.1-SNAPSHOT.jar"]
