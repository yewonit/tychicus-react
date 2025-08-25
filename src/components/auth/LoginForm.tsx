import { Person, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { login } from '../../store/slices/authSlice';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/main/service-selection');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className='login-container'>
      <Paper className='login-paper'>
        <Box className='login-header'>
          <Typography variant='h5' component='h1' className='login-title'>
            로그인
          </Typography>

          <Box className='user-icon-container'>
            <Box className='user-icon-circle'>
              <Person sx={{ fontSize: 45, color: '#374151' }} />
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity='error' className='error-alert'>
            {error}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder='터치해서 이메일을 입력하세요'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='login-input-field'
            autoComplete='username'
            InputProps={{
              style: { fontSize: '1rem', textAlign: 'center' },
            }}
          />

          <TextField
            fullWidth
            placeholder='터치해서 비밀번호를 입력하세요'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='login-input-field'
            autoComplete='current-password'
            InputProps={{
              style: { fontSize: '1rem', textAlign: 'center' },
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handlePasswordToggle}
                    edge='end'
                    className='password-toggle-button'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className='links-container'>
            <Link
              component='button'
              type='button'
              onClick={() => navigate('/user-find?mode=register')}
              className='link'
              sx={{ textDecoration: 'none' }}
            >
              이메일과 비밀번호가 없나요?
            </Link>
            <Link
              component='button'
              type='button'
              onClick={() => navigate('/user-find?mode=reset')}
              className='link'
              sx={{ textDecoration: 'none' }}
            >
              비밀번호를 잃어버렸어요.
            </Link>
          </Box>

          <Typography variant='body2' className='encouragement-text'>
            <Box component='span' className='bold-text'>
              믿음의 눈
            </Box>
            으로{' '}
            <Box component='span' className='bold-text'>
              약속의 땅
            </Box>
            을 차지할
            <br />
            <Box component='span' className='bold-text'>
              하나님 나라의 청년
            </Box>
            !
          </Typography>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={loading}
            className='login-button'
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              '로그인'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
