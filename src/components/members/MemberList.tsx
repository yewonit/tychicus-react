import {
  ArrowBack,
  Close,
  Delete,
  Edit,
  Group,
  Person,
  PersonAdd,
} from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';

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

  // 현재 사용자 정보에서 조직 ID 가져오기 (임시로 하드코딩, 나중에 Redux에서 가져와야 함)
  const organizationId = 106; // TODO: 실제 사용자의 조직 ID로 변경

  /**
   * @description 특정 조직의 모든 멤버와 그들의 역할 정보를 조회하는 API
   * @param {number} organizationId 조직 ID
   * @returns {Promise<Member[]>} 조회 결과 (멤버 정보 배열)
   */
  const getMembersWithRoles = useCallback(
    async (organizationId: number): Promise<Member[]> => {
      try {
        const response = await axiosClient.get('/current-members', {
          params: {
            organizationId: organizationId,
          },
        });

        const returnData = response.data;

        return returnData || [];
      } catch (error: any) {
        console.error('멤버 조회 중 오류 발생:', error);
        throw new Error(
          error.response?.data?.message || '멤버 조회에 실패했습니다.'
        );
      }
    },
    []
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
      let memberList = await getMembersWithRoles(organizationId);

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
  }, [organizationId, getMembersWithRoles]);

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
