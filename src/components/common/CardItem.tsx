import React from 'react';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import { cardColors, createShadow } from '../../theme/colors';

interface CardItemProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorScheme: keyof typeof cardColors;
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  subtitle,
  icon,
  colorScheme,
  onClick,
}) => {
  const colors = cardColors[colorScheme];

  return (
    <Card
      sx={{
        position: 'relative',
        background: colors.background,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: createShadow(colors.main, 0.15),
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: createShadow(colors.main, 0.25),
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        {/* Header with Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: colors.main,
              fontSize: '1.5rem',
            }}
          >
            {icon}
          </Box>
          
          <IconButton
            size="small"
            sx={{
              color: colors.text,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Box component="span" sx={{ fontSize: '1rem' }}>⋯</Box>
          </IconButton>
        </Box>

        {/* Content */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text,
              mb: subtitle ? 0.5 : 0,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: colors.text,
                opacity: 0.7,
                fontSize: '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.main}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -10,
            left: -10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.main}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CardItem;