import React from 'react';
import { Grid, Box } from '@mui/material';
import CardItem from './CardItem';
import {
  DesignServices,
  Business,
  CameraAlt,
  VideoCall,
  GitHub,
  Movie,
  AccountBalance,
  ManageAccounts,
} from '@mui/icons-material';

// ข้อมูลการ์ดตัวอย่าง
const cardData = [
  {
    id: 'webDesign',
    title: 'Web Design',
    subtitle: 'UI/UX Design & Development',
    icon: <DesignServices />,
    colorScheme: 'webDesign' as const,
  },
  {
    id: 'management',
    title: 'Management & Communication',
    subtitle: 'Project Management Tools',
    icon: <ManageAccounts />,
    colorScheme: 'management' as const,
  },
  {
    id: 'business',
    title: 'Business Analytic',
    subtitle: 'Data Analysis & Reports',
    icon: <Business />,
    colorScheme: 'business' as const,
  },
  {
    id: 'photography',
    title: 'Photography and Video',
    subtitle: 'Creative Media Solutions',
    icon: <CameraAlt />,
    colorScheme: 'photography' as const,
  },
  {
    id: 'video',
    title: 'Video Creating',
    subtitle: 'Content Creation & Editing',
    icon: <VideoCall />,
    colorScheme: 'video' as const,
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: 'Version Control & Collaboration',
    icon: <GitHub />,
    colorScheme: 'github' as const,
  },
  {
    id: 'filming',
    title: 'Filming & Operating',
    subtitle: 'Video Production Services',
    icon: <Movie />,
    colorScheme: 'filming' as const,
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping & Accountancy',
    subtitle: 'Financial Management',
    icon: <AccountBalance />,
    colorScheme: 'bookkeeping' as const,
  },
];

interface CardGridProps {
  onCardClick?: (cardId: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ onCardClick }) => {
  return (
    <Box sx={{ px: 0, py: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {cardData.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CardItem
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              colorScheme={card.colorScheme}
              onClick={() => onCardClick?.(card.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardGrid;