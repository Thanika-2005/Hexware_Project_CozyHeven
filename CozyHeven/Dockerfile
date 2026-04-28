# FROM : JVM for app compile
FROM maven:3.9.6-eclipse-temurin-21
# VOLUME - temp directory for docker to mount uour APP
VOLUME /tmp
# COPY - compy the jar file target/jar-file to .
COPY target/CozyHeven-0.0.1-SNAPSHOT.jar cozy-heven.jar
# Command - java -jar <app-name>
ENTRYPOINT ["java", "-jar", "cozy-heven.jar"]

