import { ArrowBack, Lock } from '@mui/icons-material';
import { Alert, Box, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, FormField } from '../../components/ui';
import { authResetPassword } from '../../utils/authUtils';
import { validationRules } from '../../utils/validation';

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

interface LocationState {
  userInfo: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  email: string;
  emailVerified: boolean;
}

const PasswordSetup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // 폼 상태 관리
  const [formData, setFormData] = React.useState<PasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = React.useState<Partial<PasswordFormData>>({});
  const [touched, setTouched] = React.useState<
    Partial<Record<keyof PasswordFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 검증 함수들
  const validatePassword = (password: string): string => {
    return validationRules.password(password);
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string => {
    return validationRules.confirmPassword(confirmPassword, password);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordFormData> = {};

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 입력 핸들러들
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));

    if (touched.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }

    // 비밀번호 확인 필드도 재검증
    if (formData.confirmPassword && touched.confirmPassword) {
      const confirmError = validateConfirmPassword(
        value,
        formData.confirmPassword
      );
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    setTouched(prev => ({ ...prev, confirmPassword: true }));

    const error = validateConfirmPassword(formData.password, value);
    setErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    const error = validatePassword(formData.password);
    setErrors(prev => ({ ...prev, password: error }));
  };

  const handleConfirmPasswordBlur = () => {
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    const error = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    setErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registerData = {
        id: state.userInfo.id,
        password: formData.password,
      };

      const result = await authResetPassword(registerData);
      setError('');
      if (result.success) {
        setSuccess('비밀번호가 설정되었습니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('비밀번호 설정 오류입니다.');
      }
    } catch (error: any) {
      console.error('비밀번호 설정 오류:', error);
      setError('비밀번호 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  useEffect(() => {
    // 사용자 정보가 없는 경우 리다이렉트
    if (!state || !state.userInfo) {
      navigate('/user-find?mode=register');
      return;
    }
  }, [state, navigate]);

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className='auth-container'>
      <div className='auth-paper'>
        {/* 헤더 */}
        <div className='header-box'>
          <IconButton
            onClick={handleCancel}
            sx={{ position: 'absolute', left: 0 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', mx: 'auto' }}>
            <Lock sx={{ mr: 1, color: 'var(--primary)' }} />
            <Typography variant='h6' component='h1' fontWeight={600}>
              비밀번호 설정
            </Typography>
          </Box>
        </div>

        {/* 사용자 정보 표시 */}
        <div className='user-info-box'>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            확인된 사용자 정보
          </Typography>
          <Typography variant='body1' fontWeight={500}>
            이름: {state?.userInfo?.name}
          </Typography>
          <Typography variant='body1' fontWeight={500}>
            이메일: {state?.email}
          </Typography>
        </div>

        {/* 안내 메시지 */}
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 3, textAlign: 'center' }}
        ></Typography>

        {/* 알림 메시지 */}
        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity='success' sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* 폼 */}
        <Box component='form' onSubmit={handleSubmit}>
          <div className='input-group'>
            {/* 비밀번호 */}
            <FormField
              fullWidth
              label='비밀번호'
              type='password'
              value={formData.password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={errors.password}
              touched={touched.password}
              helperText='8자리 이상, 특수문자, 영어 소문자, 숫자를 포함해야 합니다.'
              required
              autoComplete='new-password'
              autoFocus
            />

            {/* 비밀번호 확인 */}
            <FormField
              fullWidth
              label='비밀번호 재확인'
              type='password'
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              helperText='비밀번호를 다시 입력해주세요.'
              required
              autoComplete='new-password'
            />
          </div>

          {/* 버튼 */}
          <div className='button-group full-width'>
            <Button
              type='submit'
              variant='primary'
              fullWidth
              loading={isSubmitting}
            >
              비밀번호 설정
            </Button>

            <Button
              variant='text'
              fullWidth
              onClick={handleCancel}
              sx={{
                color: 'var(--primary)',
                '&:hover': {
                  backgroundColor: 'rgba(78, 205, 196, 0.04)',
                },
              }}
            >
              로그인 화면으로 돌아가기
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default PasswordSetup;
