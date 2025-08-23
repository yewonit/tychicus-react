import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member, Organization } from '../../types';
import axiosClient from '../../utils/axiosClient';

interface OrganizationState {
  organizations: Organization[];
  members: Member[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  members: [],
  loading: false,
  error: null,
};

// 조직 목록 가져오기
export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/organizations');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          '조직 데이터를 가져오는데 실패했습니다.'
      );
    }
  }
);

// 회원 목록 가져오기
export const fetchMembers = createAsyncThunk(
  'organization/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/members');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          '회원 데이터를 가져오는데 실패했습니다.'
      );
    }
  }
);

// 회원 등록
export const createMember = createAsyncThunk(
  'organization/createMember',
  async (memberData: Partial<Member>, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/members', memberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '회원 등록에 실패했습니다.'
      );
    }
  }
);

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    addMember: (state, action: PayloadAction<Member>) => {
      state.members.push(action.payload);
    },
    updateMember: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      // 조직 목록 가져오기
      .addCase(fetchOrganizations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 회원 목록 가져오기
      .addCase(fetchMembers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 회원 등록
      .addCase(createMember.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addMember, updateMember } =
  organizationSlice.actions;
export default organizationSlice.reducer;
