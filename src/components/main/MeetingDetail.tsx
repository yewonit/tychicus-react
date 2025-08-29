import {
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 타입 정의
interface MeetingData {
  id: string;
  activityName: string;
  activityDescription: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  notes: string;
  attendances: Array<{
    id: string;
    userId: string;
    userName: string;
    status: '출석' | '결석';
  }>;
}

interface Member {
  id: string;
  userId: string;
  userName: string;
  roleName: string;
  status: '출석' | '결석';
}

interface OrganizationMember {
  id: string;
  roleName: string;
}

const MeetingDetail: React.FC = () => {
  const {
    organizationId: _organizationId,
    activityId: _activityId,
    activityInstanceId: _activityInstanceId,
  } = useParams<{
    organizationId: string;
    activityId: string;
    activityInstanceId: string;
  }>();

  const navigate = useNavigate();

  // 상태 관리
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  const [presentMembers, setPresentMembers] = useState<Member[]>([]);
  const [absentMembers, setAbsentMembers] = useState<Member[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [totalMembers, setTotalMembers] = useState(0);
  const [organizationMembers, setOrganizationMembers] = useState<
    OrganizationMember[]
  >([]);
  const [presentListExpanded, setPresentListExpanded] = useState(true);
  const [absentListExpanded, setAbsentListExpanded] = useState(true);

  // 더미 데이터 (실제 API 연동 시 제거)
  const dummyMeetingData: MeetingData = {
    id: '1',
    activityName: '수요제자기도회',
    activityDescription: '코람데오_4국_민희주그룹_장승빈순의 수요 제자 기도회',
    startDateTime: '2025-08-27T21:20:00',
    endDateTime: '2025-08-27T22:10:00',
    location: '스카이아트홀',
    notes: '그리스도의 제자로 복음을 더욱 깊이 각인하는 시간',
    attendances: [
      { id: '1', userId: '1672', userName: '장승빈', status: '출석' },
      { id: '2', userId: '1673', userName: '최선의', status: '출석' },
      { id: '3', userId: '1675', userName: '홍신기', status: '출석' },
      { id: '4', userId: '1674', userName: '임예원', status: '출석' },
      { id: '5', userId: '1681', userName: '조헌기', status: '출석' },
      { id: '6', userId: '2267', userName: '김기상', status: '결석' },
    ],
  };

  const dummyOrganizationMembers: OrganizationMember[] = [
    { id: '1672', roleName: '순장' },
    { id: '1673', roleName: 'EBS' },
    { id: '1674', roleName: '순원' },
    { id: '1675', roleName: '순원' },
    { id: '1681', roleName: '순원' },
    { id: '2267', roleName: '순원' },
  ];

  // 날짜 포맷팅 함수
  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      return dateString;
    }
  }, []);

  const formatTime = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      return dateString;
    }
  }, []);

  // 역할 색상 및 클래스 함수
  const getRoleColor = useCallback((roleName: string): string => {
    switch (roleName) {
      case '순장':
        return '#4ecdc4'; // 민트 그린
      case 'EBS':
        return '#5dade2'; // 스카이 블루
      case '순원':
        return '#7ea394'; // 기본 아바타 색상
      default:
        return '#7ea394';
    }
  }, []);

  const getRoleClass = useCallback((roleName: string): string => {
    switch (roleName) {
      case '순장':
        return 'role-leader';
      case 'EBS':
        return 'role-ebs';
      case '순원':
        return 'role-member';
      default:
        return 'role-default';
    }
  }, []);

  // 역할 비교 함수
  const compareRoles = useCallback((roleA: string, roleB: string): number => {
    const roleOrder: { [key: string]: number } = {
      순장: 1,
      EBS: 2,
      순원: 3,
    };
    return (roleOrder[roleA] || 4) - (roleOrder[roleB] || 4);
  }, []);

  // 역할 정보 추가 함수
  const addRoleInfo = useCallback(
    (member: any): Member => {
      const orgMember = organizationMembers.find(m => m.id === member.userId);
      const roleName = orgMember ? orgMember.roleName : '일반 회원';
      return {
        ...member,
        roleName: roleName,
      };
    },
    [organizationMembers]
  );

  // 정렬된 참석자/불참자 목록
  const sortedPresentMembers = useMemo(() => {
    return [...presentMembers]
      .map(member => addRoleInfo(member))
      .sort((a, b) => compareRoles(a.roleName, b.roleName));
  }, [presentMembers, addRoleInfo, compareRoles]);

  const sortedAbsentMembers = useMemo(() => {
    return [...absentMembers]
      .map(member => addRoleInfo(member))
      .sort((a, b) => compareRoles(a.roleName, b.roleName));
  }, [absentMembers, addRoleInfo, compareRoles]);

  // 데이터 가져오기 함수
  const fetchMeetingData = useCallback(async () => {
    try {
      // 실제 API 호출 대신 더미 데이터 사용
      const response = dummyMeetingData;

      if (response) {
        setMeetingData(response);
        setPresentMembers(
          response.attendances
            .filter(a => a.status === '출석')
            .map(attendance => ({
              ...attendance,
              roleName: '일반 회원', // 기본값 설정
            }))
        );
        setAbsentMembers(
          response.attendances
            .filter(a => a.status === '결석')
            .map(attendance => ({
              ...attendance,
              roleName: '일반 회원', // 기본값 설정
            }))
        );
        setTotalMembers(response.attendances.length);

        await fetchOrganizationMembers();
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error('미팅 데이터 가져오기 실패:', error);
    }
  }, []);

  const fetchOrganizationMembers = useCallback(async () => {
    try {
      // 실제 API 호출 대신 더미 데이터 사용
      const response = dummyOrganizationMembers;
      if (response) {
        setOrganizationMembers(response);
      }
    } catch (error) {
      console.error('조직 멤버 정보를 가져오는 중 오류 발생:', error);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchMeetingData();
  }, [fetchMeetingData]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!isDataLoaded) {
    return (
      <Box className='meeting-detail-container'>
        <Box className='loading-container'>
          <Typography variant='body1' className='loading-text'>
            데이터를 불러오는 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className='meeting-detail-container'>
      {/* 헤더 */}
      <Box className='meeting-detail-header'>
        <IconButton onClick={handleBack} className='back-button'>
          <ArrowBack />
        </IconButton>
        <Typography variant='h6' className='header-title'>
          모임 상세 정보
        </Typography>
      </Box>

      {/* 기본 정보 */}
      <Card className='info-card'>
        <Box className='card-header'>
          <Typography variant='h6' className='card-title'>
            기본 정보
          </Typography>
        </Box>
        <CardContent className='card-content'>
          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>모임 이름:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.activityName}
            </Typography>
          </Box>

          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>설명:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.activityDescription}
            </Typography>
          </Box>

          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>날짜:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.startDateTime
                ? formatDate(meetingData.startDateTime)
                : ''}
            </Typography>
          </Box>

          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>시간:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.startDateTime && meetingData?.endDateTime
                ? `${formatTime(meetingData.startDateTime)} - ${formatTime(meetingData.endDateTime)}`
                : ''}
            </Typography>
          </Box>

          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>장소:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.location}
            </Typography>
          </Box>

          <Box className='info-item'>
            <Typography variant='body1' className='info-label'>
              <strong>모임상세:</strong>
            </Typography>
            <Typography variant='body1' className='info-value'>
              {meetingData?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 참석자 정보 */}
      <Card className='info-card'>
        <Box className='card-header'>
          <Typography variant='h6' className='card-title'>
            참석자 정보
          </Typography>
          <Typography variant='body2' className='attendance-summary'>
            총 인원: {totalMembers}명 | 참석: {presentMembers.length}명 | 불참:{' '}
            {absentMembers.length}명
          </Typography>
        </Box>
        <Divider className='card-divider' />

        {/* 참석자 목록 */}
        <Box className='attendance-section'>
          <Box
            className='section-header'
            onClick={() => setPresentListExpanded(!presentListExpanded)}
          >
            <Typography variant='subtitle1' className='section-title'>
              참석자 목록
            </Typography>
            <IconButton size='small'>
              {presentListExpanded ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )}
            </IconButton>
          </Box>

          <Collapse in={presentListExpanded}>
            <List className='member-list'>
              {sortedPresentMembers.map(member => (
                <ListItem key={member.id} className='member-item'>
                  <ListItemAvatar>
                    <Avatar
                      style={{ backgroundColor: getRoleColor(member.roleName) }}
                      className='member-avatar'
                    >
                      {member.userName?.charAt(0) || ''}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant='body1' className='member-name'>
                        {member.userName}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant='body2'
                        className={getRoleClass(member.roleName)}
                      >
                        {member.roleName || '일반 회원'}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label='참석'
                      color='success'
                      size='small'
                      className='status-chip attended'
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>

        {/* 불참자 목록 */}
        <Box className='attendance-section'>
          <Box
            className='section-header'
            onClick={() => setAbsentListExpanded(!absentListExpanded)}
          >
            <Typography variant='subtitle1' className='section-title'>
              불참자 목록
            </Typography>
            <IconButton size='small'>
              {absentListExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>

          <Collapse in={absentListExpanded}>
            <List className='member-list'>
              {sortedAbsentMembers.map(member => (
                <ListItem key={member.id} className='member-item'>
                  <ListItemAvatar>
                    <Avatar
                      style={{ backgroundColor: getRoleColor(member.roleName) }}
                      className='member-avatar'
                    >
                      {member.userName?.charAt(0) || ''}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant='body1' className='member-name'>
                        {member.userName}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant='body2'
                        className={getRoleClass(member.roleName)}
                      >
                        {member.roleName || '일반 회원'}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label='불참'
                      size='small'
                      className='status-chip absent'
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      </Card>
    </Box>
  );
};

export default MeetingDetail;
