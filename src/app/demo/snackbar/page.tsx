'use client';

import { useState } from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { useSnackbar } from '@/hooks/useSnackbar';
import CustomSnackbar from '@/components/common/CustomSnackbar';

export default function SnackbarDemo() {
  const { snackbar, showSuccess, showError, showWarning, showInfo, hideSnackbar } = useSnackbar();

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ fontFamily: 'Sarabun', fontWeight: 600, mb: 4 }}
      >
        Snackbar Demo
      </Typography>

      <Paper sx={{ p: 3, borderRadius: '12px' }}>
        <Typography 
          variant="h6" 
          sx={{ fontFamily: 'Sarabun', fontWeight: 500, mb: 3 }}
        >
          ทดสอบ Snackbar แต่ละประเภท
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
          <Button
            variant="contained"
            onClick={() => showSuccess('Successful Toast Sample')}
            sx={{
              backgroundColor: '#10b981',
              fontFamily: 'Sarabun',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#059669',
              }
            }}
          >
            แสดง Success
          </Button>

          <Button
            variant="contained"
            onClick={() => showWarning('Warning Toast Sample')}
            sx={{
              backgroundColor: '#f59e0b',
              fontFamily: 'Sarabun',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#d97706',
              }
            }}
          >
            แสดง Warning
          </Button>

          <Button
            variant="contained"
            onClick={() => showError('Error Toast Sample')}
            sx={{
              backgroundColor: '#ef4444',
              fontFamily: 'Sarabun',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#dc2626',
              }
            }}
          >
            แสดง Error
          </Button>

          <Button
            variant="contained"
            onClick={() => showInfo('Info Toast Sample')}
            sx={{
              backgroundColor: '#3b82f6',
              fontFamily: 'Sarabun',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2563eb',
              }
            }}
          >
            แสดง Info
          </Button>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ fontFamily: 'Sarabun', color: '#64748b' }}
          >
            คลิกปุ่มเพื่อทดสอบ Snackbar ในแต่ละรูปแบบ
          </Typography>
        </Box>
      </Paper>

      {/* Custom Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={hideSnackbar}
      />
    </Box>
  );
}