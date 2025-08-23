# 🔐 인증 기능 마이그레이션 가이드

Vue 코드의 모든 인증 기능을 React Redux Toolkit으로 마이그레이션 완료했습니다!

## 📋 마이그레이션 완료된 기능들

### ✅ 완료된 기능들
- [x] 로그인 (`authLogin`)
- [x] 로그아웃 (`authLogout`)
- [x] 토큰 체크 (`authTokenCheck`)
- [x] 토큰 갱신 (`authRefreshToken`)
- [x] 이메일 중복 체크 (`authCheckEmailDuplication`)
- [x] 이름 중복 체크 (`authCheckUserName`)
- [x] 전화번호 체크 (`authCheckPhoneNumber`)
- [x] 이메일 인증 코드 전송 (`authCheckEmail`)
- [x] 인증 코드 확인 (`authVerifyCode`)
- [x] 사용자 등록 (`authRegister`)
- [x] 비밀번호 재설정 (`authResetPassword`)

## 🚀 사용 방법

### 1. 직접 Redux 액션 사용

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, checkEmailDuplication } from '../store/slices/authSlice';

// 컴포넌트에서 사용
const MyComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(login({ email: 'test@example.com', password: 'password' }));
    if (login.fulfilled.match(result)) {
      console.log('로그인 성공!');
    }
  };

  const handleEmailCheck = async () => {
    const result = await dispatch(checkEmailDuplication('test@example.com'));
    if (checkEmailDuplication.fulfilled.match(result)) {
      console.log('이메일 사용 가능');
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>로그인</button>
      <button onClick={handleEmailCheck}>이메일 체크</button>
    </div>
  );
};
```

### 2. 유틸리티 함수 사용 (권장)

```typescript
import { authLogin, authCheckEmailDuplication, authRegister } from '../utils/authUtils';

// 로그인
const handleLogin = async () => {
  const result = await authLogin('test@example.com', 'password');
  if (result.success) {
    console.log('로그인 성공:', result.message);
  } else {
    console.error('로그인 실패:', result.message);
  }
};

// 이메일 중복 체크
const handleEmailCheck = async () => {
  const result = await authCheckEmailDuplication('test@example.com');
  if (result.result === 0) {
    console.log('이메일 사용 가능:', result.message);
  } else {
    console.log('이메일 중복:', result.message);
  }
};

// 사용자 등록
const handleRegister = async () => {
  const userData = {
    name: '홍길동',
    email: 'test@example.com',
    password: 'password',
    phoneNumber: '010-1234-5678'
  };
  
  const result = await authRegister(userData);
  if (result.success) {
    console.log('등록 성공:', result.message);
  } else {
    console.error('등록 실패:', result.message);
  }
};
```

## 🔄 Vue → React 매핑

| Vue 함수 | React 함수 | 설명 |
|----------|------------|------|
| `authLogin()` | `authLogin()` | 로그인 |
| `authTokenCheck()` | `authTokenCheck()` | 토큰 유효성 체크 |
| `authRefreshToken()` | `authRefreshToken()` | 토큰 갱신 |
| `authCheckEmailDuplication()` | `authCheckEmailDuplication()` | 이메일 중복 체크 |
| `authCheckUserName()` | `authCheckUserName()` | 이름 중복 체크 |
| `authCheckPhoneNumber()` | `authCheckPhoneNumber()` | 전화번호 체크 |
| `authCheckEmail()` | `authCheckEmail()` | 이메일 인증 코드 전송 |
| `authVerifyCode()` | `authVerifyCode()` | 인증 코드 확인 |
| `authRegister()` | `authRegister()` | 사용자 등록 |
| `authResetPassword()` | `authResetPassword()` | 비밀번호 재설정 |

## 📁 파일 구조

```
src/
├── store/
│   └── slices/
│       └── authSlice.ts          # Redux 인증 상태 관리
├── utils/
│   ├── axiosClient.ts            # HTTP 클라이언트
│   └── authUtils.ts              # 인증 유틸리티 함수들
└── components/
    └── auth/
        └── LoginForm.tsx         # 로그인 컴포넌트
```

## 🎯 주요 개선사항

1. **타입 안전성**: TypeScript로 완전한 타입 지원
2. **상태 관리**: Redux Toolkit으로 중앙화된 상태 관리
3. **에러 처리**: 통일된 에러 처리 방식
4. **토큰 관리**: 자동 토큰 갱신 및 로그아웃 처리
5. **동명이인 처리**: 이름 중복 체크시 동명이인 처리 로직 포함

## 🔧 설정

### Redux Store 설정
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### App.tsx에서 Provider 설정
```typescript
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      {/* 앱 컴포넌트들 */}
    </Provider>
  );
}
```

## 🚨 주의사항

1. **API 엔드포인트**: 백엔드 API 엔드포인트가 Vue 코드와 동일해야 합니다
2. **토큰 형식**: `accessToken`과 `refreshToken` 형식 확인 필요
3. **에러 응답**: 백엔드 에러 응답 형식 확인 필요
4. **로컬 스토리지**: 토큰이 `localStorage`에 저장됩니다

## ✅ 마이그레이션 완료!

이제 Vue 코드의 모든 인증 기능을 React에서 사용할 수 있습니다! 🎉 