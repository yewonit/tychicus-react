module.exports = {
  framework: 'react',
  typescript: true,
  version: '18.2.0',
  
  // 프로젝트 구조 설정
  structure: {
    components: 'src/components',
    pages: 'src/pages',
    hooks: 'src/hooks',
    utils: 'src/utils',
    types: 'src/types',
    store: 'src/store',
    styles: 'src/styles'
  },
  
  // UI 프레임워크 설정
  ui: {
    framework: 'mui',
    version: '5.13.7',
    styling: 'emotion', // @emotion/styled 사용
    theme: {
      primary: {
        main: '#4ecdc4',
        light: '#a6e7e2',
        dark: '#3aa39b'
      },
      secondary: {
        main: '#5dade2',
        light: '#8cd6ff',
        dark: '#0096ee'
      },
      background: {
        default: '#f8fdff',
        paper: '#ffffff'
      }
    }
  },
  
  // 상태 관리 설정
  state: {
    framework: 'redux-toolkit',
    slices: ['auth', 'attendance', 'organization']
  },
  
  // 라우팅 설정
  routing: {
    framework: 'react-router',
    version: '6.11.2',
    mode: 'browser'
  },
  
  // API 설정
  api: {
    client: 'axios',
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    authUrl: process.env.REACT_APP_AUTH_BASE_URL,
    interceptors: true
  },
  
  // 환경 설정
  environments: {
    development: {
      apiUrl: 'https://attendance-dev.icoramdeo.com/api',
      authUrl: 'https://attendance-dev.icoramdeo.com/auth'
    },
    production: {
      apiUrl: 'https://attendance.icoramdeo.com/api',
      authUrl: 'https://attendance.icoramdeo.com/auth'
    },
    local: {
      apiUrl: 'http://localhost:3000/api',
      authUrl: 'http://localhost:3000/auth'
    }
  },
  
  // 코드 생성 옵션
  generate: {
    components: {
      functional: true,
      typescript: true,
      styled: 'emotion',
      testing: true
    },
    api: {
      client: true,
      types: true,
      interceptors: true
    }
  }
};