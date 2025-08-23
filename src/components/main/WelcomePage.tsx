import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import '../../styles/welcome.css';
import { authTokenCheck } from '../../utils/authUtils';

// 스타일드 컴포넌트
const WelcomeContainer = styled(Container)(({ theme: _theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
}));

const WelcomeImage = styled('img')({
  height: '220px',
  margin: '0 auto',
  objectFit: 'contain',
  animation: 'fadeIn 1.5s ease-in-out forwards',
});

const WelcomeText = styled(Typography, {
  shouldForwardProp: prop => prop !== '$fadeIn' && prop !== '$fadeOut',
})<{ $fadeIn: boolean; $fadeOut: boolean }>(({ $fadeIn, $fadeOut }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginTop: '2rem',
  animation: $fadeIn
    ? 'fadeIn 1.5s ease-in-out forwards'
    : $fadeOut
      ? 'fadeOut 1s ease-in-out forwards'
      : 'none',
}));

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { accessToken, refreshToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // 2초 후에 '환영합니다.' 텍스트 표시
    const welcomeTimer = setTimeout(() => {
      setWelcomeShown(true);
    }, 2000);

    // 토큰 체크 및 라우팅
    const checkTokenAndNavigate = async () => {
      if (accessToken && refreshToken) {
        try {
          const result = await authTokenCheck();

          if (result.success) {
            setTimeout(() => {
              navigate('/main/service-selection');
            }, 2000);
          } else {
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('토큰 체크 중 오류 발생:', error);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    // 4초 후에 토큰 체크 및 라우팅 실행
    const navigationTimer = setTimeout(checkTokenAndNavigate, 2000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(navigationTimer);
    };
  }, [accessToken, refreshToken, navigate]);

  return (
    <WelcomeContainer maxWidth={false}>
      <Box sx={{ mb: 4 }}>
        <WelcomeImage
          src='/intro.png'
          alt='Welcome'
          onError={e => {
            // 이미지 로드 실패시 기본 텍스트 표시
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallbackText = document.getElementById(
              'welcome-text-fallback'
            );
            const subText = document.getElementById('welcome-subtext-fallback');
            if (fallbackText) {
              fallbackText.style.display = 'block';
            }
            if (subText) {
              subText.style.display = 'block';
            }
          }}
        />
        {/* 이미지 로드 실패시 표시할 기본 텍스트 */}
        <Typography
          variant='h4'
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mt: 2,
            display: 'none',
          }}
          id='welcome-text-fallback'
        >
          MADE IN HEAVEN!
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: 'text.secondary',
            mt: 1,
            display: 'none',
          }}
          id='welcome-subtext-fallback'
        >
          산업국 IT팀
        </Typography>
      </Box>

      <WelcomeText
        variant='h3'
        $fadeIn={!welcomeShown}
        $fadeOut={welcomeShown}
        sx={{ display: welcomeShown ? 'none' : 'block' }}
      >
        코람데오 청년선교회 출결 플랫폼에
        <br />잘 오셨습니다.
      </WelcomeText>

      <WelcomeText
        variant='h3'
        $fadeIn={welcomeShown}
        $fadeOut={!welcomeShown}
        sx={{ display: welcomeShown ? 'block' : 'none' }}
      >
        환영합니다.
      </WelcomeText>
    </WelcomeContainer>
  );
};

export default WelcomePage;
