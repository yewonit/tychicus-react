/**
 * 활동별 기본값 설정
 */
export interface ActivityDefaults {
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  dayOfWeek: number; // 0: 일요일, 1: 월요일, ... 6: 토요일
}

export const activityDefaults: { [key: string]: ActivityDefaults } = {
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

export const dayOfWeekTexts = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

export const displayNameMapping: { [key: string]: string } = {
  현장치유팀사역: '두란노사역자모임',
};

export const roleInfo: { [key: string]: { color: string; priority: number } } =
  {
    그룹장: { color: '#B3C6FF', priority: 1 }, // 파스텔 블루
    순장: { color: '#D6E0FF', priority: 1 }, // 연한 파스텔 블루
    EBS: { color: '#FFF4B3', priority: 2 }, // 파스텔 옐로우
    순원: { color: '#C2E0C2', priority: 3 }, // 파스텔 그린
    회원: { color: '#D6EAD6', priority: 3 }, // 연한 파스텔 그린
  };
