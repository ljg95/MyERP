# ====== 1단계: 빌드 환경 (Build Stage) ======
# Gradle이 설치된 공식 Java 21 이미지를 'builder'라는 이름의 임시 컨테이너로 불러옵니다.
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app

# 현재 폴더(discovery-service)의 모든 소스 코드와 설정 파일을 컨테이너의 /app으로 복사합니다.
COPY . .

# Gradle을 사용하여 Spring Boot 애플리케이션을 빌드합니다. (테스트는 생략, 백그라운드 데몬 미사용)
# 이 과정이 끝나면 /app/build/libs/ 안에 실행 가능한 .jar 파일이 생성됩니다.
RUN gradle build -x test --no-daemon

# ====== 2단계: 실행 환경 (Run Stage) ======
# 빌드 도구(Gradle 등)가 싹 빠진 가벼운 JRE(실행 전용) 이미지로 새 컨테이너를 시작합니다.
FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp

# 이전에 만든 'builder' 컨테이너에서 완성된 .jar 파일만 쏙 빼와서 현재 이미지의 app.jar로 복사합니다.
# (이로 인해 불필요한 소스코드나 빌드 도구 용량이 덤핑되어 도커 이미지가 매우 가벼워집니다)
COPY --from=builder /app/build/libs/*.jar app.jar

# 도커 컨테이너가 켜질 때 최종적으로 실행할 명령어를 정의합니다. (java -jar /app.jar)
ENTRYPOINT ["java","-jar","/app.jar"]
