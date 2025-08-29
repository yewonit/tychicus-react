import {
  ArrowBack,
  Close,
  Delete,
  Edit,
  Group,
  Person,
  PersonAdd,
} from '@mui/icons-material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Member {
  userId: number;
  name: string;
  nameSuffix: string;
  email?: string | null;
  genderType: 'M' | 'F';
  birthDate: string;
  address?: string | null;
  addressDetail?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  country?: string | null;
  zipPostalCode?: string | null;
  isAddressPublic: 'Y' | 'N';
  snsUrl?: string | null;
  hobby?: string | null;
  phoneNumber?: string;
  isPhoneNumberPublic: 'Y' | 'N';
  churchMemberNumber?: string | null;
  churchRegistrationDate?: string | null;
  isNewMember: 'Y' | 'N';
  isLongTermAbsentee: 'Y' | 'N';
  isKakaotalkChatMember: 'Y' | 'N';
  roleId: number;
  roleName: string;
}

interface MemberStats {
  totalMembers: number;
  newMembers: number;
  longTermMembers: number;
}

const MemberList: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MemberStats>({
    totalMembers: 0,
    newMembers: 0,
    longTermMembers: 0,
  });

  // 더미 데이터 정의 (API 호출 오류 시 사용) - useMemo로 최적화
  const dummyMembers = useMemo(
    (): Member[] => [
      {
        userId: 1672,
        name: '장승빈',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '2000-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01066335628',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 222,
        roleName: '순장',
      },
      {
        userId: 1673,
        name: '최선의',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01067583133',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 223,
        roleName: 'EBS',
      },
      {
        userId: 1674,
        name: '임예원',
        nameSuffix: 'B',
        email: 'yeahoneness99@gmail.com',
        genderType: 'F',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01099479355',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1675,
        name: '홍신기',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01063961652',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1676,
        name: '이건우',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '2002-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01073793281',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1677,
        name: '명정아',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01042377542',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1678,
        name: '권민호',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01099893919',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1679,
        name: '이주혁',
        nameSuffix: 'B',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01062825272',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1680,
        name: '이상은',
        nameSuffix: 'B',
        email: null,
        genderType: 'F',
        birthDate: '2001-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01092077566',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1681,
        name: '조헌기',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '2001-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01084311626',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1682,
        name: '이영은',
        nameSuffix: 'H',
        email: null,
        genderType: 'F',
        birthDate: '2002-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01077257065',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1683,
        name: '성미르',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '2002-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01089028745',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1684,
        name: '김진태',
        nameSuffix: 'G',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01065113944',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1685,
        name: '김동현',
        nameSuffix: 'K',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01090857184',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1686,
        name: '오의연',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '2000-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01089747728',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1687,
        name: '김범진',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1998-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01059615642',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1688,
        name: '주한희',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01085588393',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1689,
        name: '김선혜',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '2000-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01075076962',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1690,
        name: '김하민',
        nameSuffix: '',
        email: null,
        genderType: 'M',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01028561795',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1691,
        name: '박승준',
        nameSuffix: 'C',
        email: null,
        genderType: 'M',
        birthDate: '2001-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01075179293',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1692,
        name: '송준희',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01084879949',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1693,
        name: '이민우',
        nameSuffix: 'F',
        email: null,
        genderType: 'M',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01042738691',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1694,
        name: '이준혁',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '1997-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1695,
        name: '진현승',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1999-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01056233300',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 1696,
        name: '채벼리',
        nameSuffix: 'A',
        email: null,
        genderType: 'F',
        birthDate: '1995-01-01',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: null,
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: null,
        isNewMember: 'N',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 2267,
        name: '김기상',
        nameSuffix: 'A',
        email: null,
        genderType: 'M',
        birthDate: '1997-09-08',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: 'KOR',
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01071258070',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: '2025-03-16T00:00:00.000Z',
        isNewMember: 'Y',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 2319,
        name: '김성진',
        nameSuffix: 'FFF',
        email: null,
        genderType: 'M',
        birthDate: '2004-06-19',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: 'KOR',
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01076109215',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: '2025-03-16T00:00:00.000Z',
        isNewMember: 'Y',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
      {
        userId: 2393,
        name: '정구일',
        nameSuffix: 'FFF',
        email: null,
        genderType: 'M',
        birthDate: '1998-12-14',
        address: null,
        addressDetail: null,
        city: null,
        stateProvince: null,
        country: 'KOR',
        zipPostalCode: null,
        isAddressPublic: 'N',
        snsUrl: null,
        hobby: null,
        phoneNumber: '01037023268',
        isPhoneNumberPublic: 'N',
        churchMemberNumber: null,
        churchRegistrationDate: '2025-03-16T00:00:00.000Z',
        isNewMember: 'Y',
        isLongTermAbsentee: 'N',
        isKakaotalkChatMember: 'N',
        roleId: 224,
        roleName: '순원',
      },
    ],
    []
  );

  // 현재 사용자 정보에서 조직 ID 가져오기 (임시로 하드코딩, 나중에 Redux에서 가져와야 함)
  // const organizationId = 106; // TODO: 실제 사용자의 조직 ID로 변경

  /**
   * @description 더미 데이터를 사용하여 멤버 정보를 반환하는 함수 (API 호출 오류 시 사용)
   * @returns {Promise<Member[]>} 더미 멤버 데이터
   */
  const getMembersWithRoles = useCallback(
    async (_organizationId: number): Promise<Member[]> => {
      try {
        // API 호출 대신 더미 데이터 반환
        // console.log('더미 데이터를 사용합니다. API 호출이 비활성화되었습니다.');
        return dummyMembers;

        // TODO: API가 정상화되면 아래 코드를 활성화
        // const response = await axiosClient.get('/current-members', {
        //   params: {
        //     organizationId: _organizationId,
        //   },
        // });
        // const returnData = response.data;
        // return returnData || [];
      } catch (error: any) {
        console.error('멤버 조회 중 오류 발생:', error);
        // API 오류 시에도 더미 데이터 반환
        return dummyMembers;
      }
    },
    [dummyMembers]
  );

  /**
   * @description 멤버 리스트를 조회하고 정렬하여 상태를 업데이트하는 비동기 메서드
   * @async
   * @returns {Promise<void>} 멤버 리스트 조회 및 정렬이 완료되면 해결되는 Promise
   */
  const fetchMemberList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 해당 조직의 모든 멤버와 그들의 역할 정보를 조회
      let memberList = await getMembersWithRoles(106);

      /**
       * @description 멤버 리스트 정렬 로직
       * @details
       * 1. 새가족(isNewMember='Y')이 최상위로 정렬됨
       * 2. 그 다음으로 장기결석자(isLongTermAbsentee='Y')가 정렬됨
       * 3. 마지막으로 역할 우선순위에 따라 정렬
       *    - roleOrder 객체에 정의된 순서:
       *      8: 1순위
       *      9: 2순위
       *      10: 3순위
       *      11: 6순위
       *      5: 3순위
       *      기타: 6순위
       */
      memberList.sort((a, b) => {
        // 역할별 우선순위 정의 (실제 API 데이터 기준)
        const roleOrder: { [key: number]: number } = {
          222: 1, // 순장
          223: 2, // EBS
          224: 3, // 순원
        };
        const roleA = roleOrder[a.roleId] || 6;
        const roleB = roleOrder[b.roleId] || 6;

        // 새가족 우선 정렬
        if (a.isNewMember === 'Y' && b.isNewMember !== 'Y') return -1;
        if (a.isNewMember !== 'Y' && b.isNewMember === 'Y') return 1;

        // 장기결석자 정렬
        if (a.isLongTermAbsentee === 'Y' && b.isLongTermAbsentee !== 'Y')
          return -1;
        if (a.isLongTermAbsentee !== 'Y' && b.isLongTermAbsentee === 'Y')
          return 1;

        // 역할 우선순위에 따른 정렬
        return roleA - roleB;
      });

      // 정렬된 멤버 리스트를 컴포넌트의 상태값으로 저장
      setMembers(memberList);

      // 멤버 통계 업데이트 (새가족 수, 장기결석자 수 등)
      updateCounts(memberList);
    } catch (error: any) {
      console.error('멤버 리스트 조회 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getMembersWithRoles]);

  /**
   * @description 멤버 통계를 업데이트하는 메서드
   * @param {Member[]} memberList 멤버 리스트
   */
  const updateCounts = (memberList: Member[]) => {
    const totalMembers = memberList.length;
    const newMembers = memberList.filter(m => m.isNewMember === 'Y').length;
    const longTermMembers = memberList.filter(
      m => m.isLongTermAbsentee === 'Y'
    ).length;

    setStats({
      totalMembers,
      newMembers,
      longTermMembers,
    });
  };

  // 컴포넌트 마운트 시 멤버 리스트 조회
  useEffect(() => {
    fetchMemberList();
  }, [fetchMemberList]);

  // 역할명 표시 함수
  const getRoleDisplayName = (roleId: number, roleName: string) => {
    // 역할 ID에 따른 표시명 매핑 (실제 API 데이터 기준)
    const roleMap: { [key: number]: string } = {
      222: '순장',
      223: 'EBS',
      224: '순원',
    };
    return roleMap[roleId] || roleName || '순원';
  };

  // 이름에서 첫 글자 추출
  const getInitial = (name: string) => {
    return name.charAt(name.length - 1); // 한국어 이름의 마지막 글자 사용
  };

  const handleBack = () => {
    navigate('/main/service-selection');
  };

  const handleClose = () => {
    navigate('/main/service-selection');
  };

  const handleEdit = (memberId: string) => {
    // TODO: 회원 수정 기능 구현
    alert(`회원 ${memberId} 수정 기능을 구현 예정입니다.`);
  };

  const handleDelete = (memberId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setMembers(prev => prev.filter(m => m.userId.toString() !== memberId));
      // 통계도 업데이트
      const updatedMembers = members.filter(
        m => m.userId.toString() !== memberId
      );
      updateCounts(updatedMembers);
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className='member-management-container'>
        <div className='member-header'>
          <div className='member-header-left'>
            <button className='member-back-button' onClick={handleBack}>
              <ArrowBack style={{ fontSize: 24 }} />
            </button>
            <h1 className='member-title'>회원 명단</h1>
          </div>
          <button className='member-close-button' onClick={handleClose}>
            <Close style={{ fontSize: 24 }} />
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>멤버 리스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className='member-management-container'>
        <div className='member-header'>
          <div className='member-header-left'>
            <button className='member-back-button' onClick={handleBack}>
              <ArrowBack style={{ fontSize: 24 }} />
            </button>
            <h1 className='member-title'>회원 명단</h1>
          </div>
          <button className='member-close-button' onClick={handleClose}>
            <Close style={{ fontSize: 24 }} />
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>오류: {error}</p>
          <button onClick={fetchMemberList} style={{ marginTop: '1rem' }}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='member-management-container'>
      {/* 헤더 */}
      <div className='member-header'>
        <div className='member-header-left'>
          <button className='member-back-button' onClick={handleBack}>
            <ArrowBack style={{ fontSize: 24 }} />
          </button>
          <h1 className='member-title'>회원 명단</h1>
        </div>
        <button className='member-close-button' onClick={handleClose}>
          <Close style={{ fontSize: 24 }} />
        </button>
      </div>

      {/* 그룹 정보 */}
      <div className='member-info-container'>
        <div className='member-group-name'>코람데오4구_민회쥬그룹_장승빈순</div>
        <div className='member-description'>인원을 관리하세요</div>

        {/* 통계 */}
        <div className='member-stats-container'>
          <div className='member-stat-item'>
            <Group className='member-stat-icon' />
            <div className='member-stat-label'>총 재적인원</div>
            <div className='member-stat-value'>
              {stats.totalMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
          <div className='member-stat-item'>
            <PersonAdd className='member-stat-icon' />
            <div className='member-stat-label'>새가족 수</div>
            <div className='member-stat-value'>
              {stats.newMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
          <div className='member-stat-item'>
            <Person className='member-stat-icon' />
            <div className='member-stat-label'>장단결자 수</div>
            <div className='member-stat-value'>
              {stats.longTermMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className='member-list-container'>
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            등록된 회원이 없습니다.
          </div>
        ) : (
          members.map(member => (
            <div key={member.userId} className='member-item'>
              <div className='member-avatar'>
                <span className='member-avatar-text'>
                  {getInitial(member.name)}
                </span>
              </div>
              <div className='member-info'>
                <div className='member-name'>{member.name}</div>
                <span
                  className={`member-role ${getRoleDisplayName(member.roleId, member.roleName)}`}
                >
                  {member.isNewMember === 'Y' && '새가족'}
                  {member.isNewMember === 'N' &&
                    getRoleDisplayName(member.roleId, member.roleName)}
                </span>
                {member.isLongTermAbsentee === 'Y' && (
                  <span
                    className='member-role 장단결자'
                    style={{ marginLeft: '4px' }}
                  >
                    장단결자
                  </span>
                )}
              </div>
              <div className='member-actions'>
                <button
                  className='member-action-button'
                  onClick={() => handleDelete(member.userId.toString())}
                  title='삭제'
                >
                  <Delete style={{ fontSize: 20 }} />
                </button>
                <button
                  className='member-action-button'
                  onClick={() => handleEdit(member.userId.toString())}
                  title='수정'
                >
                  <Edit style={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberList;
