import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ko } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  createAttendance,
  fetchActivities,
} from '../../store/slices/attendanceSlice';
import { fetchMembers } from '../../store/slices/organizationSlice';
import { Attendance } from '../../types';

const AttendanceInput: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [attendanceStatus, setAttendanceStatus] = useState<
    'present' | 'absent' | 'late' | 'excused'
  >('present');
  const [note, setNote] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading: activitiesLoading } = useSelector(
    (state: RootState) => state.attendance
  );
  const { members, loading: membersLoading } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedActivity || !selectedMember) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const attendanceData: Partial<Attendance> = {
      memberId: selectedMember,
      activityId: selectedActivity,
      status: attendanceStatus,
      ...(note && { note }),
    };

    try {
      await dispatch(createAttendance(attendanceData)).unwrap();
      alert('출석이 성공적으로 입력되었습니다.');

      // 폼 초기화
      setSelectedMember('');
      setAttendanceStatus('present');
      setNote('');
    } catch (error) {
      console.error('출석 입력 실패:', error);
      alert('출석 입력에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setSelectedMember('');
    setAttendanceStatus('present');
    setNote('');
  };

  if (activitiesLoading || membersLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 3 }}>
        출석 입력
      </Typography>

      <Card>
        <CardContent>
          <Box component='form' onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {/* 날짜 선택 */}
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ko}
              >
                <DatePicker
                  label='날짜'
                  value={selectedDate}
                  onChange={newValue => setSelectedDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>

              {/* 활동 선택 */}
              <FormControl fullWidth required>
                <InputLabel>활동</InputLabel>
                <Select
                  value={selectedActivity}
                  onChange={e => setSelectedActivity(e.target.value)}
                  label='활동'
                >
                  {activities.map(activity => (
                    <MenuItem key={activity.id} value={activity.id}>
                      {activity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 회원 선택 */}
              <FormControl fullWidth required>
                <InputLabel>회원</InputLabel>
                <Select
                  value={selectedMember}
                  onChange={e => setSelectedMember(e.target.value)}
                  label='회원'
                >
                  {members.map(member => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 출석 상태 */}
              <FormControl fullWidth required>
                <InputLabel>출석 상태</InputLabel>
                <Select
                  value={attendanceStatus}
                  onChange={e => setAttendanceStatus(e.target.value as any)}
                  label='출석 상태'
                >
                  <MenuItem value='present'>출석</MenuItem>
                  <MenuItem value='absent'>결석</MenuItem>
                  <MenuItem value='late'>지각</MenuItem>
                  <MenuItem value='excused'>사유결석</MenuItem>
                </Select>
              </FormControl>

              {/* 비고 */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label='비고'
                  multiline
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder='추가 사항을 입력하세요...'
                />
              </Box>

              {/* 버튼 */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                <Box
                  sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
                >
                  <Button
                    variant='outlined'
                    onClick={handleCancel}
                    sx={{ minWidth: 100 }}
                  >
                    취소
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      backgroundColor: '#4ecdc4',
                      '&:hover': {
                        backgroundColor: '#3db8b0',
                      },
                      minWidth: 100,
                    }}
                  >
                    저장
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceInput;
