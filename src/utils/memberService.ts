import axiosClient from './axiosClient';

export interface Member {
  id: number;
  name: string;
  nameSuffix: string;
  roleId: number;
  roleName: string;
  isNewMember: 'Y' | 'N';
  isLongTermAbsentee: 'Y' | 'N';
  isParticipating?: boolean;
}

export interface OrganizationMembersResponse {
  members: Member[];
}

export interface MembersWithRolesResponse {
  members: Member[];
}

export const memberService = {
  /**
   * 조직 멤버 목록 조회
   */
  async getOrganizationMembers(
    organizationId: string
  ): Promise<OrganizationMembersResponse> {
    try {
      // eslint-disable-next-line no-console
      console.log(`조직 ${organizationId}의 멤버 정보를 조회합니다.`);

      const response = await axiosClient.get(
        `/organizations/${organizationId}/members`
      );

      // eslint-disable-next-line no-console
      console.log('조직 멤버 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('조직 멤버 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 역할 정보와 함께 멤버 조회
   */
  async getMembersWithRoles(
    organizationId: string
  ): Promise<MembersWithRolesResponse> {
    try {
      // eslint-disable-next-line no-console
      console.log(`조직 ${organizationId}의 멤버 정보를 조회합니다.`);

      const response = await axiosClient.get(
        `/organizations/${organizationId}/members`
      );

      // eslint-disable-next-line no-console
      console.log('멤버 정보 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('멤버 역할 정보 조회 실패:', error);
      throw error;
    }
  },
};
