'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface LogoutConfirmationProps {
  open: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function LogoutConfirmation({
  open,
  onConfirm,
  onCancel,
  isLoading = false,
  title = 'ยืนยันการออกจากระบบ',
  message = 'คุณต้องการออกจากระบบใช่หรือไม่? การออกจากระบบจะล้างข้อมูลทั้งหมดและนำคุณกลับไปยังหน้าเข้าสู่ระบบ'
}: LogoutConfirmationProps) {
  
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Logout confirmation error:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '8px',
          minWidth: '320px',
        }
      }}
    >
      <DialogTitle 
        id="logout-dialog-title"
        sx={{
          fontFamily: 'Sarabun',
          fontWeight: 600,
          fontSize: '1.2rem',
          color: '#1e293b',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText 
          id="logout-dialog-description"
          sx={{
            fontFamily: 'Sarabun',
            fontSize: '0.95rem',
            color: '#64748b',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onCancel}
          disabled={isLoading}
          sx={{
            fontFamily: 'Sarabun',
            textTransform: 'none',
            color: '#64748b',
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
            '&:disabled': {
              color: '#94a3b8',
            }
          }}
        >
          ยกเลิก
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{
            fontFamily: 'Sarabun',
            textTransform: 'none',
            backgroundColor: '#dc2626',
            minWidth: '120px',
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
            '&:disabled': {
              backgroundColor: '#94a3b8',
            }
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
              กำลังออกจากระบบ...
            </>
          ) : (
            'ออกจากระบบ'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}