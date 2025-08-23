import { AccessTime, Dashboard, EventNote, Group } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
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
      id: 'attendance-dashboard',
      title: '출석현황 대시보드',
      description: '출석 통계 및 현황을 확인합니다',
      icon: <Dashboard />,
      path: '/attendance-dashboard',
      color: '#4ecdc4',
    },
    {
      id: 'attendance-input',
      title: '출석 입력',
      description: '출석 데이터를 입력합니다',
      icon: <EventNote />,
      path: '/attendance-input',
      color: '#5dade2',
    },
    {
      id: 'member-list',
      title: '회원 명단',
      description: '회원 목록을 확인합니다',
      icon: <Group />,
      path: '/member-list',
      color: '#f39c12',
    },
    {
      id: 'prayer-topic',
      title: '기도제목',
      description: '기도제목을 관리합니다',
      icon: <AccessTime />,
      path: '/prayer-topic',
      color: '#e74c3c',
    },
    {
      id: 'member-registration',
      title: '회원 등록',
      description: '새로운 회원을 등록합니다',
      icon: <Group />,
      path: '/member-registration',
      color: '#9b59b6',
    },
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        sx={{ textAlign: 'center', mb: 4 }}
      >
        서비스 선택
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {services.map(service => (
          <Card
            key={service.id}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleServiceClick(service.path)}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: service.color,
                    color: 'white',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {service.icon}
                </Box>
              </Box>

              <CardContent sx={{ textAlign: 'center', pt: 0 }}>
                <Typography variant='h6' component='h2' gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {service.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ServiceSelection;
