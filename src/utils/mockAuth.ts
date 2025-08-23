// Mock 인증 함수들 (백엔드 서버가 없을 때 사용)

export const mockLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  // 실제 API 호출 대신 Mock 응답
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === 'test@example.com' &&
        credentials.password === 'password'
      ) {
        resolve({
          user: {
            id: 1,
            name: '테스트 사용자',
            email: 'test@example.com',
          },
          tokens: {
            accessToken: 'mock-access-token-123',
            refreshToken: 'mock-refresh-token-456',
          },
        });
      } else {
        reject(new Error('이메일 또는 비밀번호가 올바르지 않습니다.'));
      }
    }, 1000);
  });
};

export const mockCheckToken = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: 1,
          name: '테스트 사용자',
          email: 'test@example.com',
        },
      });
    }, 500);
  });
};

export const mockRefreshToken = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        accessToken: 'new-mock-access-token-789',
        refreshToken: 'new-mock-refresh-token-012',
      });
    }, 500);
  });
};
