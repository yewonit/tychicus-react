import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchActivities,
  fetchAttendances,
} from '../../store/slices/attendanceSlice';
import { fetchMembers } from '../../store/slices/organizationSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AttendanceDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    attendances,
    activities,
    loading: attendanceLoading,
  } = useSelector((state: RootState) => state.attendance);
  const { members, loading: membersLoading } = useSelector(
    (state: RootState) => state.organization
  );

  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAttendances());
    dispatch(fetchActivities());
    dispatch(fetchMembers());
  }, [dispatch]);

  const generateChartData = useCallback(() => {
    // 주간 출석 데이터
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyAttendance = last7Days.map(date => {
      const dayAttendances = attendances.filter(
        a => a.createdAt?.startsWith(date) || false
      );
      return {
        date,
        present: dayAttendances.filter(a => a.status === 'present').length,
        absent: dayAttendances.filter(a => a.status === 'absent').length,
        late: dayAttendances.filter(a => a.status === 'late').length,
      };
    });

    setWeeklyData({
      labels: weeklyAttendance.map(d =>
        new Date(d.date!).toLocaleDateString('ko-KR', { weekday: 'short' })
      ),
      datasets: [
        {
          label: '출석',
          data: weeklyAttendance.map(d => d.present),
          backgroundColor: '#4ecdc4',
        },
        {
          label: '결석',
          data: weeklyAttendance.map(d => d.absent),
          backgroundColor: '#e74c3c',
        },
        {
          label: '지각',
          data: weeklyAttendance.map(d => d.late),
          backgroundColor: '#f39c12',
        },
      ],
    });

    // 출석 상태 분포
    const statusCounts = {
      present: attendances.filter(a => a.status === 'present').length,
      absent: attendances.filter(a => a.status === 'absent').length,
      late: attendances.filter(a => a.status === 'late').length,
      excused: attendances.filter(a => a.status === 'excused').length,
    };

    setStatusData({
      labels: ['출석', '결석', '지각', '사유결석'],
      datasets: [
        {
          data: [
            statusCounts.present,
            statusCounts.absent,
            statusCounts.late,
            statusCounts.excused,
          ],
          backgroundColor: ['#4ecdc4', '#e74c3c', '#f39c12', '#9b59b6'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    });
  }, [attendances]);

  useEffect(() => {
    if (attendances.length > 0) {
      generateChartData();
    }
  }, [attendances, generateChartData]);

  const getAttendanceRate = () => {
    if (attendances.length === 0) return 0;
    const presentCount = attendances.filter(a => a.status === 'present').length;
    return Math.round((presentCount / attendances.length) * 100);
  };

  const getTopAttendees = () => {
    const memberAttendanceCount = members.map(member => {
      const memberAttendances = attendances.filter(
        a => a.memberId === member.id
      );
      const presentCount = memberAttendances.filter(
        a => a.status === 'present'
      ).length;
      return {
        ...member,
        attendanceCount: presentCount,
        totalCount: memberAttendances.length,
        rate:
          memberAttendances.length > 0
            ? Math.round((presentCount / memberAttendances.length) * 100)
            : 0,
      };
    });

    return memberAttendanceCount
      .filter(m => m.totalCount > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  };

  if (attendanceLoading || membersLoading) {
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
        출석현황 대시보드
      </Typography>

      {/* 통계 카드 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant='h6' color='primary'>
              총 출석 기록
            </Typography>
            <Typography variant='h4'>{attendances.length}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant='h6' color='success.main'>
              출석률
            </Typography>
            <Typography variant='h4'>{getAttendanceRate()}%</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant='h6' color='info.main'>
              총 회원 수
            </Typography>
            <Typography variant='h4'>{members.length}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant='h6' color='warning.main'>
              활성 활동
            </Typography>
            <Typography variant='h4'>{activities.length}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 차트 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              주간 출석 현황
            </Typography>
            {weeklyData && (
              <Box sx={{ height: 300 }}>
                <Bar
                  data={weeklyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              출석 상태 분포
            </Typography>
            {statusData && (
              <Box sx={{ height: 300 }}>
                <Doughnut
                  data={statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* 상위 출석자 */}
      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            상위 출석자 (Top 5)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>순위</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell align='center'>출석 횟수</TableCell>
                  <TableCell align='center'>총 활동</TableCell>
                  <TableCell align='center'>출석률</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTopAttendees().map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell align='center'>
                      {member.attendanceCount}
                    </TableCell>
                    <TableCell align='center'>{member.totalCount}</TableCell>
                    <TableCell align='center'>
                      <Typography
                        variant='body2'
                        color={
                          member.rate >= 80
                            ? 'success.main'
                            : member.rate >= 60
                              ? 'warning.main'
                              : 'error.main'
                        }
                      >
                        {member.rate}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceDashboard;
