import { AccountCircle, ArrowBack, Phone } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authCheckPhoneNumber, authCheckUserName } from '../../utils/authUtils';

interface UserFindPageProps {}

interface UserData {
  email?: string;
  phone_number?: string;
  [key: string]: any;
}

const UserFindPage: React.FC<UserFindPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode') || 'register'; // 'register' or 'reset'

  // 단계 관리: 'name' -> 'phone'
  const [step, setStep] = useState<'name' | 'phone'>('name');

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  // 사용자 데이터 저장
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 성공 메시지 생성 헬퍼 함수
  const createSuccessMessage = (hasDuplicates: boolean = false) => {
    const baseMessage = `${formData.name}님, 반갑습니다!`;
    if (hasDuplicates) {
      return `${baseMessage}\n동명이인이 있습니다. 전화번호를 입력해주세요.`;
    }
    return `${baseMessage}\n전화번호를 입력해주세요.`;
  };

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      // 전화번호 필드는 숫자만 허용
      if (field === 'phoneNumber') {
        value = value.replace(/[^0-9]/g, '');
      }

      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));

      // 에러는 항상 지우기
      if (error) setError('');

      // 전화번호 입력 시에는 성공 메시지 유지
      if (success && field !== 'phoneNumber') {
        setSuccess('');
      }
    };

  // 이름 확인 로직
  const handleNameCheck = async () => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authCheckUserName(formData.name);
      if (result.message === '이름이 있습니다.') {
        // 이름이 존재함
        if (result.hasDuplicates && result.userList) {
          // 동명이인이 있는 경우
          setUserList(result.userList);
          setHasDuplicates(true);
          setSuccess(createSuccessMessage(true));
        } else if (!result.hasDuplicates && result.userData) {
          // 단일 사용자
          setUserData(result.userData);
          setHasDuplicates(false);
          setSuccess(createSuccessMessage(false));
        } else {
          // 기존 로직 (하위 호환성)
          setSuccess(createSuccessMessage(false));
        }
        // 전화번호 입력 단계로 이동
        setStep('phone');
      } else {
        // 이름이 없음
        setError('이름이 없습니다. 관리자에게 문의하세요.');
      }
    } catch (error: any) {
      console.error('이름 확인 중 오류:', error);
      setError('이름 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 전화번호 확인 로직
  const handlePhoneCheck = async () => {
    // 전화번호 유효성 검증
    if (!formData.phoneNumber.trim()) {
      setError('전화번호를 입력해주세요.');
      return;
    }
    if (formData.phoneNumber.length < 10 || formData.phoneNumber.length > 11) {
      setError('올바른 전화번호를 입력해주세요. (10-11자리)');
      return;
    }
    if (!/^01[0-9]/.test(formData.phoneNumber)) {
      setError('휴대폰 번호는 010, 011, 016, 017, 018, 019로 시작해야 합니다.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 동명이인 처리
      if (hasDuplicates && userList.length > 0) {
        const matchedUser = userList.find(
          user => user.phone_number === formData.phoneNumber
        );

        if (matchedUser) {
          setSuccess('전화번호가 일치합니다.');
          // 비밀번호 설정 페이지로 이동
          navigate('/password-setup', {
            state: {
              userInfo: {
                id: matchedUser.id,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
              },
              email: matchedUser.email,
              emailVerified: true,
            },
          });
        } else {
          setError('일치하는 사용자가 없습니다.');
        }
      }
      // 단일 사용자 처리
      else if (userData) {
        if (userData.phone_number === formData.phoneNumber) {
          setSuccess('전화번호가 일치합니다.');
          // 비밀번호 설정 페이지로 이동
          navigate('/password-setup', {
            state: {
              userInfo: {
                id: userData.id,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
              },
              email: userData.email,
              emailVerified: true,
            },
          });
        } else {
          setError('전화번호가 일치하지 않습니다.');
        }
      }
      // 기존 API 호출 로직 (하위 호환성)
      else {
        const result = await authCheckPhoneNumber({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        });

        if (result.result === 1 || result.isMatched) {
          // 서버에서 사용자 ID를 반환했는지 확인
          if (!result.userData?.id) {
            setError('사용자 정보를 가져올 수 없습니다. 다시 시도해주세요.');
            return;
          }

          setSuccess('전화번호가 일치합니다.');
          navigate('/password-setup', {
            state: {
              userInfo: {
                id: result.userData.id, // 서버에서 반환받은 실제 사용자 ID
                name: formData.name,
                phoneNumber: formData.phoneNumber,
              },
              email: result.userData.email,
              emailVerified: true,
            },
          });
        } else {
          setError('전화번호가 일치하지 않습니다.');
        }
      }
    } catch (error: any) {
      console.error('전화번호 확인 중 오류:', error);
      setError(
        '전화번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (step === 'name') {
      await handleNameCheck();
    } else if (step === 'phone') {
      await handlePhoneCheck();
    }
  };

  const handleBack = () => {
    if (step === 'phone') {
      // 전화번호 단계에서 뒤로가기 시 이름 단계로
      setStep('name');
      setError('');
      setSuccess('');
      setFormData(prev => ({ ...prev, phoneNumber: '' }));
    } else {
      // 이름 단계에서 뒤로가기 시 이전 페이지로
      navigate(-1);
    }
  };

  const getTitle = () => {
    if (step === 'name') {
      return mode === 'reset' ? '비밀번호 재설정' : '사용자 정보 확인';
    } else {
      return '전화번호 확인';
    }
  };

  const getIcon = () => {
    return step === 'name' ? (
      <AccountCircle sx={{ fontSize: 150, mb: 4, color: '#262626' }} />
    ) : (
      <Phone sx={{ fontSize: 150, mb: 4, color: '#262626' }} />
    );
  };

  const getButtonText = () => {
    if (step === 'name') {
      return '다음으로';
    } else {
      return '확인';
    }
  };

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
          <Typography
            variant='h5'
            component='h1'
            fontWeight='bold'
            textAlign='center'
            sx={{
              flex: 1,
              color: 'text.primary',
            }}
          >
            {getTitle()}
          </Typography>
        </div>

        {/* 아이콘 */}
        <Box textAlign='center' sx={{ mb: 2 }}>
          {getIcon()}
        </Box>

        <Typography
          variant='body1'
          color='text.secondary'
          textAlign='center'
          sx={{ mb: 3, lineHeight: 1.6 }}
        ></Typography>

        {/* 성공 메시지 */}
        {success && (
          <Alert
            severity='success'
            sx={{
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-message': {
                whiteSpace: 'pre-line',
              },
            }}
          >
            {success}
          </Alert>
        )}

        {/* 에러 메시지 */}
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

        {/* 동명이인 안내 메시지 */}
        {step === 'phone' && hasDuplicates && (
          <Alert
            severity='warning'
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            동명이인이 있습니다. 전화번호를 입력해주세요.
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit}>
          {/* 이름 입력 단계 */}
          {step === 'name' && (
            <Fade in={step === 'name'}>
              <TextField
                className='common-textfield'
                fullWidth
                label='터치해서 이름을 입력하세요'
                variant='outlined'
                value={formData.name}
                onChange={handleInputChange('name')}
                disabled={loading}
                placeholder='김갈렙'
                autoComplete='name'
                autoFocus
              />
            </Fade>
          )}

          {/* 전화번호 입력 단계 */}
          {step === 'phone' && (
            <Fade in={step === 'phone'}>
              <TextField
                className='common-textfield'
                fullWidth
                label='터치해서 전화번호를 입력하세요'
                variant='outlined'
                value={formData.phoneNumber}
                onChange={handleInputChange('phoneNumber')}
                disabled={loading}
                placeholder='01012345678'
                autoComplete='tel'
                autoFocus
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 11,
                }}
              />
            </Fade>
          )}

          <Button
            className='common-button'
            type='submit'
            fullWidth
            variant='contained'
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              getButtonText()
            )}
          </Button>
        </Box>

        {/* 하단 안내 텍스트 */}
        {step === 'name' && !success && !error && (
          <Box textAlign='center' sx={{ mt: 3, mb: 2 }}>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ lineHeight: 1.6 }}
            ></Typography>
          </Box>
        )}

        <Box textAlign='center' mt={3}>
          <Typography variant='body2' color='text.secondary'>
            {mode === 'reset'
              ? '로그인 화면으로 돌아가기'
              : '이미 계정이 있으신가요?'}
          </Typography>
          <Button
            variant='text'
            onClick={() => navigate('/login')}
            sx={{
              mt: 1,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            로그인하기
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default UserFindPage;
