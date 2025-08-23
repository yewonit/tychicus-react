# Vue.js에서 React로 마이그레이션 가이드

## 프로젝트 개요

이 프로젝트는 **교회 출석 관리 시스템**으로, Vue.js 2.6.14에서 React 18로 마이그레이션하는 과정입니다.

## 현재 Vue.js 프로젝트 구조

### 주요 기능

1. **인증 시스템** - 로그인, 회원가입
2. **출석 관리** - 출석 입력, 집계, 통계
3. **회원 관리** - 회원 등록, 수정, 조회
4. **기도제목 관리**
5. **관리자 대시보드** - 통계, 조직 관리
6. **특별 관리** - 장기 결석자, 신규 가족 관리

### 기술 스택 (Vue.js)

- **Vue 2.6.14** + Vue Router + Vuex
- **Vuetify 2.6.0** (UI 프레임워크)
- **Chart.js** + **ECharts** (차트)
- **Axios** (HTTP 클라이언트)
- **AWS SDK** (파일 업로드)
- **ExcelJS** (엑셀 처리)

## React 마이그레이션 전략

### 1단계: React 프로젝트 생성 및 기본 설정 ✅

```bash
# React 프로젝트 생성
npx create-react-app tychicus-react-migration --template typescript

# 필요한 의존성 설치
npm install react-router-dom @types/react-router-dom axios chart.js react-chartjs-2
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @mui/x-date-pickers date-fns date-fns-tz moment-timezone
npm install file-saver xlsx exceljs aws-sdk
npm install @reduxjs/toolkit react-redux
```

### 2단계: 프로젝트 구조 설정 ✅

```
src/
├── components/
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── attendance/     # 출석 관리 컴포넌트
│   ├── members/        # 회원 관리 컴포넌트
│   ├── prayer/         # 기도제목 컴포넌트
│   ├── admin/          # 관리자 컴포넌트
│   └── layouts/        # 레이아웃 컴포넌트
├── store/
│   ├── index.ts        # Redux store 설정
│   └── slices/         # Redux slices
├── types/
│   └── index.ts        # TypeScript 타입 정의
├── utils/
│   └── axiosClient.ts  # Axios 설정
└── App.tsx
```

### 3단계: 핵심 컴포넌트 마이그레이션

#### Vue.js → React 컴포넌트 매핑

| Vue.js 컴포넌트           | React 컴포넌트        | 상태       |
| ------------------------- | --------------------- | ---------- |
| `LoginComp.vue`           | `LoginForm.tsx`       | ✅ 완료    |
| `MainLayout.vue`          | `MainLayout.tsx`      | ✅ 완료    |
| `AttendanceInputView.vue` | `AttendanceInput.tsx` | 🔄 진행 중 |
| `MemberListView.vue`      | `MemberList.tsx`      | 🔄 진행 중 |
| `PrayerTopicView.vue`     | `PrayerTopic.tsx`     | 🔄 진행 중 |

### 4단계: 상태 관리 마이그레이션

#### Vuex → Redux Toolkit

```typescript
// Vuex (기존)
const store = new Vuex.Store({
  modules: {
    auth,
    attendance,
    organization,
  },
});

// Redux Toolkit (새로운)
export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    organization: organizationReducer,
  },
});
```

### 5단계: 라우팅 마이그레이션

#### Vue Router → React Router

```typescript
// Vue Router (기존)
const routes = [
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: { title: '로그인' },
  },
];

// React Router (새로운)
<Routes>
  <Route path="/login" element={<LoginForm />} />
  <Route path="/" element={<MainLayout />}>
    <Route path="service-selection" element={<ServiceSelection />} />
  </Route>
</Routes>;
```

### 6단계: UI 프레임워크 마이그레이션

#### Vuetify → Material-UI

```typescript
// Vuetify (기존)
<v-btn color="primary" @click="handleClick">
  로그인
</v-btn>

// Material-UI (새로운)
<Button variant="contained" onClick={handleClick}>
  로그인
</Button>
```

## 마이그레이션 우선순위

### 높은 우선순위 (핵심 기능)

1. ✅ **인증 시스템** - 로그인/로그아웃
2. 🔄 **출석 입력** - 기본 출석 관리
3. 🔄 **회원 목록** - 회원 조회
4. 🔄 **서비스 선택** - 메인 네비게이션

### 중간 우선순위 (관리 기능)

1. 📋 **출석 대시보드** - 통계 및 차트
2. 📋 **회원 등록** - 새 회원 추가
3. 📋 **기도제목 관리** - 기도제목 CRUD
4. 📋 **조직 관리** - 조직 구조 관리

### 낮은 우선순위 (고급 기능)

1. 📋 **관리자 대시보드** - 통계 및 분석
2. 📋 **엑셀 내보내기** - 데이터 내보내기
3. 📋 **AWS S3 연동** - 파일 업로드
4. 📋 **특별 관리** - 장기 결석자 관리

## 다음 단계

### 즉시 해야 할 작업

1. **TypeScript 설정 수정** - JSX 설정 및 타입 오류 해결
2. **누락된 컴포넌트 생성** - ServiceSelection, ProtectedRoute 등
3. **API 연동** - 백엔드 API와의 연동 테스트
4. **스타일링** - Material-UI 테마 커스터마이징

### 단계별 마이그레이션 계획

#### 1주차: 기본 구조 완성

- [ ] TypeScript 설정 완료
- [ ] 기본 컴포넌트 생성
- [ ] 라우팅 설정 완료
- [ ] Redux store 연결

#### 2주차: 핵심 기능 구현

- [ ] 로그인/로그아웃 완성
- [ ] 출석 입력 기능
- [ ] 회원 목록 조회
- [ ] 기본 네비게이션

#### 3주차: 관리 기능 구현

- [ ] 출석 통계 및 차트
- [ ] 회원 등록/수정
- [ ] 기도제목 관리
- [ ] 조직 관리

#### 4주차: 고급 기능 및 최적화

- [ ] 관리자 대시보드
- [ ] 엑셀 내보내기
- [ ] 성능 최적화
- [ ] 테스트 코드 작성

## 주의사항

### 1. 상태 관리 차이점

- Vue.js: 반응형 데이터 시스템
- React: 불변성 원칙, Redux Toolkit 사용

### 2. 컴포넌트 라이프사이클

- Vue.js: `created`, `mounted`, `destroyed`
- React: `useEffect`, `useState` 훅 사용

### 3. 이벤트 처리

- Vue.js: `@click`, `v-on`
- React: `onClick`, 이벤트 핸들러 함수

### 4. 조건부 렌더링

- Vue.js: `v-if`, `v-show`
- React: 삼항 연산자, `&&` 연산자

## 유용한 리소스

### 공식 문서

- [React 공식 문서](https://react.dev/)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/)
- [Material-UI 문서](https://mui.com/)

### 마이그레이션 도구

- [Vue to React 마이그레이션 가이드](https://react.dev/learn/thinking-in-react)
- [TypeScript 설정 가이드](https://www.typescriptlang.org/docs/)

### 테스트 도구

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/)

## 결론

이 마이그레이션은 단계적으로 진행되어야 하며, 각 단계마다 테스트와 검증이 필요합니다. 특히 상태 관리와 라우팅 부분에서 주의가 필요하며, UI 컴포넌트의 일관성을 유지하는 것이 중요합니다.
