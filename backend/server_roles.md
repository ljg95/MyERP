# MyERP 백엔드 마이크로서비스 역할 정의서 (MSA Server Roles)

이 문서는 MyERP 시스템을 구성하는 각 백엔드 서버(인프라 및 마이크로서비스)의 명확한 역할과 책임을 정의합니다.

## 1. 인프라 서비스 (Infrastructure Services)
마이크로서비스 아키텍처(MSA)가 정상적으로 작동하기 위해 뼈대가 되는 공통 인프라 서버들입니다.

### 1.1 Discovery Service (`discovery-service` / 포트: 8761)
- **기술 스택**: Spring Cloud Netflix Eureka Server
- **비유**: MSA 통신의 통신망이자 **전화번호부(Registry)**
- **핵심 역할**:
  - **서비스 등록(Registration)**: 다른 모든 마이크로서비스들이 구동될 때 자신의 이름과 위치(IP, 포트)를 이곳에 등록합니다.
  - **서비스 탐색(Discovery)**: 서비스 간 통신이나 게이트웨이에서 라우팅할 때, 물리적 IP 주소 대신 "이름"으로 서비스의 실제 위치를 찾아줍니다.
  - **상태 모니터링(Heartbeat)**: 주기적으로 서비스들의 생존 여부를 체크하여, 죽은 서버는 전화번호부에서 즉각 삭제해 잘못된 요청이 가는 것을 방지합니다.

### 1.2 API Gateway Service (`gateway-service` / 포트: 8080)
- **기술 스택**: Spring Cloud Gateway
- **비유**: 백엔드 시스템의 **단일 출입구(수문장)**이자 안내데스크
- **핵심 역할**:
  - **라우팅(Routing)**: 클라이언트(프론트엔드/모바일)가 보내는 모든 API 요청을 최초로 받아, URL 경로(`/products/**`, `/orders/**` 등)에 맞게 백엔드의 적절한 서비스로 전달(토스)합니다.
  - **로드 밸런싱(Load Balancing)**: 동일한 서비스가 여러 대 실행 중일 때, Discovery Service에서 주소록을 받아와 트래픽을 골고루 분산시킵니다.
  - **공통 관심사 처리**: 향후 CORS 정책 처리, 보안/인증(예: JWT 토큰 검증) 등 모든 서비스에 공통으로 필요한 로직을 게이트웨이 한 곳에서 1차적으로 처리합니다.

---

## 2. 비즈니스 마이크로서비스 (Business Microservices)
실제 ERP 시스템의 핵심 기능과 도메인 로직을 처리하는 서버들입니다. 각 서비스는 독립적인 데이터베이스를 가지며 완전히 분리되어 작동합니다.

### 2.1 Product Service (`product-service` / 포트: 8081)
- **역할**: 상품(Product)과 관련된 모든 비즈니스 로직(상품 등록, 조회, 수정, 삭제)을 전담합니다.
- **데이터베이스**: `product-db` (PostgreSQL - 포트 5432)
- **특징**: ERP의 가장 기초가 되는 기준 정보 데이터(Master Data)를 관리합니다.

### 2.2 Partner Service (`partner-service` / 예정)
- **역할**: 거래처(고객사 및 공급사)와 관련된 비즈니스 로직을 전담합니다.
- **데이터베이스**: `partner-db` (PostgreSQL - 포트 5433)
- **특징**: 매출/매입의 대상이 되는 거래처 정보를 관리합니다.

### 2.3 Inventory Service (`inventory-service` / 예정)
- **역할**: 상품의 재고(Stock) 입출고, 실사, 수량 변동 내역 등 재고 흐름을 관리합니다.
- **특징**: 향후 주문(Order) 서비스나 구매 서비스 등과 긴밀하게 협력하여 재고를 실시간으로 차감/증가시킵니다.

### 2.4 Order Service (`order-service` / 예정)
- **역할**: 고객의 주문 생성, 주문 상태 변경 등 판매 사이클을 관리합니다.
- **특징**: 상품 정보가 필요할 경우 Product Service와, 재고 확인이 필요할 경우 Inventory Service와 통신(예: Feign Client)하여 처리합니다.

---

## 3. 데이터베이스 (Databases)
마이크로서비스 패턴(Database per Service) 전략에 따라 서비스 간의 데이터 결합도를 낮추기 위해 분리된 DB 환경을 권장합니다.
- `product-db`: 상품 서비스 전용 DB (다른 서비스에서 이 DB에 직접 접근 불가, 오직 API로만 통신)
- `partner-db`: 거래처 서비스 전용 DB
