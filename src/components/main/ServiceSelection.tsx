import { EventNote, Group } from '@mui/icons-material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const ServiceSelection: React.FC = () => {
  const navigate = useNavigate();

  const services: ServiceCard[] = [
    {
      id: 'member-management',
      title: '재적인원관리',
      description: '재적 인원을 관리합니다',
      icon: <Group />,
      path: '/main/member-management',
      color: '#4ecdc4',
    },
    {
      id: 'meeting-records',
      title: '모임기록관리',
      description: '모임 기록을 관리합니다',
      icon: <EventNote />,
      path: '/main/meeting-records',
      color: '#5dade2',
    },
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className='service-selection-container'>
      {/* 헤더 */}
      <div className='service-header'>
        <h1 className='service-title'>서비스 선택</h1>
        <div className='service-subtitle'>ㅇㅇㅇ그룹</div>
        <div className='service-subtitle'>정성민순</div>
      </div>

      {/* 서비스 카드들 */}
      <div className='service-cards-container'>
        {services.map(service => (
          <div key={service.id} className='service-card'>
            <div className='service-card-content'>
              {/* 아이콘과 제목 */}
              <div
                className={`service-icon-container ${service.color === '#4ecdc4' ? 'primary' : 'secondary'}`}
              >
                {React.cloneElement(service.icon as React.ReactElement, {
                  style: { fontSize: 32, color: 'white' },
                })}
              </div>

              <h2 className='service-card-title'>{service.title}</h2>

              <div className='service-card-subtitle'>
                {service.title === '재적인원관리'
                  ? 'Management of members'
                  : 'Meeting History Management'}
              </div>

              {/* 설명 */}
              <div className='service-card-description'>
                {service.title === '재적인원관리'
                  ? '신규인원을 등록하고 인원들의 정보를 수정/관리해보세요'
                  : '모임 히스토리를 확인하고 관리할 수 있습니다.'}
              </div>

              {/* 선택 버튼 */}
              <button
                onClick={() => handleServiceClick(service.path)}
                className='service-select-button'
              >
                선택하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
