'use client';

import { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertColor,
  Slide,
  SlideProps,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { sketchSnackbarStyle } from '@/theme/sketchTheme';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
  onClose: () => void;
  action?: React.ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

// Slide transition component
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export default function CustomSnackbar({
  open,
  message,
  severity,
  autoHideDuration = 6000,
  onClose,
  action,
  anchorOrigin = { vertical: 'top', horizontal: 'center' },
}: CustomSnackbarProps) {
  const [isOpen, setIsOpen] = useState(open);
  const sketchStyle = sketchSnackbarStyle(severity);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    onClose();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: '10px',
          boxShadow: '5px 5px 0px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="outlined"
        sx={{
          width: '100%',
          minWidth: '380px',
          borderRadius: sketchStyle.borderRadius,
          fontFamily: 'Sarabun',
          fontSize: '0.95rem',
          fontWeight: 600,
          border: sketchStyle.border,
          background: sketchStyle.backgroundColor,
          color: sketchStyle.color,
          boxShadow: sketchStyle.boxShadow,
          padding: '14px 18px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
          },
          '& .MuiAlert-icon': {
            fontSize: '22px',
            marginRight: '12px',
            color: sketchStyle.iconColor,
          },
          '& .MuiAlert-message': {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          },
          '& .MuiAlert-action': {
            padding: 0,
            marginRight: 0,
            marginLeft: '12px',
          },
        }}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              onClick={handleClose}
              sx={{
                padding: '6px',
                color: 'inherit',
                opacity: 0.7,
                transition: 'all 0.2s ease',
                borderRadius: '6px',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          )
        }
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
}