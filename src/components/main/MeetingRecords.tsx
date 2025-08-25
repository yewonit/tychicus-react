import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  type: '주일예배' | '수요예배' | '새벽기도' | '구역모임' | '기타';
  attendees: number;
  description: string;
  location: string;
  leader: string;
}

const MeetingRecords: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([
    {
      id: '1',
      title: '주일 오전 예배',
      date: '2024-01-14',
      type: '주일예배',
      attendees: 45,
      description: '신년 감사예배',
      location: '본당',
      leader: '김목사',
    },
    {
      id: '2',
      title: '청년부 모임',
      date: '2024-01-10',
      type: '구역모임',
      attendees: 12,
      description: '신년 계획 나눔',
      location: '청년부실',
      leader: '이전도사',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingRecord | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<MeetingRecord>>({
    title: '',
    date: '',
    type: '주일예배',
    attendees: 0,
    description: '',
    location: '',
    leader: '',
  });

  const meetingTypes = [
    '주일예배',
    '수요예배',
    '새벽기도',
    '구역모임',
    '기타',
  ] as const;

  const handleOpenDialog = (meeting?: MeetingRecord) => {
    if (meeting) {
      setEditingMeeting(meeting);
      setFormData(meeting);
    } else {
      setEditingMeeting(null);
      setFormData({
        title: '',
        date: '',
        type: '주일예배',
        attendees: 0,
        description: '',
        location: '',
        leader: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMeeting(null);
    setFormData({});
  };

  const handleSave = () => {
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
        id: Date.now().toString(),
        title: formData.title || '',
        date: formData.date || '',
        type: formData.type || '주일예배',
        attendees: formData.attendees || 0,
        description: formData.description || '',
        location: formData.location || '',
        leader: formData.leader || '',
      };
      setMeetings(prev => [...prev, newMeeting]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '주일예배':
        return '#4ecdc4';
      case '수요예배':
        return '#5dade2';
      case '새벽기도':
        return '#f39c12';
      case '구역모임':
        return '#e74c3c';
      default:
        return '#9b59b6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className='common-container'>
      <div className='header-box'>
        <Typography variant='h4' component='h1' className='page-title'>
          모임기록관리
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          교회 모임 기록을 관리합니다
        </Typography>
      </div>

      <Grid container spacing={3}>
        {meetings.map(meeting => (
          <Grid item xs={12} md={6} lg={4} key={meeting.id}>
            <Card className='common-card' sx={{ height: '100%' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='h3'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {meeting.title}
                  </Typography>
                  <Chip
                    label={meeting.type}
                    size='small'
                    sx={{
                      backgroundColor: getTypeColor(meeting.type),
                      color: 'white',
                      fontWeight: 'medium',
                    }}
                  />
                </Box>

                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <CalendarIcon sx={{ mr: 2, color: 'var(--primary)' }} />
                    <ListItemText
                      primary='날짜'
                      secondary={formatDate(meeting.date)}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <GroupIcon sx={{ mr: 2, color: 'var(--primary)' }} />
                    <ListItemText
                      primary='참석자'
                      secondary={`${meeting.attendees}명`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <DescriptionIcon sx={{ mr: 2, color: 'var(--primary)' }} />
                    <ListItemText primary='장소' secondary={meeting.location} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary='담당자' secondary={meeting.leader} />
                  </ListItem>
                </List>

                {meeting.description && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant='body2' color='textSecondary'>
                      {meeting.description}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <IconButton
                    size='small'
                    onClick={() => handleOpenDialog(meeting)}
                    sx={{ color: 'var(--primary)' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDelete(meeting.id)}
                    sx={{ color: 'var(--error)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 모임 추가 버튼 */}
      <Fab
        color='primary'
        aria-label='add'
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--gradient-primary)',
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
              value={formData.title || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              fullWidth
              required
            />

            <TextField
              label='날짜'
              type='date'
              value={formData.date || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, date: e.target.value }))
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label='모임 유형'
              select
              value={formData.type || '주일예배'}
              onChange={e =>
                setFormData(prev => ({ ...prev, type: e.target.value as any }))
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

            <TextField
              label='참석자 수'
              type='number'
              value={formData.attendees || 0}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  attendees: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              label='장소'
              value={formData.location || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, location: e.target.value }))
              }
              fullWidth
              required
            />

            <TextField
              label='담당자'
              value={formData.leader || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, leader: e.target.value }))
              }
              fullWidth
              required
            />

            <TextField
              label='모임 내용'
              value={formData.description || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              fullWidth
              multiline
              rows={3}
              placeholder='모임의 주요 내용을 입력해주세요'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button
            onClick={handleSave}
            variant='contained'
            className='common-button'
            disabled={
              !formData.title ||
              !formData.date ||
              !formData.location ||
              !formData.leader
            }
          >
            {editingMeeting ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MeetingRecords;
