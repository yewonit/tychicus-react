import {
  Add,
  Delete,
  Edit,
  Lock,
  Public,
  Visibility,
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
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { PrayerTopic } from '../../types';

interface PrayerTopicFormData {
  title: string;
  description: string;
  isPublic: boolean;
}

const PrayerTopicComponent: React.FC = () => {
  const [prayerTopics, setPrayerTopics] = useState<PrayerTopic[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<PrayerTopic | null>(null);
  const [formData, setFormData] = useState<PrayerTopicFormData>({
    title: '',
    description: '',
    isPublic: false,
  });

  // 더미 데이터
  useEffect(() => {
    const dummyTopics: PrayerTopic[] = [
      {
        id: '1',
        title: '교회 성장을 위한 기도',
        description:
          '교회가 건강하게 성장하고 많은 영혼이 구원받기를 기도합니다.',
        isPublic: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        title: '목사님 건강을 위한 기도',
        description: '목사님의 건강과 사역을 위한 기도입니다.',
        isPublic: false,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
      {
        id: '3',
        title: '새가족을 위한 기도',
        description: '새로 교회에 오신 분들의 믿음 성장을 위한 기도입니다.',
        isPublic: true,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
      },
    ];
    setPrayerTopics(dummyTopics);
  }, []);

  const handleOpenDialog = (topic?: PrayerTopic) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        title: topic.title,
        description: topic.description || '',
        isPublic: topic.isPublic,
      });
    } else {
      setEditingTopic(null);
      setFormData({
        title: '',
        description: '',
        isPublic: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTopic(null);
    setFormData({
      title: '',
      description: '',
      isPublic: false,
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('기도제목을 입력해주세요.');
      return;
    }

    if (editingTopic) {
      // 수정
      setPrayerTopics(prev =>
        prev.map(topic =>
          topic.id === editingTopic.id
            ? {
                ...topic,
                title: formData.title,
                description: formData.description,
                isPublic: formData.isPublic,
                updatedAt: new Date().toISOString(),
              }
            : topic
        )
      );
    } else {
      // 새로 추가
      const newTopic: PrayerTopic = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPrayerTopics(prev => [newTopic, ...prev]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPrayerTopics(prev => prev.filter(topic => topic.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 3 }}>
        기도제목
      </Typography>

      {/* 기도제목 목록 */}
      <Card>
        <CardContent>
          <List>
            {prayerTopics.map(topic => (
              <ListItem key={topic.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='h6'>{topic.title}</Typography>
                      <Chip
                        icon={topic.isPublic ? <Public /> : <Lock />}
                        label={topic.isPublic ? '공개' : '비공개'}
                        size='small'
                        color={topic.isPublic ? 'primary' : 'default'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}
                      >
                        {topic.description}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ mt: 1, display: 'block' }}
                      >
                        생성일:{' '}
                        {new Date(topic.createdAt).toLocaleDateString('ko-KR')}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge='end'
                      aria-label='상세보기'
                      onClick={() => handleOpenDialog(topic)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      edge='end'
                      aria-label='수정'
                      onClick={() => handleOpenDialog(topic)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge='end'
                      aria-label='삭제'
                      onClick={() => handleDelete(topic.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {prayerTopics.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                등록된 기도제목이 없습니다.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 새 기도제목 추가 버튼 */}
      <Fab
        color='primary'
        aria-label='add'
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#4ecdc4',
          '&:hover': {
            backgroundColor: '#3db8b0',
          },
        }}
      >
        <Add />
      </Fab>

      {/* 기도제목 추가/수정 다이얼로그 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {editingTopic ? '기도제목 수정' : '새 기도제목 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label='기도제목'
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='설명'
              multiline
              rows={4}
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                />
              }
              label='공개 설정'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            sx={{
              backgroundColor: '#4ecdc4',
              '&:hover': {
                backgroundColor: '#3db8b0',
              },
            }}
          >
            {editingTopic ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrayerTopicComponent;
