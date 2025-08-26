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
    },
    secondary: {
      main: '#5dade2',
    },
    background: {
      default: '#f8fdff',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
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
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
