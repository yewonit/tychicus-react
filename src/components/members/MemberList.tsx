import {
  ArrowBack,
  Close,
  Delete,
  Edit,
  Group,
  Person,
  PersonAdd,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: string;
  name: string;
  role: '새가족' | '순원' | '순장' | 'EBS';
  avatarColor?: string;
}

const MemberList: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '김기상', role: '새가족' },
    { id: '2', name: '김성진', role: '새가족' },
    { id: '3', name: '정구일', role: '새가족' },
    { id: '4', name: '장승빈', role: '순장' },
    { id: '5', name: '최성의', role: 'EBS' },
    { id: '6', name: '임예원', role: '순원' },
  ]);

  // 통계 계산
  const totalMembers = members.length;
  const newMembers = members.filter(m => m.role === '새가족').length;
  const longTermMembers = 0; // TODO: 장단결자 데이터가 있을 때 계산

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
      setMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

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
              {totalMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
          <div className='member-stat-item'>
            <PersonAdd className='member-stat-icon' />
            <div className='member-stat-label'>새가족 수</div>
            <div className='member-stat-value'>
              {newMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
          <div className='member-stat-item'>
            <Person className='member-stat-icon' />
            <div className='member-stat-label'>장단결자 수</div>
            <div className='member-stat-value'>
              {longTermMembers}
              <span className='member-stat-unit'>명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className='member-list-container'>
        {members.map(member => (
          <div key={member.id} className='member-item'>
            <div className='member-avatar'>
              <span className='member-avatar-text'>
                {getInitial(member.name)}
              </span>
            </div>
            <div className='member-info'>
              <div className='member-name'>{member.name}</div>
              <span className={`member-role ${member.role}`}>
                {member.role}
              </span>
            </div>
            <div className='member-actions'>
              <button
                className='member-action-button'
                onClick={() => handleDelete(member.id)}
                title='삭제'
              >
                <Delete style={{ fontSize: 20 }} />
              </button>
              <button
                className='member-action-button'
                onClick={() => handleEdit(member.id)}
                title='수정'
              >
                <Edit style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
