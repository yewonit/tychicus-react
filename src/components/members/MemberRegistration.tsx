import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  createMember,
  fetchOrganizations,
} from '../../store/slices/organizationSlice';
import { Member } from '../../types';

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  isActive: boolean;
}

const MemberRegistration: React.FC = () => {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    phone: '',
    organizationId: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<MemberFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { organizations, loading } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Partial<MemberFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^[0-9-]+$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요.';
    }

    if (!formData.organizationId) {
      newErrors.organizationId = '소속 조직을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const memberData: Partial<Member> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organizationId: formData.organizationId,
        isActive: formData.isActive,
      };

      await dispatch(createMember(memberData)).unwrap();

      alert('회원이 성공적으로 등록되었습니다.');

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        organizationId: '',
        isActive: true,
      });
      setErrors({});
    } catch (error) {
      console.error('회원 등록 실패:', error);
      alert('회원 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      organizationId: '',
      isActive: true,
    });
    setErrors({});
  };

  if (loading) {
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
        회원 등록
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
              {/* 이름 */}
              <TextField
                fullWidth
                label='이름 *'
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              {/* 이메일 */}
              <TextField
                fullWidth
                label='이메일 *'
                type='email'
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                error={!!errors.email}
                helperText={errors.email}
                required
              />

              {/* 전화번호 */}
              <TextField
                fullWidth
                label='전화번호 *'
                value={formData.phone}
                onChange={e =>
                  setFormData(prev => ({ ...prev, phone: e.target.value }))
                }
                error={!!errors.phone}
                helperText={errors.phone || '예: 010-1234-5678'}
                required
              />

              {/* 소속 조직 */}
              <FormControl fullWidth required error={!!errors.organizationId}>
                <InputLabel>소속 조직 *</InputLabel>
                <Select
                  value={formData.organizationId}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      organizationId: e.target.value,
                    }))
                  }
                  label='소속 조직 *'
                >
                  {organizations.map(org => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.organizationId && (
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {errors.organizationId}
                  </Typography>
                )}
              </FormControl>

              {/* 활성 상태 */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                  }
                  label='활성 회원'
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
                    disabled={isSubmitting}
                    sx={{ minWidth: 100 }}
                  >
                    취소
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: '#4ecdc4',
                      '&:hover': {
                        backgroundColor: '#3db8b0',
                      },
                      minWidth: 100,
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : '등록'}
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

export default MemberRegistration;
