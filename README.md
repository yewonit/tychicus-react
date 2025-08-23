# 🏛️ Tychicus React - 교회 출석 관리 시스템

> Vue.js에서 React로 마이그레이션된 교회 출석 관리 시스템

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.1.6-007FFF?logo=mui)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.3.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)

## 📱 미리보기

<div align="center">

### 🎨 민트-스카이블루 테마의 모바일 최적화 디자인
![Welcome Screen](public/intro.png)

</div>

## ✨ 주요 기능

### 🔐 사용자 인증
- [x] 로그인/로그아웃
- [x] 사용자 찾기 (이름 + 전화번호)
- [x] 이메일 인증
- [x] 비밀번호 재설정
- [x] 토큰 기반 인증

### 📊 출석 관리
- [x] 출석 현황 대시보드
- [x] 출석 입력
- [x] 출석 통계 및 차트
- [ ] 출석 보고서 생성

### 👥 회원 관리
- [x] 회원 목록 조회
- [x] 회원 등록
- [ ] 회원 정보 수정
- [ ] 회원 그룹 관리

### 🙏 기타 기능
- [x] 기도제목 관리
- [ ] 교회 행사 관리
- [ ] 알림 시스템

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 리포지토리 클론
git clone https://github.com/yewonit/tychicus-react.git
cd tychicus-react

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# API 설정
REACT_APP_API_BASE_URL=https://attendance-dev.icoramdeo.com
REACT_APP_AUTH_BASE_URL=https://attendance-dev.icoramdeo.com/auth
REACT_APP_ENV=development
REACT_APP_USE_MOCK=false
```

## 🛠️ 기술 스택

### Frontend
- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.9.2** - 정적 타입 검사
- **Material-UI 6.1.6** - UI 컴포넌트 라이브러리
- **Redux Toolkit 2.3.0** - 상태 관리
- **React Router 6.28.0** - 클라이언트 사이드 라우팅
- **Axios 1.7.9** - HTTP 클라이언트

### 개발 도구
- **ESLint 9.17.0** - 코드 품질 검사
- **Prettier 3.4.2** - 코드 포맷팅
- **React Scripts 5.0.1** - 빌드 도구

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── attendance/     # 출석 관리 컴포넌트
│   ├── members/        # 회원 관리 컴포넌트
│   ├── main/           # 메인 페이지 컴포넌트
│   └── layouts/        # 레이아웃 컴포넌트
├── store/              # Redux 상태 관리
│   └── slices/         # Redux Toolkit slices
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
├── styles/             # 글로벌 스타일
└── App.tsx            # 메인 앱 컴포넌트
```

## 🎨 디자인 시스템

### 색상 팔레트
```css
:root {
  /* 메인 색상 - 민트와 하늘색 조화 */
  --primary: #4ecdc4;           /* 민트 그린 */
  --primary-light: #a6e7e2;    /* 연한 민트 */
  --primary-dark: #3aa39b;     /* 진한 민트 */
  
  --secondary: #5dade2;         /* 스카이 블루 */
  --secondary-light: #8cd6ff;  /* 연한 스카이 블루 */
  --secondary-dark: #0096ee;   /* 진한 스카이 블루 */
  
  --accent: #a8e6cf;           /* 연한 민트 악센트 */
}
```

### 타이포그래피
- **폰트**: NotoSansCJKKR, -apple-system, BlinkMacSystemFont
- **반응형 크기**: 12px ~ 48px
- **라인 높이**: 1.2 ~ 1.75

## 📱 모바일 최적화

- ✅ 터치 친화적 UI (최소 44px 터치 타겟)
- ✅ 반응형 디자인 (모바일 우선)
- ✅ 스와이프 제스처 지원
- ✅ PWA 준비 완료

## 🔧 개발 명령어

```bash
# 개발 서버 시작
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 코드 포맷팅
npm run format

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 전체 품질 검사
npm run quality-check
```

## 📈 성능 최적화

- ✅ React.memo를 통한 불필요한 리렌더링 방지
- ✅ Code Splitting (React.lazy)
- ✅ 이미지 최적화
- ✅ Bundle 분석 및 최적화

## 🧪 테스트

```bash
# 단위 테스트
npm test

# 테스트 커버리지
npm test -- --coverage
```

## 🚀 배포

### Vercel 배포
```bash
npm run build
# vercel CLI를 사용하거나 GitHub 연동
```

### Docker 배포
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코딩 컨벤션
- **ESLint + Prettier** 설정 준수
- **TypeScript** 엄격 모드 사용
- **컴포넌트**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE

## 📝 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 업무 수정, 패키지 매니저 수정
```

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🏛️ 프로젝트 배경

**Tychicus**는 사도 바울의 동역자였던 두기고의 이름에서 따온 것으로, 교회 공동체를 섬기는 마음을 담았습니다. 이 시스템은 교회의 출석 관리를 효율적으로 도와 목회자와 성도들이 더 나은 교제와 섬김에 집중할 수 있도록 돕습니다.

> *"믿음의 눈으로 약속의 땅을 차지할 하나님 나라의 청년!"*

## 📞 문의

- **개발자**: [@yewonit](https://github.com/yewonit)
- **프로젝트 링크**: [https://github.com/yewonit/tychicus-react](https://github.com/yewonit/tychicus-react)

---

<div align="center">

**🙏 교회 공동체를 위한 기술로 하나님 나라를 섬깁니다 🙏**

</div>