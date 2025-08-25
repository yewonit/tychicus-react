import { store } from '../store';
import {
  checkEmailDuplication,
  checkPhoneNumber,
  checkToken,
  checkUserName,
  fetchUserInfo,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  sendEmailVerification,
  verifyCode,
} from '../store/slices/authSlice';

/**
 * 인증 관련 유틸리티 함수들
 * Vue 코드의 모든 기능을 React에서 사용할 수 있도록 래핑
 */

// 로그인
export const authLogin = async (email: string, password: string) => {
  try {
    const result = await store.dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      // Vue 코드와 동일한 응답 구조
      const userData = result.payload.userData || result.payload.user;
      const tokens = result.payload.tokens || {
        accessToken: result.payload.accessToken,
        refreshToken: result.payload.refreshToken,
      };

      return {
        success: true,
        message: '로그인에 성공했습니다.',
        data: {
          userData,
          tokens,
        },
      };
    } else {
      return {
        success: false,
        message: result.payload as string,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
    };
  }
};

// 로그아웃
export const authLogout = () => {
  store.dispatch(logout());
  return { success: true, message: '로그아웃되었습니다.' };
};

// 사용자 정보 가져오기
export const authFetchUserInfo = async () => {
  try {
    const result = await store.dispatch(fetchUserInfo());
    if (fetchUserInfo.fulfilled.match(result)) {
      return {
        success: true,
        data: result.payload,
      };
    } else {
      return {
        success: false,
        message: result.payload as string,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '사용자 정보를 가져오는데 실패했습니다.',
    };
  }
};

// 토큰 체크
export const authTokenCheck = async () => {
  try {
    const result = await store.dispatch(checkToken());
    if (checkToken.fulfilled.match(result)) {
      return {
        success: true,
        user: result.payload.user,
        message: '토큰이 유효합니다.',
      };
    } else {
      // 토큰이 유효하지 않으면 갱신 시도
      return await authRefreshToken();
    }
  } catch (error) {
    return {
      success: false,
      message: '토큰 확인에 실패했습니다.',
    };
  }
};

// 토큰 갱신
export const authRefreshToken = async () => {
  try {
    const result = await store.dispatch(refreshToken());
    if (refreshToken.fulfilled.match(result)) {
      return {
        success: true,
        message: '토큰이 갱신되었습니다.',
      };
    } else {
      // 토큰 갱신 실패시 로그아웃
      store.dispatch(logout());
      return {
        success: false,
        message: '토큰 갱신에 실패했습니다. 다시 로그인해주세요.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '토큰 갱신 중 오류가 발생했습니다.',
    };
  }
};

// 이메일 중복 체크
export const authCheckEmailDuplication = async (email: string) => {
  try {
    const result = await store.dispatch(checkEmailDuplication(email));
    if (checkEmailDuplication.fulfilled.match(result)) {
      return {
        result: 0,
        message: result.payload.message || '이메일 사용 가능',
        email: email,
      };
    } else {
      return {
        result: 1,
        message: '이미 같은 email로 등록된 유저가 있습니다.',
      };
    }
  } catch (error) {
    return {
      result: 1,
      message: '이메일 중복 체크 오류입니다.',
    };
  }
};

// 이름 중복 체크
export const authCheckUserName = async (name: string) => {
  try {
    const result = await store.dispatch(checkUserName(name));
    if (checkUserName.fulfilled.match(result)) {
      const data = result.payload;

      if (data) {
        // 동명이인 처리: 백엔드에서 userList 배열을 반환하는 경우
        if (data.userList && Array.isArray(data.userList)) {
          // 동명이인이 있는 경우 (2명 이상)
          if (data.userList.length > 1) {
            return {
              result: 1,
              message: '이름이 있습니다.',
              hasDuplicates: true,
              userList: data.userList,
            };
          }
          // 동명이인이 없는 경우 (1명만 있음)
          else if (data.userList.length === 1) {
            return {
              result: 1,
              message: '이름이 있습니다.',
              hasDuplicates: false,
              userData: data.userList[0],
            };
          }
          // 해당 이름의 사용자가 없는 경우
          else {
            return { result: 0, message: '이름이 없습니다.' };
          }
        }
        // 기존 응답 형식 처리 (하위 호환성 유지)
        else {
          return data;
        }
      } else {
        return { result: 0, message: '응답 데이터가 없습니다.' };
      }
    } else {
      return {
        result: 0,
        message: result.payload as string,
      };
    }
  } catch (error) {
    console.error('이름 확인 중 오류:', error);
    return {
      result: 0,
      message: '이름 확인에 실패했습니다.',
    };
  }
};

// 전화번호 체크
export const authCheckPhoneNumber = async (userInfo: {
  name: string;
  phoneNumber: string;
}) => {
  try {
    const result = await store.dispatch(checkPhoneNumber(userInfo));
    if (checkPhoneNumber.fulfilled.match(result)) {
      return result.payload;
    } else {
      return {
        result: 0,
        message: result.payload as string,
      };
    }
  } catch (error) {
    return {
      result: 0,
      message: '전화번호 확인에 실패했습니다.',
    };
  }
};

// 이메일 인증 코드 전송
export const authCheckEmail = async (email: string) => {
  try {
    const result = await store.dispatch(sendEmailVerification(email));
    if (sendEmailVerification.fulfilled.match(result)) {
      return { result: 1, message: '인증번호 전송 완료' };
    } else {
      return { result: 0, message: '인증번호 전송 오류' };
    }
  } catch (error) {
    return { result: 0, message: '인증번호 전송 중 오류가 발생했습니다.' };
  }
};

// 인증 코드 확인
export const authVerifyCode = async (email: string, code: string) => {
  try {
    const result = await store.dispatch(verifyCode({ email, code }));
    if (verifyCode.fulfilled.match(result)) {
      return { result: 1, message: '인증 코드가 유효합니다.' };
    } else {
      return { result: 0, message: '인증 코드가 유효하지 않습니다.' };
    }
  } catch (error) {
    return { result: 0, message: '인증 코드 확인 중 오류가 발생했습니다.' };
  }
};

// 사용자 등록
export const authRegister = async (userData: any) => {
  try {
    const result = await store.dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      return {
        success: true,
        message: '사용자 등록이 완료되었습니다.',
        data: result.payload,
      };
    } else {
      return {
        success: false,
        message: result.payload as string,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '사용자 등록 중 오류가 발생했습니다.',
    };
  }
};

// 비밀번호 재설정
export const authResetPassword = async (userData: any) => {
  try {
    const result = await store.dispatch(resetPassword(userData));
    if (resetPassword.fulfilled.match(result)) {
      return {
        success: true,
        result: true,
        message: '비밀번호가 설정되었습니다.',
      };
    } else {
      return {
        success: false,
        result: false,
        message: result.payload as string,
      };
    }
  } catch (error) {
    return {
      success: false,
      result: false,
      message: '비밀번호 재설정 중 오류가 발생했습니다.',
    };
  }
};
