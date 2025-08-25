import { Box, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';

import { authTokenCheck } from '../../utils/authUtils';

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
    <div className='welcome-container'>
      <Box sx={{ mb: 4 }}>
        <img
          className='welcome-image'
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

      <Typography
        className={`welcome-text ${!welcomeShown ? 'fadeIn' : 'fadeOut'}`}
        variant='h3'
        component='h1'
        sx={{ display: welcomeShown ? 'none' : 'block' }}
      >
        코람데오 청년선교회 출결 플랫폼에
        <br />잘 오셨습니다.
      </Typography>

      <Typography
        className={`welcome-text ${welcomeShown ? 'fadeIn' : 'fadeOut'}`}
        variant='h3'
        component='h1'
        sx={{ display: welcomeShown ? 'block' : 'none' }}
      >
        환영합니다.
      </Typography>
    </div>
  );
};

export default WelcomePage;
