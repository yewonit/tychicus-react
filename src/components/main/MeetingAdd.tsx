import {
  ArrowBack,
  Close,
  CloudUpload,
  Group,
  Warning,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { addDays, format, getDay, subDays } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../store';
import { attendanceService, memberService } from '../../utils';
import * as dateUtils from '../../utils/dateUtils';

import { Member } from '../../utils/memberService';

interface MeetingActivity {
  id: number;
  name: string;
  category: string;
  description?: string;
}

interface ActivityDefaults {
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  dayOfWeek: number; // 0: 일요일, 1: 월요일, ... 6: 토요일
}

interface LoadingState {
  isLoading: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepText: string;
  progressPercent: number;
  startTime: number | null;
  estimatedTimeLeft: number | null;
  hasLongDelay: boolean;
}

const MeetingAdd: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 수정 모드 관련 상태
  const isEditMode = searchParams.get('edit') === 'true';
  const editOrganizationId = searchParams.get('organizationId');
  const editActivityId = searchParams.get('activityId');
  const editInstanceId = searchParams.get('instanceId');

  // 기본 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [activities, setActivities] = useState<MeetingActivity[]>([]);

  // 날짜/시간 상태
  const [meetingDate, setMeetingDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // 모임 정보
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<number>(0);

  // 참가자 관리
  const [members, setMembers] = useState<Member[]>([]);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);

  // 로딩 및 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    currentStep: 0,
    totalSteps: 5,
    currentStepText: '',
    progressPercent: 0,
    startTime: null,
    estimatedTimeLeft: null,
    hasLongDelay: false,
  });

  // 요일 검증 관련
  const [dayOfWeekWarningOpen, setDayOfWeekWarningOpen] = useState(false);
  const [warningInfo, setWarningInfo] = useState({
    selectedActivityName: '',
    recommendedDayOfWeekText: '',
    selectedDayOfWeekText: '',
    recommendedDate: '',
    selectedDate: '',
  });

  // 활동별 기본값 정의 (Vue 소스와 동일하게 업데이트)
  const activityDefaults: { [key: string]: ActivityDefaults } = {
    주일2부예배: {
      startTime: '10:00',
      endTime: '11:30',
      location: '커버넌트홀',
      notes: '예원교회 주일 2부예배',
      dayOfWeek: 0, // 일요일
    },
    주일3부예배: {
      startTime: '12:00',
      endTime: '13:20',
      location: '커버넌트홀',
      notes: '예원교회 주일 3부예배',
      dayOfWeek: 0, // 일요일
    },
    청년예배: {
      startTime: '14:30',
      endTime: '16:30',
      location: '커버넌트홀',
      notes: '예원교회 코람데오 청년선교회 예배',
      dayOfWeek: 0, // 일요일
    },
    수요예배: {
      startTime: '20:00',
      endTime: '20:50',
      location: '드림홀',
      notes: '예원교회 수요예배',
      dayOfWeek: 3, // 수요일
    },
    금요예배: {
      startTime: '20:20',
      endTime: '22:10',
      location: '커버넌트홀',
      notes: '예원교회 금요예배',
      dayOfWeek: 5, // 금요일
    },
    수요제자기도회: {
      startTime: '21:20',
      endTime: '22:10',
      location: '스카이아트홀',
      notes: '그리스도의 제자로 복음을 더욱 깊이 각인하는 시간',
      dayOfWeek: 3, // 수요일
    },
    현장치유팀사역: {
      startTime: '22:20',
      endTime: '23:20',
      location: '스카이아트홀',
      notes: '두란노의 응답 받아 성경적 전도운동의 증인으로 서는 시간',
      dayOfWeek: 5, // 금요일
    },
  };

  // Vue 소스와 동일한 역할 정보
  const roleInfo: { [key: string]: { color: string; priority: number } } = {
    그룹장: { color: '#B3C6FF', priority: 1 }, // 파스텔 블루
    순장: { color: '#D6E0FF', priority: 1 }, // 연한 파스텔 블루
    EBS: { color: '#FFF4B3', priority: 2 }, // 파스텔 옐로우
    순원: { color: '#C2E0C2', priority: 3 }, // 파스텔 그린
    회원: { color: '#D6EAD6', priority: 3 }, // 연한 파스텔 그린
  };

  const dayOfWeekTexts = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];

  const organizationId =
    useSelector(
      (state: RootState) => state.organization.currentOrganizationId
    ) || '106';

  // 활동 목록 조회 (Vue 소스와 동일하게 업데이트)
  const fetchActivities = useCallback(async () => {
    try {
      console.log('📢 활동 목록 조회 시작');
      // TODO: 실제 API 호출로 교체
      const mockActivities: MeetingActivity[] = [
        { id: 1, name: '청년예배', category: '예배', description: '청년 예배' },
        {
          id: 2,
          name: '주일3부예배',
          category: '예배',
          description: '주일 3부 예배',
        },
        { id: 3, name: '수요예배', category: '예배', description: '수요 예배' },
        {
          id: 4,
          name: '수요제자기도회',
          category: '기도회',
          description: '제자 기도회',
        },
        {
          id: 5,
          name: '현장치유팀사역',
          category: '사역',
          description: '두란노사역자모임',
        },
      ];

      // Vue 소스와 동일하게 금요예배, 수요예배, 주일2부예배 제외
      const excludedActivities = ['금요예배', '수요예배', '주일2부예배'];
      const filteredActivities = mockActivities.filter(
        activity => !excludedActivities.includes(activity.name)
      );

      // 화면 표시용 이름 매핑
      const displayNameMapping: { [key: string]: string } = {
        현장치유팀사역: '두란노사역자모임',
      };

      const formattedActivities = filteredActivities.map(activity => ({
        ...activity,
        name: displayNameMapping[activity.name] || activity.name,
      }));

      setActivities(formattedActivities);
      console.log('✅ 활동 목록 조회 완료:', formattedActivities);
    } catch (error) {
      console.error('❌ 활동 목록 조회 중 오류 발생:', error);
    }
  }, []);

  // 회원 목록 조회 (Vue 소스와 동일하게 업데이트)
  const fetchMembers = useCallback(async () => {
    try {
      console.log('📢 회원 목록 조회 시작');

      const response =
        await memberService.getOrganizationMembers(organizationId);

      const memberList = response.members || [];

      // Vue 소스와 동일한 우선순위 정렬
      memberList.sort((a: Member, b: Member) => {
        const getRolePriority = (member: Member) => {
          return roleInfo[member.roleName]?.priority || 4;
        };

        if (a.isNewMember === 'Y' && b.isNewMember !== 'Y') return -1;
        if (a.isNewMember !== 'Y' && b.isNewMember === 'Y') return 1;
        if (a.isLongTermAbsentee === 'Y' && b.isLongTermAbsentee !== 'Y')
          return -1;
        if (a.isLongTermAbsentee !== 'Y' && b.isLongTermAbsentee === 'Y')
          return 1;

        return getRolePriority(a) - getRolePriority(b);
      });

      // 참가 여부 초기화
      const membersWithParticipation = memberList.map((member: Member) => ({
        ...member,
        isParticipating: false,
      }));

      setMembers(membersWithParticipation);
      console.log('✅ 회원 목록 조회 완료:', membersWithParticipation);
    } catch (error) {
      console.error('❌ 회원 목록 조회 중 오류 발생:', error);
    }
  }, [organizationId]);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchActivities();
    fetchMembers();

    // 수정 모드인 경우 기존 데이터 로딩
    if (isEditMode && editOrganizationId && editActivityId && editInstanceId) {
      fetchExistingMeetingData();
    }
  }, [
    fetchActivities,
    fetchMembers,
    isEditMode,
    editOrganizationId,
    editActivityId,
    editInstanceId,
  ]);

  // 기존 모임 데이터 로딩
  const fetchExistingMeetingData = useCallback(async () => {
    try {
      console.log('📢 기존 모임 데이터 로딩 시작');

      // 실제 API 호출
      const response = await attendanceService.getActivityInstanceDetails(
        editOrganizationId!,
        editActivityId!,
        editInstanceId!
      );

      const activityInstance = response.activityInstance;

      // 폼 데이터 설정
      setSelectedActivity(activityInstance.activityId);
      setStartDate(
        dateUtils.formatApiDate(new Date(activityInstance.startDateTime))
      );
      setEndDate(
        dateUtils.formatApiDate(new Date(activityInstance.endDateTime))
      );
      setStartTime(
        dateUtils.formatTime(
          new Date(activityInstance.startDateTime).toTimeString().slice(0, 5)
        )
      );
      setEndTime(
        dateUtils.formatTime(
          new Date(activityInstance.endDateTime).toTimeString().slice(0, 5)
        )
      );
      setLocation(activityInstance.location);
      setNotes(activityInstance.notes);

      // 기존 이미지 설정
      if (activityInstance.images && activityInstance.images.length > 0) {
        const firstImage = activityInstance.images[0];
        setImagePreview(firstImage.filePath);
      }

      // 참가자 상태 설정
      setMembers(prev =>
        prev.map(member => ({
          ...member,
          isParticipating: activityInstance.attendances.some(
            attendance =>
              attendance.userId === member.id && attendance.status === '출석'
          ),
        }))
      );

      console.log('✅ 기존 모임 데이터 로딩 완료');
    } catch (error) {
      console.error('❌ 기존 모임 데이터 로딩 중 오류 발생:', error);
    }
  }, [editOrganizationId, editActivityId, editInstanceId]);

  // 뒤로가기 및 닫기 핸들러
  const handleBack = () => {
    navigate('/main/meeting-records');
  };

  const handleClose = () => {
    navigate('/main/meeting-records');
  };

  // 이미지 업로드 처리
  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 파일 크기 검증 (3MB)
      const maxSizeMB = 3;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > maxSizeMB) {
        try {
          setIsUploading(true);
          console.log(`원본 이미지 크기: ${fileSizeMB.toFixed(2)}MB`);

          const compressedFile = await compressImage(file, maxSizeMB);
          const compressedSizeMB = compressedFile.size / (1024 * 1024);
          console.log(`압축된 이미지 크기: ${compressedSizeMB.toFixed(2)}MB`);

          if (compressedSizeMB > maxSizeMB) {
            alert(
              '이미지 압축 후에도 3MB를 초과합니다. 더 작은 이미지를 선택해주세요.'
            );
            return;
          }

          setSelectedImage(compressedFile);
          setImagePreview(URL.createObjectURL(compressedFile));

          const compressionRate = (
            ((fileSizeMB - compressedSizeMB) / fileSizeMB) *
            100
          ).toFixed(1);
          console.log(`이미지 압축률: ${compressionRate}%`);
        } catch (error) {
          console.error('이미지 압축 중 오류 발생:', error);
          alert('이미지 처리 중 오류가 발생했습니다.');
        } finally {
          setIsUploading(false);
        }
      } else {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    },
    []
  );

  // 이미지 압축 함수
  const compressImage = useCallback(
    (file: File, maxSizeMB: number = 3): Promise<File> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = event => {
          const img = new Image();
          img.src = event.target?.result as string;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // 초기 품질 설정
            let quality = 0.7;
            const maxSize = maxSizeMB * 1024 * 1024;

            // 이미지 크기 조정
            const MAX_WIDTH = 1280;
            const MAX_HEIGHT = 720;

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context not available'));
              return;
            }

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const compressAndCheck = (currentQuality: number) => {
              const dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
              const binaryData = atob(dataUrl.split(',')[1]);
              const currentSize = binaryData.length;

              if (currentSize > maxSize && currentQuality > 0.1) {
                const newQuality =
                  currentQuality > 0.5
                    ? currentQuality - 0.2
                    : currentQuality - 0.1;
                compressAndCheck(Math.max(0.1, newQuality));
              } else {
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                  byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'image/jpeg' });
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: new Date().getTime(),
                });
                resolve(compressedFile);
              }
            };

            compressAndCheck(quality);
          };

          img.onerror = error => {
            reject(error);
          };
        };

        reader.onerror = error => {
          reject(error);
        };
      });
    },
    []
  );

  // 활동 선택 처리 (Vue 소스와 동일하게 업데이트)
  const handleActivityChange = useCallback(
    (activityId: number | null) => {
      setSelectedActivity(activityId);

      if (activityId) {
        const activity = activities.find(a => a.id === activityId);
        if (activity && activityDefaults[activity.name]) {
          const defaults = activityDefaults[activity.name];
          setStartTime(defaults.startTime);
          setEndTime(defaults.endTime);
          setLocation(defaults.location);
          setNotes(defaults.notes);

          // 권장 날짜로 설정
          if (defaults.dayOfWeek !== undefined) {
            const recommendedDate = getNearestPastDate(defaults.dayOfWeek);
            setMeetingDate(recommendedDate);
            setStartDate(recommendedDate);

            // 자정 넘김 처리
            if (isOvernightMeeting(defaults.startTime, defaults.endTime)) {
              setEndDate(
                format(addDays(new Date(recommendedDate), 1), 'yyyy-MM-dd')
              );
            } else {
              setEndDate(recommendedDate);
            }
          }
        }
      }
    },
    [activities]
  );

  // 특정 요일의 가장 최근 과거 날짜 반환
  const getNearestPastDate = useCallback((dayOfWeek: number): string => {
    const today = new Date();
    const todayDayOfWeek = getDay(today);

    let daysToSubtract: number;

    if (todayDayOfWeek === dayOfWeek) {
      daysToSubtract = 0;
    } else if (todayDayOfWeek > dayOfWeek) {
      daysToSubtract = todayDayOfWeek - dayOfWeek;
    } else {
      daysToSubtract = 7 - (dayOfWeek - todayDayOfWeek);
    }

    const targetDate = subDays(today, daysToSubtract);
    return format(targetDate, 'yyyy-MM-dd');
  }, []);

  // 자정 넘김 모임 확인
  const isOvernightMeeting = useCallback(
    (start: string, end: string): boolean => {
      return start > end;
    },
    []
  );

  // Vue 소스와 동일한 모임 이름 설정 함수
  const setMeetingName = () => {
    if (!selectedActivity) return;

    const activity = activities.find(a => a.id === selectedActivity);
    if (activity && activityDefaults[activity.name]) {
      const defaults = activityDefaults[activity.name];
      setStartTime(defaults.startTime);
      setEndTime(defaults.endTime);
      setLocation(defaults.location);
      setNotes(defaults.notes);

      // 요일 정보가 있으면 해당 요일의 가장 최근 과거 날짜로 설정
      if (defaults.dayOfWeek !== undefined) {
        const recommendedDate = getNearestPastDate(defaults.dayOfWeek);
        setMeetingDate(recommendedDate);
        setStartDate(recommendedDate);

        // 자정을 넘기는 모임인지 확인
        if (isOvernightMeeting(defaults.startTime, defaults.endTime)) {
          setEndDate(
            format(addDays(new Date(recommendedDate), 1), 'yyyy-MM-dd')
          );
        } else {
          setEndDate(recommendedDate);
        }
      }
    }
  };

  // 날짜 변경 처리 (Vue 소스와 동일하게 업데이트)
  const handleDateChange = useCallback(
    (newDate: string) => {
      setMeetingDate(newDate);
      setStartDate(newDate);

      // 요일 검증
      if (selectedActivity) {
        const activity = activities.find(a => a.id === selectedActivity);
        if (activity && activityDefaults[activity.name]) {
          const defaults = activityDefaults[activity.name];
          const selectedDate = new Date(newDate);
          const dayOfWeek = getDay(selectedDate);

          if (dayOfWeek !== defaults.dayOfWeek) {
            // 잘못된 요일 선택 - 경고 표시
            const displayNameMapping: { [key: string]: string } = {
              현장치유팀사역: '두란노사역자모임',
            };

            setWarningInfo({
              selectedActivityName:
                displayNameMapping[activity.name] || activity.name,
              recommendedDayOfWeekText: dayOfWeekTexts[defaults.dayOfWeek],
              selectedDayOfWeekText: dayOfWeekTexts[dayOfWeek],
              selectedDate: newDate,
              recommendedDate: getNearestPastDate(defaults.dayOfWeek),
            });

            setDayOfWeekWarningOpen(true);
          }
        }
      }

      // 자정 넘김 처리
      if (startTime && endTime) {
        if (isOvernightMeeting(startTime, endTime)) {
          setEndDate(format(addDays(new Date(newDate), 1), 'yyyy-MM-dd'));
        } else {
          setEndDate(newDate);
        }
      } else {
        setEndDate(newDate);
      }
    },
    [selectedActivity, activities, startTime, endTime, getNearestPastDate]
  );

  // Vue 소스와 동일한 날짜 검증 함수
  const validateSelectedDate = useCallback((): boolean => {
    if (!selectedActivity) return true;

    const activity = activities.find(a => a.id === selectedActivity);
    if (!activity || !activityDefaults[activity.name]) return true;

    const defaults = activityDefaults[activity.name];
    if (defaults.dayOfWeek === undefined) return true;

    const selectedDate = new Date(meetingDate);
    const dayOfWeek = getDay(selectedDate);

    if (dayOfWeek !== defaults.dayOfWeek) {
      // 불일치 - 경고 대화상자 정보 설정
      const displayNameMapping: { [key: string]: string } = {
        현장치유팀사역: '두란노사역자모임',
      };

      setWarningInfo({
        selectedActivityName:
          displayNameMapping[activity.name] || activity.name,
        recommendedDayOfWeekText: dayOfWeekTexts[defaults.dayOfWeek],
        selectedDayOfWeekText: dayOfWeekTexts[dayOfWeek],
        selectedDate: meetingDate,
        recommendedDate: getNearestPastDate(defaults.dayOfWeek),
      });

      setDayOfWeekWarningOpen(true);
      return false;
    }

    return true;
  }, [selectedActivity, activities, meetingDate, getNearestPastDate]);

  // Vue 소스와 동일한 시간 유효성 검사 함수
  const validateTimes = () => {
    // 필요한 입력값이 모두 있는지 확인
    if (!startDate || !endDate) {
      return;
    }

    // 시간이 입력되지 않은 경우 기본값 설정
    if (!startTime) setStartTime('00:00');
    if (!endTime) setEndTime('00:00');

    // 자정 넘김 처리
    if (startTime && endTime && isOvernightMeeting(startTime, endTime)) {
      setEndDate(format(addDays(new Date(startDate), 1), 'yyyy-MM-dd'));
    }
  };

  // Vue 소스와 동일한 권장 요일 관련 함수들
  const getRecommendedDayOfWeek = (): number | null => {
    if (!selectedActivity) return null;

    const activity = activities.find(a => a.id === selectedActivity);
    if (!activity || !activityDefaults[activity.name]) return null;

    return activityDefaults[activity.name].dayOfWeek;
  };

  const getRecommendedDayOfWeekText = (): string => {
    const dayOfWeek = getRecommendedDayOfWeek();
    return dayOfWeek !== null ? dayOfWeekTexts[dayOfWeek] : '';
  };

  const getActivityName = (): string => {
    if (!selectedActivity) return '';

    const activity = activities.find(a => a.id === selectedActivity);
    if (!activity) return '';

    // 화면 표시용 이름 매핑
    const displayNameMapping: { [key: string]: string } = {
      현장치유팀사역: '두란노사역자모임',
    };

    return displayNameMapping[activity.name] || activity.name;
  };

  // 참가자 다이얼로그 열기
  const handleOpenParticipantsDialog = () => {
    setParticipantsDialogOpen(true);
  };

  // 참가자 다이얼로그 닫기
  const handleCloseParticipantsDialog = () => {
    setParticipantsDialogOpen(false);
    const count = members.filter(member => member.isParticipating).length;
    setParticipantCount(count);
  };

  // 참가자 선택 토글
  const handleParticipantToggle = useCallback((id: number) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === id
          ? { ...member, isParticipating: !member.isParticipating }
          : member
      )
    );
  }, []);

  // 로딩 상태 초기화
  const initLoadingState = useCallback(() => {
    setLoadingState({
      isLoading: true,
      currentStep: 0,
      totalSteps: 5,
      currentStepText: '준비 중...',
      progressPercent: 0,
      startTime: Date.now(),
      estimatedTimeLeft: null,
      hasLongDelay: false,
    });
  }, []);

  // 로딩 상태 업데이트 (Vue 소스와 동일하게 업데이트)
  const updateLoadingState = useCallback(
    (step: number, text: string, progress: number) => {
      setLoadingState(prev => ({
        ...prev,
        currentStep: step,
        currentStepText: text,
        progressPercent: progress,
      }));

      // 단계 전환 시 진동 피드백 (모바일에서만 동작)
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }

      // 장시간 소요 감지
      const currentTime = Date.now();
      const elapsedTime = loadingState.startTime
        ? (currentTime - loadingState.startTime) / 1000
        : 0;

      if (elapsedTime > 15 && !loadingState.hasLongDelay) {
        setLoadingState(prev => ({ ...prev, hasLongDelay: true }));

        // 지연 감지 시 더 강한 진동 (모바일에서만 동작)
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 200]);
        }
      }
    },
    [loadingState.startTime, loadingState.hasLongDelay]
  );

  // Vue 소스와 동일한 작업 취소 및 계속 기다리기 함수들
  const cancelOperation = () => {
    if (
      window.confirm(
        '정말 작업을 취소하시겠습니까?\n입력한 정보는 저장되지 않습니다.'
      )
    ) {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const continueWaiting = () => {
    setLoadingState(prev => ({ ...prev, hasLongDelay: false }));
  };

  // Vue 소스와 동일한 폼 초기화 함수
  const resetForm = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedActivity(null);
    setStartTime('');
    setEndTime('');
    setMeetingDate(today);
    setStartDate(today);
    setEndDate(today);
    setParticipantCount(0);
    setLocation('');
    setNotes('');

    // 모든 회원의 참여 상태 초기화
    setMembers(prev =>
      prev.map(member => ({ ...member, isParticipating: false }))
    );
  }, []);

  // 모임 정보 제출 (Vue 소스와 동일하게 업데이트)
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    // 날짜 검증
    if (!validateSelectedDate()) {
      // 경고 대화상자가 표시되므로 여기서 함수 종료
      return;
    }

    try {
      setIsSubmitting(true);
      initLoadingState();
      updateLoadingState(1, '입력 정보 검증 중...', 10);

      // 필수 입력값 검증
      if (!selectedActivity || !meetingDate) {
        alert('모임 종류와 날짜를 입력해주세요.');
        setLoadingState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      updateLoadingState(2, '이미지 업로드 준비 중...', 20);

      // 이미지 업로드 처리 (실제 구현 시 S3 업로드)
      let imageInfo = null;
      if (selectedImage) {
        try {
          updateLoadingState(2, '이미지 업로드 중...', 30);
          setIsUploading(true);

          // 파일 크기에 따른 예상 시간 계산
          const fileSizeMB = selectedImage.size / (1024 * 1024);
          setLoadingState(prev => ({
            ...prev,
            estimatedTimeLeft: Math.round(fileSizeMB * 5), // 1MB당 약 5초 예상
          }));

          // TODO: 실제 S3 업로드 구현
          console.log('이미지 업로드 시뮬레이션');
          await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션

          imageInfo = {
            url: imagePreview || '',
            fileName: selectedImage.name,
          };

          console.log('📸 업로드된 이미지 정보:', imageInfo);
          updateLoadingState(2, '이미지 업로드 완료', 40);
        } catch (error) {
          console.error('❌ 이미지 업로드 중 오류 발생:', error);
          alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
          setIsSubmitting(false);
          setIsUploading(false);
          setLoadingState(prev => ({ ...prev, isLoading: false }));
          return;
        } finally {
          setIsUploading(false);
        }
      } else {
        updateLoadingState(2, '이미지 없음, 다음 단계로 진행', 40);
      }

      updateLoadingState(3, '참여자 정보 준비 중...', 60);

      // 선택된 참여자 목록 가져오기
      const selectedParticipants = members.filter(
        member => member.isParticipating
      );
      console.log('👥 선택된 참여자:', selectedParticipants);

      updateLoadingState(4, '모임 정보 저장 중...', 80);

      // 모임 데이터 준비
      const meetingData = {
        organizationId,
        activityId: selectedActivity,
        instanceData: {
          startDateTime: dateUtils.toUTCString(
            dateUtils.createDateTime(startDate, startTime)
          ),
          endDateTime: dateUtils.toUTCString(
            dateUtils.createDateTime(endDate, endTime)
          ),
          location: location || '',
          notes: notes || '',
        },
        attendances: members.map(member => ({
          userId: member.id,
          status: member.isParticipating
            ? ('출석' as const)
            : ('결석' as const),
          checkInTime: member.isParticipating
            ? dateUtils.toUTCString(
                dateUtils.createDateTime(startDate, startTime)
              )
            : null,
          checkOutTime: member.isParticipating
            ? dateUtils.toUTCString(dateUtils.createDateTime(endDate, endTime))
            : null,
          note: '',
        })),
        imageInfo,
      };

      console.log('📝 모임 데이터:', meetingData);

      // 실제 API 호출 (새로 추가 또는 수정)
      let response;
      if (isEditMode && editInstanceId) {
        // 수정 모드
        response = await attendanceService.updateAttendance(
          organizationId,
          selectedActivity.toString(),
          editInstanceId,
          meetingData.instanceData,
          meetingData.attendances,
          imageInfo,
          true // showLog
        );
      } else {
        // 새로 추가 모드
        response = await attendanceService.recordAttendance(
          organizationId,
          selectedActivity.toString(),
          meetingData.instanceData,
          meetingData.attendances,
          imageInfo
        );
      }

      if (response.result !== 0 && response.result !== 1) {
        throw new Error(
          isEditMode
            ? '모임 정보 수정에 실패했습니다.'
            : '출석 정보 저장에 실패했습니다.'
        );
      }

      updateLoadingState(5, '모임 정보 저장 완료', 100);

      setTimeout(() => {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
        alert('모임 정보가 성공적으로 저장되었습니다.');
        resetForm();
        navigate('/main/meeting-records');
      }, 1000);
    } catch (error) {
      console.error('❌ 모임 정보 저장 중 오류 발생:', error);
      setLoadingState(prev => ({ ...prev, isLoading: false }));
      alert('모임 정보 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    selectedActivity,
    meetingDate,
    selectedImage,
    imagePreview,
    members,
    organizationId,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    notes,
    navigate,
    initLoadingState,
    updateLoadingState,
    validateSelectedDate,
    resetForm,
  ]);

  // 참여자 상태 관련 함수들 (Vue 소스와 동일하게 업데이트)
  const getMemberStatusClass = (member: Member): string => {
    if (member.isNewMember === 'Y') return 'new-family';
    if (member.roleId === 222) return 'leader'; // 순장
    if (member.roleId === 223) return 'ebs'; // EBS
    return 'member'; // 순원
  };

  const getMemberStatusText = (member: Member): string => {
    if (member.isNewMember === 'Y') return '새가족';
    if (member.roleId === 222) return '순장';
    if (member.roleId === 223) return 'EBS';
    return '순원';
  };

  // Vue 소스와 동일한 파일 업로드 상태 텍스트 함수
  const getFileUploadStatus = (): string => {
    if (!selectedImage) return '이미지 없음';
    const fileSizeMB = (selectedImage.size / (1024 * 1024)).toFixed(1);
    return `${fileSizeMB}MB 이미지 업로드 중`;
  };

  return (
    <div className='meeting-add-container'>
      {/* 헤더 */}
      <div className='meeting-header'>
        <div className='meeting-header-left'>
          <button className='meeting-back-button' onClick={handleBack}>
            <ArrowBack style={{ fontSize: 24 }} />
          </button>
          <h1 className='meeting-title'>
            {isEditMode ? '모임 기록 수정' : '새로운 모임 등록'}
          </h1>
        </div>
        <button className='meeting-close-button' onClick={handleClose}>
          <Close style={{ fontSize: 24 }} />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className='meeting-add-content'>
        {/* 이미지 업로드 */}
        <Card className='meeting-image-card'>
          <CardMedia
            component='div'
            className='meeting-image-upload-area'
            style={{
              backgroundImage: imagePreview
                ? `url(${imagePreview})`
                : 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1IDEwSDE1QzEzLjM0MzEgMTAgMTIgMTEuMzQzMSAxMiAxM1YyN0MxMiAyOC42NTY5IDEzLjM0MzEgMzAgMTUgMzBIMzVDMzYuNjU2OSAzMCAzOCAyOC42NTY5IDM4IDI3VjEzQzM4IDExLjM0MzEgMzYuNjU2OSAxMCAzNSAxMFoiIHN0cm9rZT0iIzc4OTA5QyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyIDIxTDIwIDEzTDMwIDIzTDM4IDE1IiBzdHJva2U9IiM3ODkwOUMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+)',
            }}
          >
            {!imagePreview && (
              <div className='image-upload-placeholder'>
                <div className='coram-deo-logo'>CoramDeo</div>
                <div className='image-upload-text'>
                  ⬆ 이미지를 업로드하세요
                </div>
                <div className='upload-text-en'>Upload Image</div>
              </div>
            )}
            {isUploading && (
              <Box className='upload-overlay'>
                <CircularProgress size={64} />
                <Typography variant='body2' className='upload-text'>
                  이미지 업로드 중...
                </Typography>
              </Box>
            )}
          </CardMedia>
        </Card>

        <Button
          variant='outlined'
          component='label'
          fullWidth
          className='image-upload-button'
          disabled={isUploading}
          startIcon={<CloudUpload />}
        >
          터치해서 사진 업로드
          <input
            type='file'
            hidden
            accept='image/*'
            onChange={handleImageChange}
          />
        </Button>

        {/* 모임 종류 선택 */}
        <FormControl
          fullWidth
          variant='outlined'
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--bg-elevated)',
              height: '56px',
            },
          }}
        >
          <InputLabel>모임 종류 선택</InputLabel>
          <Select
            value={selectedActivity || ''}
            label='모임 종류 선택'
            onChange={e => {
              handleActivityChange(Number(e.target.value));
              setMeetingName();
            }}
          >
            {activities.map(activity => (
              <MenuItem key={activity.id} value={activity.id}>
                {activity.name} ({activity.category})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 모임 날짜 */}
        <Typography variant='subtitle1' className='section-label'>
          모임 일정
        </Typography>

        <TextField
          type='date'
          label='모임 날짜'
          value={meetingDate}
          onChange={e => handleDateChange(e.target.value)}
          fullWidth
          variant='outlined'
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--bg-elevated)',
              height: '56px',
            },
          }}
        />

        {/* 권장 요일 안내 (Vue 소스와 동일하게 업데이트) */}
        {selectedActivity && getRecommendedDayOfWeek() !== null && (
          <Box className='recommended-day-notice'>
            <Warning color='info' fontSize='small' />
            <Typography variant='body2'>
              {getActivityName()}은(는) {getRecommendedDayOfWeekText()}에
              진행되는 모임입니다.
            </Typography>
          </Box>
        )}

        {/* 시작 일시 */}
        <Box className='date-time-section'>
          <Typography variant='subtitle2' className='section-title'>
            시작 일시
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              type='date'
              label='시작 날짜'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              fullWidth
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-elevated)',
                  height: '56px',
                },
              }}
            />
            <TextField
              type='time'
              label='시작 시간'
              value={startTime}
              onChange={e => {
                setStartTime(e.target.value);
                validateTimes();
              }}
              fullWidth
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-elevated)',
                  height: '56px',
                },
              }}
            />
          </Box>
        </Box>

        {/* 종료 일시 */}
        <Box className='date-time-section'>
          <Typography variant='subtitle2' className='section-title'>
            종료 일시
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              type='date'
              label='종료 날짜'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              fullWidth
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-elevated)',
                  height: '56px',
                },
              }}
            />
            <TextField
              type='time'
              label='종료 시간'
              value={endTime}
              onChange={e => {
                setEndTime(e.target.value);
                validateTimes();
              }}
              fullWidth
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--bg-elevated)',
                  height: '56px',
                },
              }}
            />
          </Box>

          {/* 자정 넘김 알림 */}
          {startTime && endTime && isOvernightMeeting(startTime, endTime) && (
            <Box className='midnight-notice'>
              <Warning color='warning' fontSize='small' />
              <Typography variant='body2'>
                이 모임은 다음 날 종료됩니다
              </Typography>
            </Box>
          )}
        </Box>

        {/* 참여자 수 */}
        <TextField
          label='모임 참여자 수'
          value={participantCount || ''}
          onClick={handleOpenParticipantsDialog}
          fullWidth
          variant='outlined'
          InputProps={{
            readOnly: true,
            endAdornment: <Group />,
          }}
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--bg-elevated)',
              height: '56px',
              cursor: 'pointer',
            },
          }}
        />

        {/* 모임 장소 */}
        <TextField
          label='모임 장소'
          value={location}
          onChange={e => setLocation(e.target.value)}
          fullWidth
          variant='outlined'
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--bg-elevated)',
              height: '56px',
            },
          }}
        />

        {/* 모임 메모 */}
        <TextField
          label='모임 메모'
          value={notes}
          onChange={e => setNotes(e.target.value)}
          multiline
          rows={3}
          fullWidth
          variant='outlined'
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--bg-elevated)',
              minHeight: '80px',
            },
          }}
        />

        {/* 제출 버튼 */}
        <Button
          variant='contained'
          fullWidth
          size='large'
          className='submit-button'
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedActivity || !meetingDate}
        >
          {isSubmitting ? '모임 정보 저장 중...' : '모임 정보 입력'}
        </Button>
      </div>

      {/* 참여자 선택 다이얼로그 */}
      <Dialog
        open={participantsDialogOpen}
        onClose={handleCloseParticipantsDialog}
        maxWidth='sm'
        fullWidth
        className='participants-dialog'
      >
        <DialogTitle className='participants-dialog-title'>
          모임 참여자 선택
        </DialogTitle>
        <DialogContent className='participants-list'>
          {members.map(member => (
            <div key={member.id} className='participant-item'>
              <div className='participant-info'>
                <div className='participant-name'>{member.name}</div>
                <div
                  className={`participant-label ${getMemberStatusClass(member)}`}
                >
                  {getMemberStatusText(member)}
                </div>
              </div>
              <Switch
                checked={member.isParticipating || false}
                onChange={() => handleParticipantToggle(member.id)}
                className='participant-toggle'
              />
            </div>
          ))}
        </DialogContent>
        <DialogActions className='participants-dialog-actions'>
          <Button
            onClick={handleCloseParticipantsDialog}
            variant='contained'
            className='common-button'
          >
            완료
          </Button>
        </DialogActions>
      </Dialog>

      {/* 요일 경고 다이얼로그 */}
      <Dialog
        open={dayOfWeekWarningOpen}
        onClose={() => setDayOfWeekWarningOpen(false)}
        maxWidth='sm'
      >
        <DialogTitle>잘못된 요일 선택</DialogTitle>
        <DialogContent>
          <Typography variant='body1' paragraph>
            {warningInfo.selectedActivityName}은(는){' '}
            {warningInfo.recommendedDayOfWeekText}에 진행되는 모임입니다.
          </Typography>
          <Typography variant='body1' paragraph>
            선택한 날짜 {warningInfo.selectedDate}는{' '}
            {warningInfo.selectedDayOfWeekText}입니다.
          </Typography>
          <Typography variant='body1'>
            권장되는 모임 날짜({warningInfo.recommendedDate})로
            변경하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDayOfWeekWarningOpen(false)} color='error'>
            아니오, 유지합니다
          </Button>
          <Button
            onClick={() => {
              setMeetingDate(warningInfo.recommendedDate);
              setStartDate(warningInfo.recommendedDate);
              setEndDate(warningInfo.recommendedDate);
              setDayOfWeekWarningOpen(false);
            }}
            color='primary'
          >
            예, 변경합니다
          </Button>
        </DialogActions>
      </Dialog>

      {/* 로딩 다이얼로그 */}
      <Dialog
        open={loadingState.isLoading}
        disableEscapeKeyDown
        PaperProps={{ style: { maxWidth: '400px', width: '100%' } }}
      >
        <DialogTitle>모임 정보 저장 중...</DialogTitle>
        <DialogContent>
          <Stepper activeStep={loadingState.currentStep} orientation='vertical'>
            <Step>
              <StepLabel>입력 정보 검증</StepLabel>
            </Step>
            <Step>
              <StepLabel>
                이미지 업로드
                {loadingState.currentStep === 2 && selectedImage && (
                  <Typography variant='caption' display='block'>
                    {getFileUploadStatus()}
                  </Typography>
                )}
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>참석자 정보 준비</StepLabel>
            </Step>
            <Step>
              <StepLabel>모임 정보 저장</StepLabel>
            </Step>
            <Step>
              <StepLabel>완료</StepLabel>
            </Step>
          </Stepper>

          <Box className='loading-progress' sx={{ mt: 3 }}>
            <LinearProgress
              variant='determinate'
              value={loadingState.progressPercent}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant='body2' align='center' sx={{ mt: 1 }}>
              {loadingState.currentStepText}
            </Typography>

            {loadingState.estimatedTimeLeft && (
              <Typography
                variant='body2'
                align='center'
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                예상 소요 시간: {loadingState.estimatedTimeLeft}초
              </Typography>
            )}

            {loadingState.hasLongDelay && (
              <Box
                className='delay-notice'
                sx={{
                  mt: 2,
                  p: 1,
                  backgroundColor: 'warning.light',
                  borderRadius: 1,
                }}
              >
                <Typography variant='body2' color='warning.dark'>
                  ⚠️ 평소보다 시간이 더 소요되고 있습니다. 잠시만 기다려주세요.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        {loadingState.hasLongDelay && (
          <DialogActions>
            <Button color='error' onClick={cancelOperation}>
              취소
            </Button>
            <Button color='primary' onClick={continueWaiting}>
              계속 기다리기
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default MeetingAdd;
