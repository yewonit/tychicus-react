import axiosClient from './axiosClient';

export interface Attendance {
  userId: number;
  userName: string;
  userEmail: string | null;
  userPhoneNumber: string;
  status: '출석' | '결석';
  check_in_time: string | null;
  check_out_time: string | null;
}

export interface ActivityInstance {
  id: number;
  activity_id: number;
  parent_instance_id: number | null;
  start_datetime: string;
  end_datetime: string;
  actual_location: string;
  actual_online_link: string | null;
  notes: string;
  attendance_count: number;
  is_canceled: boolean;
  created_at: string;
  updated_at: string;
  creator_id: number;
  updater_id: number;
  attendances: Attendance[];
  images: Array<{ filePath: string }>;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  instances: ActivityInstance[];
}

export interface OrganizationActivitiesResponse {
  organizationId: number;
  organizationName: string;
  activities: Activity[];
}

export interface DeleteActivityInstanceResponse {
  deletedActivityInstanceId: string;
}

export interface RecordAttendanceRequest {
  instanceData: {
    startDateTime: string;
    endDateTime: string;
    location: string;
    notes: string;
  };
  attendances: Array<{
    userId: number;
    status: '출석' | '결석';
    checkInTime: string | null;
    checkOutTime: string | null;
    note: string;
  }>;
  imageInfo?: {
    url: string;
    fileName: string;
  } | null;
}

export interface RecordAttendanceResponse {
  result: number;
  message: string;
  activityInstanceId?: string;
}

export interface UpdateActivityInstanceResponse {
  result: number;
  message: string;
  activityInstanceId?: string;
}

export interface ActivityInstanceDetails {
  activityInstance: {
    id: number;
    activityId: number;
    activityName: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    notes: string;
    images: Array<{
      id: number;
      fileName: string;
      filePath: string;
      fileSize: number;
      fileType: string;
    }>;
    attendances: Array<{
      id: number;
      userId: number;
      userName: string;
      status: '출석' | '결석';
      checkInTime: string | null;
      checkOutTime: string | null;
      note: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateAttendanceResponse {
  result: number;
  message: string;
  updatedActivityInstanceId?: number;
  updatedAttendances?: Array<{
    id: number;
    userId: number;
    status: '출석' | '결석';
    checkInTime: string | null;
    checkOutTime: string | null;
    note: string;
  }>;
}

export const attendanceService = {
  /**
   * 조직의 모든 활동 정보 조회 (미팅 목록)
   */
  async getOrganizationActivities(
    organizationId: string,
    showLog: boolean = false
  ): Promise<OrganizationActivitiesResponse> {
    try {
      if (showLog) {
        // eslint-disable-next-line no-console
        console.log(`조직 ${organizationId}의 활동 정보를 조회합니다.`);
      }

      const response = await axiosClient.get(
        `/organizations/${organizationId}/activities`
      );

      if (showLog) {
        // eslint-disable-next-line no-console
        console.log('활동 정보 조회 성공:', response.data);
      }

      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('활동 정보 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 활동 인스턴스 삭제
   */
  async deleteActivityInstance(
    organizationId: string,
    activityId: string,
    instanceId: string
  ): Promise<DeleteActivityInstanceResponse> {
    try {
      // eslint-disable-next-line no-console
      console.log(
        `활동 인스턴스 삭제: ${organizationId}/${activityId}/${instanceId}`
      );

      const response = await axiosClient.delete(
        `/organizations/${organizationId}/activities/${activityId}/instances/${instanceId}`
      );

      // eslint-disable-next-line no-console
      console.log('활동 인스턴스 삭제 성공:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('활동 인스턴스 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 활동 인스턴스 상세 조회 (수정 페이지 진입 시)
   */
  async getActivityInstanceDetails(
    organizationId: string,
    activityId: string,
    activityInstanceId: string
  ): Promise<ActivityInstanceDetails> {
    try {
      // eslint-disable-next-line no-console
      console.log(
        `활동 인스턴스 상세 조회: ${organizationId}/${activityId}/${activityInstanceId}`
      );

      const response = await axiosClient.get(
        `/organizations/${organizationId}/activities/${activityId}/instances/${activityInstanceId}`
      );

      // eslint-disable-next-line no-console
      console.log('활동 인스턴스 상세 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('활동 인스턴스 상세 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 출석 정보 업데이트 (메인 수정 API)
   */
  async updateAttendance(
    organizationId: string,
    activityId: string,
    activityInstanceId: string,
    instanceData: RecordAttendanceRequest['instanceData'],
    attendances: RecordAttendanceRequest['attendances'],
    imageInfo: RecordAttendanceRequest['imageInfo'] = null,
    showLog: boolean = false
  ): Promise<UpdateAttendanceResponse> {
    try {
      const requestData: RecordAttendanceRequest = {
        instanceData,
        attendances,
        imageInfo,
      };

      if (showLog) {
        // eslint-disable-next-line no-console
        console.log('출석 정보 업데이트 요청:', requestData);
      }

      const response = await axiosClient.put(
        `/organizations/${organizationId}/activities/${activityId}/instances/${activityInstanceId}`,
        requestData
      );

      if (showLog) {
        // eslint-disable-next-line no-console
        console.log('출석 정보 업데이트 결과:', response.data);
      }

      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('출석 정보 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 활동 인스턴스 수정
   */

  /**
   * 출석 기록 생성 (메인 API)
   */
  async recordAttendance(
    organizationId: string,
    activityId: string,
    instanceData: RecordAttendanceRequest['instanceData'],
    attendances: RecordAttendanceRequest['attendances'],
    imageInfo: RecordAttendanceRequest['imageInfo'] = null
  ): Promise<RecordAttendanceResponse> {
    try {
      const requestData: RecordAttendanceRequest = {
        instanceData,
        attendances,
        imageInfo,
      };

      // eslint-disable-next-line no-console
      console.log('출석 기록 생성 요청:', requestData);

      const response = await axiosClient.post(
        `/organizations/${organizationId}/activities/${activityId}/attendance`,
        requestData
      );

      // eslint-disable-next-line no-console
      console.log('출석 기록 생성 성공:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('출석 정보 기록 실패:', error);
      throw error;
    }
  },
};
