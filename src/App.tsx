import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AttendanceDashboard from './components/attendance/AttendanceDashboard';
import AttendanceInput from './components/attendance/AttendanceInput';
import EmailVerificationPage from './components/auth/EmailVerificationPage';
import LoginForm from './components/auth/LoginForm';
import PasswordSetup from './components/auth/PasswordSetup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserFindPage from './components/auth/UserFindPage';
import MainLayout from './components/layouts/MainLayout';
import ServiceSelection from './components/main/ServiceSelection';
import WelcomePage from './components/main/WelcomePage';
import MemberList from './components/members/MemberList';
import PrayerTopic from './components/prayer/PrayerTopic';
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
              <Route
                path='attendance-dashboard'
                element={<AttendanceDashboard />}
              />
              <Route path='attendance-input' element={<AttendanceInput />} />
              <Route path='member-list' element={<MemberList />} />
              <Route path='prayer-topic' element={<PrayerTopic />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
