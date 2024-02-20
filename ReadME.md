## 3Layered Architecture 이해
<br>

### 필수 요구 사항
1.  **개발**
- [ ] 본인이 작성한 숙련 주차 과제 코드를 복사해서 심화 주차 과제를 위한 저장소를 생성합니다.
- [ ] 숙련주차에서 작성한 코드를 3-Layered Architecture를 적용해서 구조를 변경합니다.
- [ ] Controller, Service, Repository Layer는 Class를 이용해 구현합니다.
- [ ] Controller, Service, Repository 의 Class 에 *Jest** 를 사용한 테스트 코드를 작성합니다.

<br>

2. **API 동작확인**
- [ ] Thunder Client 등을 이용하여 구현 한 API가 정상 동작하는지 확인합니다.

<br>

3. **Test Case 동작확인**
- [ ] 모든 Test Case 가 잘 동작하는지 확인합니다.

<br>

4. **배포**
- [ ] AWS EC2 인스턴스에 프로젝트를 배포합니다.
- [ ] PM2를 이용해 Express 서버가 종료 되거나, EC2 인스턴스가 재부팅 되어도 다시 실행되도록 설정합니다.

  <br>
### 선택 요구 사항
- [ ] 로컬 전역변수로 관리하고있는 RefreshToken 을 **Redis**에 저장해보세요.
- [ ] 모든 API 요청에 대해 반환까지 3초이상 걸리는 경우 알림 기능을 추가해보세요. 
  - 데이터베이스 조회가 느릴 수 있다는 가정으로 이력서 조회하는 부분에 랜덤으로 0~5초 delay를 줍니다.
  - console 출력과 함께 **슬랙 알림** 까지 구현해보세요.
- [ ] 어떠한 서비스도 서버가 1대로 운영하는곳은 없어요! 물리적으로 서버를 2대놓으면 좋겠지만 대안으로 PM2 를 사용해 여러대의 서버를 띄워보세요.
- [ ] Repository Layer의 Prisma로 구현된 코드를 TypeORM으로 변경합니다.

<br>

---

### **준비**

- [ ]  숙련주차에서 만든 Repository에서 프로젝트를 Copy합니다.
- [ ]  Copy된 Repository를 내 피씨에 내려받고 정상 실행되는지 확인합니다.

### 개발

- [ ]  routes 의 코드를 **3-Layered Architecture** 로 여러개의 코드로 분리합니다.
- [ ]  화살표 함수를 사용하지 않았다면 화살표 함수료 코드를 변경합니다.
- [ ]  각 Layer 의 코드를 Class로 변환합니다.
- [ ]  Prisma 를 TypeORM 으로 변환합니다.
- [ ]  각 Layer 의 Class에 Test Case 를 작성합니다.

### **테스트**

- [ ]  REST API Client 툴을 이용해서 API를 호출하고, API 명세서에 정의 한 Response와 동일하게 동작하는지 확인합니다.
- [ ]  작성된 모든 Test Case 가 일괄 오류없이 실행되는지 확인합니다.

### **배포**

- [ ]  AWS EC2 인스턴스에 Github의 소스를 내려받습니다.
- [ ]  PM2를 이용해 서버를 실행시킵니다.


## 제출 전 체크사항

### 준비

- [ ]  새로 생성한 Repository는 숙련주차에서 작성한 Repository를 Fork한 Repository 입니까?

### 개발

- [ ]  rotues 에 있던 모든 코드가 3-Layered Architecture 로 분리되었나요?
- [ ]  Class 로 개발되었나요?
- [ ]  Prisma 를 TypeORM 으로 변경하셨나요?
- [ ]  모든 Layer에 Test Case 는 모두 작성하셨나요?
- [ ]  Test Case 전체 실행에도 문제없나요?
- [ ]  PM2 에서 실행되도록 설정하셨나요?



## 🤔 더 고민해 보기

1. Class로 리팩토링 했을 때 장점이 무엇인지 설명해 주세요.
>
2. 3-Layered Architecture의 장점과 단점을 아는대로 적어주세요.
>
3. 이번 과제에서 Prisma를 TypeORM로 교체할 때 3-Layered Architecture를 기반으로 프로젝트가 구성되어있으면 어떤 장점이 있었나요?
>
4. 테스트코드 작성의 장점과 단점을 아는대로 적어주세요.
>
5. 테스트의 종류 3가지와 각각이 무엇인지 간단히 설명해 주세요. 
>
6. 서버가 2대 이상 있을경우 장점이 어떤게 있고, 무중단 서비스는 어떤 원리로 동작하는지 설명해주세요.
> 