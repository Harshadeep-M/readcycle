
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/

RUN chmod +x mvnw
RUN ./mvnw -B clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/readcycle-0.0.1-SNAPSHOT.jar"]
