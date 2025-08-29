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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  week: string; // 예: "8월 3주차"
  type: '청년예배' | '주일3부예배' | '수요예배' | '새벽기도' | '구역모임';
  recordDate: string; // 모임 기록일시
  imageUrl?: string;
  organizationId?: string;
  activityId?: string;
  activityInstanceId?: string;
}

const MeetingRecords: React.FC = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<MeetingRecord[]>([
    {
      id: '1',
      title: '청년예배',
      date: '2025년 8월 17일 일요일',
      week: '8월 3주차',
      type: '청년예배',
      recordDate: '2025년 8월 18일 오전 07:28',
      imageUrl: undefined,
      organizationId: '106',
      activityId: '1',
      activityInstanceId: '1',
    },
    {
      id: '2',
      title: '주일3부예배',
      date: '2025년 8월 17일 일요일',
      week: '8월 3주차',
      type: '주일3부예배',
      recordDate: '2025년 8월 18일 오전 07:28',
      imageUrl: undefined,
      organizationId: '106',
      activityId: '2',
      activityInstanceId: '2',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingRecord | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<MeetingRecord>>({
    title: '',
    date: '',
    week: '',
    type: '청년예배',
    recordDate: '',
  });

  const meetingTypes = [
    '청년예배',
    '주일3부예배',
    '수요예배',
    '새벽기도',
    '구역모임',
  ] as const;

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
        title: '',
        date: '',
        week: '',
        type: '청년예배',
        recordDate: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleViewDetail = (meeting: MeetingRecord) => {
    if (
      meeting.organizationId &&
      meeting.activityId &&
      meeting.activityInstanceId
    ) {
      navigate(
        `/main/meeting-detail/${meeting.organizationId}/${meeting.activityId}/${meeting.activityInstanceId}`
      );
    }
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
        week: formData.week || '',
        type: formData.type || '청년예배',
        recordDate: formData.recordDate || new Date().toLocaleString('ko-KR'),
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

  const handleEdit = (id: string) => {
    const meeting = meetings.find(m => m.id === id);
    if (meeting) {
      handleOpenDialog(meeting);
    }
  };

  const handleDetail = (id: string) => {
    // TODO: 상세보기 기능 구현
    alert(`모임 ${id} 상세보기 기능을 구현 예정입니다.`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '청년예배':
        return '#ffa726'; // 주황색
      case '주일3부예배':
        return '#ffa726'; // 주황색
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
      <div className='meeting-cards-container'>
        {meetings.map(meeting => (
          <div key={meeting.id} className='meeting-card'>
            {/* 이미지 업로드 영역 */}
            <div className='meeting-image-area'>
              <div className='coram-deo-logo'>CoramDeo</div>
              <div className='image-upload-text'>⬆ 이미지를 업로드하세요</div>
              <div className='upload-text-en'>Upload Image</div>
            </div>

            {/* 모임 정보 */}
            <div className='meeting-info'>
              {/* 주차 태그 */}
              <div
                className='meeting-week-tag'
                style={{ backgroundColor: getTypeColor(meeting.type) }}
              >
                {meeting.week} {meeting.type}
              </div>

              {/* 날짜 정보 */}
              <div className='meeting-date-info'>
                <div className='calendar-icon'>📅</div>
                <div className='meeting-date'>{meeting.date}</div>
              </div>

              {/* 기록일시 */}
              <div className='meeting-record-info'>
                <div className='clock-icon'>🕐</div>
                <div className='meeting-record-text'>
                  모임 기록일시: {meeting.recordDate}
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className='meeting-actions'>
                <button
                  className='meeting-action-button edit'
                  onClick={() => handleEdit(meeting.id)}
                  title='수정'
                >
                  <Edit style={{ fontSize: 20 }} />
                </button>
                <button
                  className='meeting-action-button delete'
                  onClick={() => handleDelete(meeting.id)}
                  title='삭제'
                >
                  <Delete style={{ fontSize: 20 }} />
                </button>
                <button
                  className='meeting-action-button detail'
                  onClick={() => handleViewDetail(meeting)}
                  title='상세보기'
                >
                  <RemoveRedEye style={{ fontSize: 20 }} />
                  <span className='detail-text'>상세보기</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 추가 버튼 */}
      <Fab
        className='meeting-add-button'
        onClick={() => navigate('/main/meeting-add')}
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
              value={formData.title || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
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
              placeholder='예: 2025년 8월 17일 일요일'
            />

            <TextField
              label='주차'
              value={formData.week || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, week: e.target.value }))
              }
              fullWidth
              required
              placeholder='예: 8월 3주차'
            />

            <TextField
              label='모임 유형'
              select
              value={formData.type || '청년예배'}
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
              label='모임 기록일시'
              value={formData.recordDate || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, recordDate: e.target.value }))
              }
              fullWidth
              required
              placeholder='예: 2025년 8월 18일 오전 07:28'
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
              !formData.week ||
              !formData.recordDate
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
