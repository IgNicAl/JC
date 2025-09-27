#!/bin/bash

# Configura JAVA_HOME para Java 21
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Executa a aplicação Spring Boot
./mvnw spring-boot:run
