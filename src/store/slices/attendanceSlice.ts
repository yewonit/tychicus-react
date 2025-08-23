import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ActivityInstance, Attendance } from '../../types';
import axiosClient from '../../utils/axiosClient';

interface AttendanceState {
  attendances: Attendance[];
  activities: Activity[];
  activityInstances: ActivityInstance[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  attendances: [],
  activities: [],
  activityInstances: [],
  loading: false,
  error: null,
};

// 출석 목록 가져오기
export const fetchAttendances = createAsyncThunk(
  'attendance/fetchAttendances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/attendance');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          '출석 데이터를 가져오는데 실패했습니다.'
      );
    }
  }
);

// 출석 입력
export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (attendanceData: Partial<Attendance>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/attendance', attendanceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '출석 입력에 실패했습니다.'
      );
    }
  }
);

// 활동 목록 가져오기
export const fetchActivities = createAsyncThunk(
  'attendance/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/activities');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          '활동 데이터를 가져오는데 실패했습니다.'
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendances.push(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<Attendance>) => {
      const index = state.attendances.findIndex(
        a => a.id === action.payload.id
      );
      if (index !== -1) {
        state.attendances[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      // 출석 목록 가져오기
      .addCase(fetchAttendances.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 출석 입력
      .addCase(createAttendance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances.push(action.payload);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 활동 목록 가져오기
      .addCase(fetchActivities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addAttendance, updateAttendance } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
