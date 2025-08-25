import { ArrowBack, Email, Lock } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  authCheckEmail,
  authCheckEmailDuplication,
  authResetPassword,
  authVerifyCode,
} from '../../utils/authUtils';

interface LocationState {
  mode: 'register' | 'reset';
  userInfo: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  userData?: {
    email?: string;
    [key: string]: any;
  } | null;
}

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // 상태가 없으면 이전 페이지로 리다이렉트
  useEffect(() => {
    if (!state || !state.userInfo) {
      navigate('/user-find?mode=register');
    }
  }, [state, navigate]);

  const [step, setStep] = useState<
    'email' | 'send' | 'verification' | 'password'
  >('email');
  const [formData, setFormData] = useState({
    email: state?.userData?.email || '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEmailReadonly, setIsEmailReadonly] = useState(
    !!state?.userData?.email
  );

  useEffect(() => {
    // 사용자 데이터에 이메일이 있으면 인증번호 발송 단계로
    if (state?.userData?.email) {
      setFormData(prev => ({ ...prev, email: state.userData?.email || '' }));
      setIsEmailReadonly(true);
      setStep('send');
    }
  }, [state]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError('');
      if (success) setSuccess('');
    };

  // 이메일 확인 후 발송 단계로 이동
  const handleEmailCheck = async () => {
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 이메일 중복 확인 (신규 가입 모드인 경우)
      if (state.mode === 'register') {
        const duplicateResult = await authCheckEmailDuplication(formData.email);
        if (duplicateResult.result === 1) {
          setError('이미 등록된 이메일입니다.');
          setLoading(false);
          return;
        }
      }

      // 이메일 유효성만 확인하고 발송 단계로 이동
      setSuccess('이메일이 확인되었습니다. 인증번호를 발송하세요.');
      setStep('send');
    } catch (error: any) {
      console.error('이메일 확인 오류:', error);
      setError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 발송
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // 인증번호 발송
      const result = await authCheckEmail(formData.email);
      if (result.result === 1) {
        setSuccess('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
        setStep('verification');
      } else {
        setError(result.message || '인증번호 발송 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('이메일 인증 오류:', error);
      setError('인증번호 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!formData.verificationCode.trim()) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authVerifyCode(
        formData.email,
        formData.verificationCode
      );
      if (result.result === 1) {
        setSuccess('이메일 인증이 완료되었습니다.');

        if (state.mode === 'reset') {
          // 비밀번호 재설정 모드인 경우 비밀번호 입력 단계로
          setStep('password');
        } else {
          // 신규 가입 모드인 경우 비밀번호 설정 페이지로 이동
          navigate('/password-setup', {
            state: {
              userInfo: state.userInfo,
              email: formData.email,
              emailVerified: true,
            },
          });
        }
      } else {
        setError(result.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('인증번호 확인 오류:', error);
      setError('인증번호 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authResetPassword({
        email: formData.email,
        password: formData.newPassword,
        name: state.userInfo.name,
        phoneNumber: state.userInfo.phoneNumber,
      });

      if (result.result) {
        setSuccess('비밀번호가 성공적으로 재설정되었습니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || '비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error);
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (step === 'email') {
      await handleEmailCheck();
    } else if (step === 'send') {
      await handleEmailSubmit();
    } else if (step === 'verification') {
      await handleCodeVerification();
    } else if (step === 'password') {
      await handlePasswordReset();
    }
  };

  const handleBack = () => {
    if (step === 'email') {
      navigate(-1);
    } else if (step === 'send') {
      if (isEmailReadonly) {
        navigate(-1);
      } else {
        setStep('email');
      }
    } else if (step === 'verification') {
      setStep('send');
    } else if (step === 'password') {
      setStep('verification');
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authCheckEmail(formData.email);
      if (result.result === 1) {
        setSuccess('인증번호가 재발송되었습니다.');
      } else {
        setError('인증번호 재발송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('인증번호 재발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (step === 'email') {
      return '이메일 인증';
    } else if (step === 'send') {
      return '인증번호 발송';
    } else if (step === 'verification') {
      return '인증번호 확인';
    } else {
      return '새 비밀번호 설정';
    }
  };

  const getStepIcon = () => {
    if (step === 'password') {
      return <Lock sx={{ mr: 1, color: 'primary.main' }} />;
    }
    return <Email sx={{ mr: 1, color: 'primary.main' }} />;
  };

  if (!state || !state.userInfo) {
    return null;
  }

  return (
    <div className='auth-container'>
      <div className='auth-paper'>
        <div className='header-box'>
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              left: -8,
              p: 1,
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {getStepIcon()}
            <Typography
              variant='h5'
              component='h1'
              fontWeight='bold'
              sx={{ color: 'text.primary' }}
            >
              {getTitle()}
            </Typography>
          </Box>
        </div>

        {/* 사용자 정보 표시 */}
        <div className='user-info-box'>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            확인된 사용자 정보
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`이름: ${state.userInfo.name}`} size='small' />
            <Chip
              label={`전화번호: ${state.userInfo.phoneNumber}`}
              size='small'
            />
          </Box>
        </div>

        {error && (
          <Alert
            severity='error'
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity='success'
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit}>
          {step === 'email' && (
            <>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                {state.mode === 'reset'
                  ? '비밀번호를 재설정할 이메일 주소를 입력해주세요.'
                  : '가입할 이메일 주소를 입력해주세요.'}
              </Typography>

              <TextField
                className='common-textfield'
                fullWidth
                label='이메일'
                type='email'
                variant='outlined'
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={loading || isEmailReadonly}
                placeholder='example@email.com'
                autoComplete='email'
                InputProps={{
                  readOnly: isEmailReadonly,
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  '이메일 확인'
                )}
              </Button>
            </>
          )}

          {step === 'send' && (
            <>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                <strong>{formData.email}</strong>로 인증번호를 발송합니다.
                <br />
                아래 버튼을 클릭하여 인증번호를 받으세요.
              </Typography>

              <TextField
                fullWidth
                label='이메일'
                type='email'
                variant='outlined'
                value={formData.email}
                disabled={true}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  '인증번호 발송'
                )}
              </Button>
            </>
          )}

          {step === 'verification' && (
            <>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                <strong>{formData.email}</strong>로 발송된 인증번호를
                입력해주세요.
              </Typography>

              <TextField
                fullWidth
                label='인증번호'
                variant='outlined'
                value={formData.verificationCode}
                onChange={handleInputChange('verificationCode')}
                disabled={loading}
                placeholder='6자리 인증번호'
                inputProps={{ maxLength: 6 }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  '인증번호 확인'
                )}
              </Button>

              <Button
                fullWidth
                variant='text'
                onClick={handleResendCode}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                인증번호 재발송
              </Button>
            </>
          )}

          {step === 'password' && (
            <>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                새로운 비밀번호를 설정해주세요.
              </Typography>

              <TextField
                fullWidth
                label='새 비밀번호'
                type='password'
                variant='outlined'
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                disabled={loading}
                placeholder='8자 이상 입력'
                autoComplete='new-password'
              />

              <TextField
                fullWidth
                label='비밀번호 확인'
                type='password'
                variant='outlined'
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={loading}
                placeholder='비밀번호 재입력'
                autoComplete='new-password'
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  '비밀번호 재설정'
                )}
              </Button>
            </>
          )}
        </Box>

        <Box textAlign='center' mt={3}>
          <Button
            variant='text'
            onClick={() => navigate('/login')}
            sx={{
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            로그인 화면으로 돌아가기
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
