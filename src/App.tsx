import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import EmailVerificationPage from './components/auth/EmailVerificationPage';
import LoginForm from './components/auth/LoginForm';
import PasswordSetup from './components/auth/PasswordSetup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserFindPage from './components/auth/UserFindPage';
import MainLayout from './components/layouts/MainLayout';
import MeetingAdd from './components/main/MeetingAdd';
import MeetingDetail from './components/main/MeetingDetail';
import MeetingRecords from './components/main/MeetingRecords';
import ServiceSelection from './components/main/ServiceSelection';
import WelcomePage from './components/main/WelcomePage';
import MemberList from './components/members/MemberList';
import { store } from './store';

// Material-UI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#4ecdc4',
      light: '#a6e7e2',
      dark: '#3aa39b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5dade2',
      light: '#8cd6ff',
      dark: '#0096ee',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fdff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#455a64',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
    },
    info: {
      main: '#85c1e9',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* 공개 라우트 */}
            <Route path='/' element={<WelcomePage />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/user-find' element={<UserFindPage />} />
            <Route
              path='/email-verification'
              element={<EmailVerificationPage />}
            />
            <Route path='/password-setup' element={<PasswordSetup />} />

            {/* 보호된 라우트 */}
            <Route
              path='/main/*'
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to='service-selection' replace />}
              />
              <Route path='service-selection' element={<ServiceSelection />} />
            </Route>

            {/* 독립 레이아웃 라우트 (자체 헤더 사용) */}
            <Route
              path='/main/member-management'
              element={
                <ProtectedRoute>
                  <MemberList />
                </ProtectedRoute>
              }
            />
            <Route
              path='/main/meeting-records'
              element={
                <ProtectedRoute>
                  <MeetingRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path='/main/meeting-add'
              element={
                <ProtectedRoute>
                  <MeetingAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path='/main/meeting-detail/:organizationId/:activityId/:activityInstanceId'
              element={
                <ProtectedRoute>
                  <MeetingDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
