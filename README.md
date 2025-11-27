# 프론트엔드 과제 프로젝트

React와 TypeScript를 기반으로 구현한 게시판 및 데이터 시각화 웹 애플리케이션입니다.

## 프로젝트 실행 방법

### 설치 및 실행

1. 프로젝트 클론

```bash
git clone git@github.com:JINWORLD13/Cosmos.git
cd post
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 빌드

```bash
npm run build
```

5. 빌드 결과물 미리보기

```bash
npm run preview
```

개발 서버 실행 후 브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속하세요.

## 사용한 기술 스택

### 핵심 기술

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4

### 주요 라이브러리

- **React Router DOM** 7.9.6 - 라우팅 관리
- **Recharts** 3.5.0 - 데이터 시각화 차트 라이브러리
- **Axios** 1.13.2 - HTTP 클라이언트
- **SCSS** - 스타일링

### 개발 도구

- **ESLint** - 코드 린팅
- **TypeScript ESLint** - TypeScript 린팅

## 주요 구현 기능 요약

### 1. 게시판 기능

#### CRUD 기능

- 게시글 작성: 제목, 본문, 카테고리, 태그 입력
- 게시글 조회: 테이블 형태로 목록 표시
- 게시글 수정: 기존 게시글 내용 수정
- 게시글 삭제: 게시글 삭제 기능

#### 테이블 기능

- 컬럼별 넓이 조절 가능
- 특정 컬럼 숨김/보임 기능
- 무한 스크롤 기반 페이지네이션

#### 검색 및 필터링

- 제목 및 본문 내용 검색
- 카테고리별 필터링 (NOTICE, QNA, FREE)
- 정렬 기능: title 또는 createdAt 기준 오름/내림차순

#### 유효성 검사

- 금칙어 필터: "캄보디아", "프놈펜", "불법체류", "텔레그램" 포함 시 등록 불가
- 제목 최대 80자 제한
- 본문 최대 2000자 제한
- 태그 최대 5개, 각 24자 이내 제한

#### 인증

- JWT 토큰 기반 인증
- 로그인 후 게시판 접근 가능
- Authorization 헤더를 통한 API 인증

### 2. 데이터 시각화 기능

#### 바 차트 및 도넛 차트

- `/mock/top-coffee-brands`: 커피 브랜드 바 차트 및 도넛 차트
- `/mock/popular-snack-brands`: 스낵 브랜드 바 차트 및 도넛 차트

#### 스택형 바 차트 및 면적 차트

- `/mock/weekly-mood-trend`: 주간 기분 트렌드 스택형 바 차트 및 면적 차트
  - 항목: happy, tired, stressed
  - X축: week, Y축: 백분율(%)
- `/mock/weekly-workout-trend`: 주간 운동 트렌드 스택형 바 차트 및 면적 차트
  - 항목: running, cycling, stretching
  - X축: week, Y축: 백분율(%)

#### 멀티라인 차트

- `/mock/coffee-consumption`: 커피 섭취량과 버그 수, 생산성 점수 관계
  - X축: 커피 섭취량(잔/일)
  - 왼쪽 Y축: 버그 수(bugs)
  - 오른쪽 Y축: 생산성 점수(productivity)
- `/mock/snack-impact`: 스낵 수와 회의불참, 사기 관계
  - X축: 스낵 수
  - 왼쪽 Y축: 회의불참(meetingMissed)
  - 오른쪽 Y축: 사기(morale)

#### 차트 공통 기능

- 범례(Legend) 표시
- 범례에서 색상 변경 가능
- 범례에서 데이터 보이기/숨기기 가능
- 멀티라인 차트 툴팁: 호버 시 해당 팀의 데이터만 표시
- 데이터 포인트 마커: 원형(버그 수, 회의불참), 사각형(생산성, 사기)
- 팀별 색상 일관성 유지

## API 정보

- **Swagger 문서**: https://fe-hiring-rest-api.vercel.app/docs
- **Base URL**: https://fe-hiring-rest-api.vercel.app