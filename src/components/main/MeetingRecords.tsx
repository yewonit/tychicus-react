import {
  Add as AddIcon,
  ArrowBack,
  Close,
  Delete,
  Edit,
  RemoveRedEye,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import {
  Activity,
  ActivityInstance,
  attendanceService,
} from '../../utils/attendanceService';
import {
  formatDate,
  formatDateTime,
  getWeekOfMonth,
} from '../../utils/dateUtils';
import { createDummyData } from '../../utils/dummyMeetingData';
import { LoadingSpinner } from '../ui';

interface MeetingRecord {
  id: number;
  activityId: number;
  activityName: string;
  date: string;
  image: string;
  category: string;
  createdAt: string;
  location?: string;
  attendanceCount?: number;
  notes?: string;
}

const MeetingRecords: React.FC = () => {
  const navigate = useNavigate();
  const currentOrganizationId = useSelector(
    (state: RootState) => state.organization.currentOrganizationId
  );

  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ open: false, message: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingRecord | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<MeetingRecord>>({
    activityName: '',
    date: '',
    category: '',
  });

  const meetingTypes = [
    '청년예배',
    '주일3부예배',
    '수요예배',
    '새벽기도',
    '구역모임',
  ] as const;

  useEffect(() => {
    // 더미 데이터로 테스트
    fetchMeetings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // 더미 데이터 사용 (테스트용)
      const response = createDummyData();

      // 실제 API 호출 (주석 처리)
      // const response = await attendanceService.getOrganizationActivities(
      //   currentOrganizationId,
      //   true
      // );

      if (response && response.activities) {
        const processedMeetings = response.activities.flatMap(
          (activity: Activity) => {
            if (activity.instances && activity.instances.length > 0) {
              return activity.instances.map((instance: ActivityInstance) => ({
                id: instance.id,
                activityId: activity.id,
                activityName: activity.name,
                date: instance.start_datetime || '날짜 미정',
                image: '/dummy-meeting-image.jpg',
                category: activity.category,
                createdAt: instance.created_at,
                location: instance.actual_location,
                attendanceCount: instance.attendance_count,
                notes: instance.notes,
              }));
            }
            return [];
          }
        );

        // 최신순으로 정렬
        processedMeetings.sort((a: MeetingRecord, b: MeetingRecord) => {
          if (a.date === '날짜 미정') return 1;
          if (b.date === '날짜 미정') return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setMeetings(processedMeetings);
      }
    } catch (error) {
      console.error('미팅 정보 조회 실패:', error);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeekTagColor = (dateString: string) => {
    if (dateString === '날짜 미정') return 'default';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'default';

    const weekInfo = getWeekOfMonth(date);
    const weekNumber = weekInfo.weekNumber;

    const colors = ['primary', 'success', 'warning', 'error', 'secondary'];
    return colors[(weekNumber - 1) % colors.length];
  };

  const getMonthWeekTag = (dateString: string) => {
    if (dateString === '날짜 미정') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const weekInfo = getWeekOfMonth(date);
    return `${weekInfo.month}월 ${weekInfo.weekNumber}주차`;
  };

  const handleBack = () => {
    navigate('/main/service-selection');
  };

  const handleClose = () => {
    navigate('/main/service-selection');
  };

  const handleOpenDialog = (meeting?: MeetingRecord) => {
    if (meeting) {
      setEditingMeeting(meeting);
      setFormData(meeting);
    } else {
      setEditingMeeting(null);
      setFormData({
        activityName: '',
        date: '',
        category: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleViewDetail = (meeting: MeetingRecord) => {
    const orgId = currentOrganizationId || '106'; // 기본값 사용
    if (orgId && meeting.activityId && meeting.id) {
      navigate(
        `/main/meeting-detail/${orgId}/${meeting.activityId}/${meeting.id}`
      );
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMeeting(null);
    setFormData({});
  };

  const handleSave = () => {
    // TODO: 실제 API 연동 구현
    if (editingMeeting) {
      // 수정
      setMeetings(prev =>
        prev.map(meeting =>
          meeting.id === editingMeeting.id
            ? { ...meeting, ...formData }
            : meeting
        )
      );
    } else {
      // 새로 추가
      const newMeeting: MeetingRecord = {
        id: Date.now(),
        activityId: 0,
        activityName: formData.activityName || '',
        date: formData.date || '',
        image: '/dummy-meeting-image.jpg',
        category: formData.category || '청년예배',
        createdAt: new Date().toISOString(),
      };
      setMeetings(prev => [...prev, newMeeting]);
    }
    handleCloseDialog();
  };

  const handleDelete = async (meeting: MeetingRecord) => {
    if (!currentOrganizationId) {
      console.warn('currentOrganizationId가 없습니다.');
      return;
    }

    if (
      !window.confirm(
        `정말로 "${meeting.activityName}" 모임을 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      const response = await attendanceService.deleteActivityInstance(
        currentOrganizationId,
        meeting.activityId.toString(),
        meeting.id.toString()
      );

      if (response && response.deletedActivityInstanceId) {
        setDialog({
          open: true,
          message: `모임 "${meeting.activityName}"이(가) 성공적으로 삭제되었습니다.`,
        });
        await fetchMeetings();
      } else {
        setDialog({
          open: true,
          message: `모임 "${meeting.activityName}" 삭제에 실패했습니다. 다시 시도해 주세요.`,
        });
      }
    } catch (error) {
      console.error('모임 삭제 실패:', error);
      setDialog({
        open: true,
        message: `모임 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      });
    }
  };

  const handleEdit = (meeting: MeetingRecord) => {
    const orgId = currentOrganizationId || '106'; // 기본값 사용
    navigate(
      `/main/meeting-add?edit=true&organizationId=${orgId}&activityId=${meeting.activityId}&instanceId=${meeting.id}`
    );
  };

  const goToAttendanceInput = () => {
    navigate('/main/meeting-add');
  };

  if (loading) {
    return <LoadingSpinner message='미팅 목록을 불러오는 중...' />;
  }

  return (
    <div className='meeting-records-container'>
      {/* 헤더 */}
      <div className='meeting-header'>
        <div className='meeting-header-left'>
          <button className='meeting-back-button' onClick={handleBack}>
            <ArrowBack style={{ fontSize: 24 }} />
          </button>
          <h1 className='meeting-title'>모임 기록</h1>
        </div>
        <button className='meeting-close-button' onClick={handleClose}>
          <Close style={{ fontSize: 24 }} />
        </button>
      </div>

      {/* 모임 카드들 */}
      <Container maxWidth='lg' sx={{ pb: 8 }}>
        {meetings.length > 0 ? (
          <Grid container spacing={3}>
            {meetings.map(meeting => (
              <Grid item xs={12} sm={6} md={4} key={meeting.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component='img'
                    height='200'
                    image={meeting.image}
                    alt={meeting.activityName}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display='flex' alignItems='center' mb={1}>
                      {meeting.date !== '날짜 미정' && (
                        <Chip
                          size='small'
                          label={getMonthWeekTag(meeting.date)}
                          color={getWeekTagColor(meeting.date) as any}
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Typography variant='h6' component='h2'>
                        {meeting.activityName}
                      </Typography>
                    </Box>
                    <Typography variant='body2' color='text.secondary' mb={1}>
                      📅 {formatDate(meeting.date)}
                    </Typography>
                    {meeting.location && (
                      <Typography variant='body2' color='text.secondary' mb={1}>
                        📍 {meeting.location}
                      </Typography>
                    )}
                    {meeting.attendanceCount !== undefined && (
                      <Typography variant='body2' color='text.secondary' mb={1}>
                        👥 출석: {meeting.attendanceCount}명
                      </Typography>
                    )}
                    <Typography variant='caption' color='text.secondary'>
                      ⏰ 모임 기록일시: {formatDateTime(meeting.createdAt)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(meeting)}
                        size='small'
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(meeting)}
                        size='small'
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Button
                      startIcon={<RemoveRedEye />}
                      onClick={() => handleViewDetail(meeting)}
                      size='small'
                    >
                      상세보기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign='center' py={4}>
            <Typography variant='h5' gutterBottom>
              등록된 미팅이 없습니다.
            </Typography>
            <Typography variant='body1' color='text.secondary' mb={3}>
              새로운 미팅을 등록해 주세요.
            </Typography>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={goToAttendanceInput}
              className='common-button'
            >
              새 미팅 등록
            </Button>
          </Box>
        )}
      </Container>

      {/* 플로팅 추가 버튼 */}
      <Fab
        className='meeting-add-button'
        onClick={goToAttendanceInput}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'var(--primary)',
          color: 'white',
        }}
      >
        <AddIcon />
      </Fab>

      {/* 모임 추가/수정 다이얼로그 */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {editingMeeting ? '모임 기록 수정' : '새 모임 기록 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label='모임 제목'
              value={formData.activityName || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, activityName: e.target.value }))
              }
              fullWidth
              required
            />

            <TextField
              label='날짜'
              value={formData.date || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, date: e.target.value }))
              }
              fullWidth
              required
              placeholder='예: 2025-08-17'
            />

            <TextField
              label='모임 유형'
              select
              value={formData.category || '청년예배'}
              onChange={e =>
                setFormData(prev => ({ ...prev, category: e.target.value }))
              }
              fullWidth
              required
            >
              {meetingTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button
            onClick={handleSave}
            variant='contained'
            className='common-button'
            disabled={
              !formData.activityName || !formData.date || !formData.category
            }
          >
            {editingMeeting ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 확인 다이얼로그 */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, message: '' })}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>안내</DialogTitle>
        <DialogContent>
          <Typography>{dialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialog({ open: false, message: '' })}
            className='common-button'
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MeetingRecords;
