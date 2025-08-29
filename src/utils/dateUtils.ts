import { addDays, format, getDay, isValid, parseISO, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DATE_FORMATS, DAY_OF_WEEK_TEXTS } from './constants';

/**
 * 날짜를 표시 형식으로 변환
 */
export const formatDisplayDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '날짜 형식 오류';

    return format(dateObj, DATE_FORMATS.DISPLAY, { locale: ko });
  } catch (error) {
    return '날짜 형식 오류';
  }
};

/**
 * 날짜를 API 형식으로 변환
 */
export const formatApiDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    return format(dateObj, DATE_FORMATS.API);
  } catch (error) {
    return '';
  }
};

/**
 * 시간을 표시 형식으로 변환
 */
export const formatTime = (time: string): string => {
  if (!time) return '-- : --';

  try {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')} : ${minutes.padStart(2, '0')}`;
  } catch (error) {
    return '-- : --';
  }
};

/**
 * 요일 텍스트 반환
 */
export const getDayOfWeekText = (dayOfWeek: number): string => {
  return DAY_OF_WEEK_TEXTS[dayOfWeek] || '알 수 없음';
};

/**
 * 날짜로부터 요일 반환
 */
export const getDayOfWeekFromDate = (date: string | Date): number => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 0;

    return getDay(dateObj);
  } catch (error) {
    return 0;
  }
};

/**
 * 가장 가까운 과거 요일 찾기
 */
export const getNearestPastDayOfWeek = (
  targetDayOfWeek: number,
  fromDate: Date = new Date()
): Date => {
  const currentDayOfWeek = getDay(fromDate);
  const daysToSubtract = (currentDayOfWeek - targetDayOfWeek + 7) % 7;

  if (daysToSubtract === 0) {
    return fromDate;
  }

  return subDays(fromDate, daysToSubtract);
};

/**
 * 가장 가까운 미래 요일 찾기
 */
export const getNearestFutureDayOfWeek = (
  targetDayOfWeek: number,
  fromDate: Date = new Date()
): Date => {
  const currentDayOfWeek = getDay(fromDate);
  const daysToAdd = (targetDayOfWeek - currentDayOfWeek + 7) % 7;

  if (daysToAdd === 0) {
    return fromDate;
  }

  return addDays(fromDate, daysToAdd);
};

/**
 * 자정을 넘기는 모임인지 확인
 */
export const isOvernightMeeting = (
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes < startMinutes;
  } catch (error) {
    return false;
  }
};

/**
 * 날짜가 유효한지 확인
 */
export const isValidDate = (date: string): boolean => {
  try {
    const dateObj = parseISO(date);
    return isValid(dateObj);
  } catch (error) {
    return false;
  }
};

/**
 * 시간이 유효한지 확인
 */
export const isValidTime = (time: string): boolean => {
  if (!time) return false;

  try {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  } catch (error) {
    return false;
  }
};

/**
 * 날짜 범위 생성 (시작일부터 종료일까지)
 */
export const createDateRange = (
  startDate: string,
  endDate: string
): string[] => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) return [];

    const dates: string[] = [];
    let current = start;

    while (current <= end) {
      dates.push(formatApiDate(current));
      current = addDays(current, 1);
    }

    return dates;
  } catch (error) {
    return [];
  }
};
