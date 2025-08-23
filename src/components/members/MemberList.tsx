import { Edit, Email, Phone, Search, Visibility } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchMembers } from '../../store/slices/organizationSlice';

const MemberList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  // 검색 필터링
  const filteredMembers = members.filter(
    member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm)
  );

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? '활성' : '비활성';
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
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom sx={{ mb: 3 }}>
        회원 명단
      </Typography>

      {/* 검색 필터 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant='outlined'
            placeholder='회원명, 이메일, 전화번호로 검색...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* 회원 목록 테이블 */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>전화번호</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>등록일</TableCell>
                  <TableCell align='center'>작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map(member => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Typography variant='body1' fontWeight='medium'>
                        {member.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {member.email ? (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Email fontSize='small' color='action' />
                          {member.email}
                        </Box>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.phone ? (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Phone fontSize='small' color='action' />
                          {member.phone}
                        </Box>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(member.isActive)}
                        color={getStatusColor(member.isActive) as any}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <Tooltip title='상세보기'>
                          <IconButton size='small' color='primary'>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='수정'>
                          <IconButton size='small' color='secondary'>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredMembers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                {searchTerm
                  ? '검색 결과가 없습니다.'
                  : '등록된 회원이 없습니다.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 통계 정보 */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant='h6' color='primary'>
              총 회원 수
            </Typography>
            <Typography variant='h4'>{members.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant='h6' color='success.main'>
              활성 회원
            </Typography>
            <Typography variant='h4'>
              {members.filter(m => m.isActive).length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant='h6' color='error.main'>
              비활성 회원
            </Typography>
            <Typography variant='h4'>
              {members.filter(m => !m.isActive).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MemberList;
