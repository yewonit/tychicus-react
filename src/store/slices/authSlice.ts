import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import axiosClient, { authClient } from '../../utils/axiosClient';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// 로그인 액션
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authClient.post('/login', credentials, {
        timeout: 8000, // 8초 타임아웃 설정
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        return response.data;
      } else {
        return rejectWithValue('로그인 오류');
      }
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            '패스워드가 일치하지 않습니다.'
        );
      }
      return rejectWithValue('로그인 오류입니다.');
    }
  }
);

// 사용자 정보 가져오기
export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authClient.get('/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          '사용자 정보를 가져오는데 실패했습니다.'
      );
    }
  }
);

// 토큰 체크
export const checkToken = createAsyncThunk(
  'auth/checkToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const response = await authClient.get('/login', {
        headers: {
          Authorization: `Bearer ${state.auth.accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('토큰이 유효하지 않습니다.');
    }
  }
);

// 토큰 갱신
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const response = await authClient.post('/refresh', {
        refreshToken: state.auth.refreshToken,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('토큰 갱신에 실패했습니다.');
    }
  }
);

// 이메일 중복 체크
export const checkEmailDuplication = createAsyncThunk(
  'auth/checkEmailDuplication',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/users/email', {
        params: { email },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '이메일 중복 체크에 실패했습니다.'
      );
    }
  }
);

// 이름 중복 체크
export const checkUserName = createAsyncThunk(
  'auth/checkUserName',
  async (name: string, { rejectWithValue }) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axiosClient.get('/users/name', {
        params: { name: encodedName },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '이름 확인에 실패했습니다.'
      );
    }
  }
);

// 전화번호 체크
export const checkPhoneNumber = createAsyncThunk(
  'auth/checkPhoneNumber',
  async (
    userInfo: { name: string; phoneNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.post('/users/phone-number', userInfo);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '전화번호 확인에 실패했습니다.'
      );
    }
  }
);

// 이메일 인증 코드 전송
export const sendEmailVerification = createAsyncThunk(
  'auth/sendEmailVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authClient.post('/code', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '인증번호 전송에 실패했습니다.'
      );
    }
  }
);

// 인증 코드 확인
export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await authClient.post('/verify', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '인증 코드 확인에 실패했습니다.'
      );
    }
  }
);

// 사용자 등록
export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authClient.post('/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '사용자 등록에 실패했습니다.'
      );
    }
  }
);

// 비밀번호 재설정
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authClient.post('/reset-password', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '비밀번호 재설정에 실패했습니다.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // 로그인
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken =
          action.payload.tokens?.accessToken || action.payload.accessToken;
        state.refreshToken =
          action.payload.tokens?.refreshToken || action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', state.accessToken!);
        localStorage.setItem('refreshToken', state.refreshToken!);
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 사용자 정보 가져오기
      .addCase(fetchUserInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 토큰 체크
      .addCase(checkToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 토큰 갱신
      .addCase(refreshToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // 토큰 갱신 실패시 로그아웃
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
      })
      // 이메일 중복 체크
      .addCase(checkEmailDuplication.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmailDuplication.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkEmailDuplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 이름 중복 체크
      .addCase(checkUserName.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserName.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 전화번호 체크
      .addCase(checkPhoneNumber.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPhoneNumber.fulfilled, state => {
        state.loading = false;
      })
      .addCase(checkPhoneNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 이메일 인증 코드 전송
      .addCase(sendEmailVerification.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 인증 코드 확인
      .addCase(verifyCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 사용자 등록
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, state => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 비밀번호 재설정
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser, setAccessToken, setRefreshToken, clearError } =
  authSlice.actions;
export default authSlice.reducer;
