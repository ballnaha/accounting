'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper,
  Divider
} from '@mui/material';
import { 
  LockOutlined, 
  ExitToApp, 
  Refresh,
  AccountCircle 
} from '@mui/icons-material';
import { systemColors } from '@/theme/colors';

export default function NoAccessPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleRetry = () => {
    router.refresh();
  };

  const userRole = (session?.user as any)?.role || 'ไม่ระบุ';
  const userName = session?.user?.name || 'ผู้ใช้';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            backgroundColor: 'white'
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: systemColors.error.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <LockOutlined
              sx={{
                fontSize: 40,
                color: systemColors.error.main
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: systemColors.neutral[900],
              mb: 2,
              fontFamily: 'Sarabun'
            }}
          >
            ไม่มีสิทธิ์เข้าใช้งาน
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: systemColors.neutral[600],
              mb: 4,
              lineHeight: 1.6,
              fontFamily: 'Sarabun'
            }}
          >
            คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
            <br />
            หรือเข้าสู่ระบบด้วยบัญชีที่มีสิทธิ์เหมาะสม
          </Typography>

          {/* User Info */}
          {session && (
            <Box
              sx={{
                p: 3,
                borderRadius: 1,
                backgroundColor: systemColors.neutral[50],
                border: '1px solid',
                borderColor: systemColors.neutral[200],
                mb: 4
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <AccountCircle sx={{ color: systemColors.neutral[500] }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: systemColors.neutral[700],
                    fontFamily: 'Sarabun'
                  }}
                >
                  ข้อมูลผู้ใช้ปัจจุบัน
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: systemColors.neutral[800],
                  fontFamily: 'Sarabun',
                  fontWeight: 500
                }}
              >
                ชื่อ: {userName}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: systemColors.neutral[600],
                  fontFamily: 'Sarabun'
                }}
              >
                สิทธิ์: {userRole}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center'
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRetry}
              sx={{
                borderColor: systemColors.neutral[300],
                color: systemColors.neutral[700],
                fontFamily: 'Sarabun',
                textTransform: 'none',
                fontWeight: 500,
                py: 1.2,
                px: 3,
                '&:hover': {
                  borderColor: systemColors.primary.main,
                  color: systemColors.primary.main,
                  backgroundColor: systemColors.primary.bg
                }
              }}
            >
              ลองใหม่
            </Button>
            
            <Button
              variant="contained"
              startIcon={<ExitToApp />}
              onClick={handleSignOut}
              sx={{
                backgroundColor: systemColors.primary.main,
                color: 'white',
                fontFamily: 'Sarabun',
                textTransform: 'none',
                fontWeight: 500,
                py: 1.2,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: systemColors.primary.dark,
                  boxShadow: 'none'
                }
              }}
            >
              ออกจากระบบ
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              color: systemColors.neutral[500],
              fontFamily: 'Sarabun'
            }}
          >
            หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}