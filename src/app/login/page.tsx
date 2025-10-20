"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { appConfig } from "@/config/app"
import { useSnackbar } from "@/hooks/useSnackbar"
import CustomSnackbar from "@/components/common/CustomSnackbar"
import { systemColors } from "../../theme/colors"
import {
  sketchTextFieldStyle,
  sketchInputLabelProps,
  sketchButtonStyle,
  sketchPaperStyle,
  sketchBackgroundStyle,
  sketchTitleStyle,
  sketchIconButtonStyle,
  getSketchIconStyle,
} from "@/theme/sketchTheme"
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Container,
  Tabs,
  Tab
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Email, Badge } from "@mui/icons-material"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState(0) // 0 = login, 1 = register
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({})
  const router = useRouter()
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar()

  // Helper function to set field error
  const setFieldError = (fieldName: string, hasError: boolean = true) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: hasError
    }))
  }

  // Helper function to clear all field errors
  const clearFieldErrors = () => {
    setFieldErrors({})
  }

  // Helper function to focus and select text in field
  const focusAndSelectField = (fieldId: string) => {
    setTimeout(() => {
      const field = document.getElementById(fieldId) as HTMLInputElement
      if (field) {
        field.focus()
        field.select()
      }
    }, 100)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMode(newValue)
    clearFieldErrors()
    // Clear form fields when switching modes
    setUsername("")
    setPassword("")
    setEmail("")
    setName("")
    setConfirmPassword("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearFieldErrors()

    // Validation with focus
    if (!username.trim()) {
      showError("กรุณากรอกชื่อผู้ใช้")
      setFieldError('username')
      setIsLoading(false)
      focusAndSelectField('username')
      return
    }

    if (!password.trim()) {
      showError("กรุณากรอกรหัสผ่าน")
      setFieldError('password')
      setIsLoading(false)
      focusAndSelectField('password')
      return
    }

    try {
      const result = await signIn("credentials", {
        username: username,
        password,
        redirect: false
      })

      if (result?.error) {
        showError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
        setFieldError('username')
        setFieldError('password')
        focusAndSelectField('username')
      } else {
        // Get session to check user role
        const session = await getSession()
        showSuccess("เข้าสู่ระบบสำเร็จ!")
        
        setTimeout(() => {
          // Redirect to main dashboard for all users
          // Role-based access will be handled by RoleGuard
          router.push("/")
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      showError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    clearFieldErrors()

    // Validation with specific focus
    if (!name.trim()) {
      showError("กรุณากรอกชื่อ-นามสกุล")
      setFieldError('name')
      setIsLoading(false)
      focusAndSelectField('register-name')
      return
    }

    if (!username.trim()) {
      showError("กรุณากรอกชื่อผู้ใช้")
      setFieldError('username')
      setIsLoading(false)
      focusAndSelectField('register-username')
      return
    }

    if (!password.trim()) {
      showError("กรุณากรอกรหัสผ่าน")
      setFieldError('password')
      setIsLoading(false)
      focusAndSelectField('register-password')
      return
    }

    if (password.length < 6) {
      showError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      setFieldError('password')
      setIsLoading(false)
      focusAndSelectField('register-password')
      return
    }

    if (!confirmPassword.trim()) {
      showError("กรุณายืนยันรหัสผ่าน")
      setFieldError('confirmPassword')
      setIsLoading(false)
      focusAndSelectField('confirm-password')
      return
    }

    if (password !== confirmPassword) {
      showError("รหัสผ่านไม่ตรงกัน")
      setFieldError('confirmPassword')
      setIsLoading(false)
      focusAndSelectField('confirm-password')
      return
    }

    try {
      // Call register API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          name,
          role: 'user' // Default role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก"
        showError(errorMessage)
        
        // Focus based on error type
        if (errorMessage.includes('ชื่อผู้ใช้')) {
          setFieldError('username')
          focusAndSelectField('register-username')
        } else if (errorMessage.includes('อีเมล')) {
          setFieldError('email')
          focusAndSelectField('register-email')
        } else {
          setFieldError('name')
          focusAndSelectField('register-name')
        }
      } else {
        showSuccess("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ")
        // Switch to login tab after successful registration
        setTimeout(() => {
          setMode(0)
          setUsername("")
          setPassword("")
          setEmail("")
          setName("")
          setConfirmPassword("")
        }, 2000)
      }
    } catch (error) {
      showError("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        minHeight: "100vh",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Left side - Background Image */}
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/images/bg_login_1.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          overflow: "hidden",
        }}
      >
      </Box>

      {/* Right side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 1 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",
          zIndex: 1
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              maxWidth: 400,
              mx: "auto",
              position: "relative",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{
                  fontFamily: "Sarabun",
                  fontWeight: 700,
                  color: "#1565c0",
                  background: "linear-gradient(135deg, #1976d2, #1565c0)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 4px rgba(21, 101, 192, 0.1)",
                }}
              >
                {appConfig.app.name}
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  backgroundColor: "#1976d2",
                  borderRadius: 2,
                  mx: "auto",
                  mb: 2,
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                }}
              />
            </Box>

            {/* Tabs for Login/Register - Sketch Style */}
            {appConfig.enableRegistration ? (
              <Box sx={{ 
                borderBottom: "2px solid rgba(25, 118, 210, 0.1)", 
                mb: 3,
                position: "relative",
                background: "rgba(25, 118, 210, 0.02)",
                borderRadius: "8px 8px 0 0",
              }}>
                <Tabs 
                  value={mode} 
                  onChange={handleTabChange} 
                  centered
                  sx={{
                    "& .MuiTab-root": {
                      fontFamily: "Sarabun",
                      fontSize: "1rem",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#64748b",
                      margin: "0 4px",
                      transition: "all 0.3s ease",
                      borderRadius: "8px 8px 0 0",
                      "&.Mui-selected": {
                        color: "#1976d2",
                        fontWeight: 700,
                      }
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1976d2",
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    }
                  }}
                >
                  <Tab label="เข้าสู่ระบบ" />
                  <Tab label="สมัครสมาชิก" />
                </Tabs>
              </Box>
            ) : (
              <Box textAlign="center" mb={3}>
                <Typography
                  variant="body1"
                  sx={{ 
                    fontFamily: "Sarabun",
                    color: "#475569",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  เข้าสู่ระบบ
                </Typography>
              </Box>
            )}

            {/* Login Form */}
            {mode === 0 && (
              <Box component="form" onSubmit={handleLogin} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (fieldErrors.username) {
                      setFieldError('username', false)
                    }
                  }}
                  error={fieldErrors.username}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{
                          color: fieldErrors.username ? systemColors.error.main : "#64748b",
                          transition: "color 0.3s ease",
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldError('password', false)
                    }
                  }}
                  error={fieldErrors.password}
                  size="medium"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: "#64748b",
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(25, 118, 210, 0.04)',
                              color: "#1976d2",
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontFamily: 'Sarabun',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease',
                    mb: 2,
                    mt: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </Box>
            )}

            {/* Register Form */}
            {appConfig.enableRegistration && mode === 1 && (
              <Box component="form" onSubmit={handleRegister} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="register-name"
                  label="ชื่อ-นามสกุล"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (fieldErrors.name) {
                      setFieldError('name', false)
                    }
                  }}
                  error={fieldErrors.name}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{
                          color: fieldErrors.name ? systemColors.error.main : "#64748b",
                          transition: "color 0.3s ease",
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="register-username"
                  label="ชื่อผู้ใช้"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (fieldErrors.username) {
                      setFieldError('username', false)
                    }
                  }}
                  error={fieldErrors.username}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{
                          color: fieldErrors.username ? systemColors.error.main : "#64748b",
                          transition: "color 0.3s ease",
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="register-email"
                  label="อีเมล (ไม่บังคับ)"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  size="medium"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) {
                      setFieldError('email', false)
                    }
                  }}
                  error={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{
                          color: fieldErrors.email ? systemColors.error.main : "#64748b",
                          transition: "color 0.3s ease",
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="รหัสผ่าน"
                  size="medium"
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldError('password', false)
                    }
                  }}
                  error={fieldErrors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: "#64748b",
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(25, 118, 210, 0.04)',
                              color: "#1976d2",
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
                  size="medium"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (fieldErrors.confirmPassword) {
                      setFieldError('confirmPassword', false)
                    }
                  }}
                  error={fieldErrors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{
                            color: "#64748b",
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(25, 118, 210, 0.04)',
                              color: "#1976d2",
                            },
                          }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Sarabun',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: "#64748b",
                      '&.Mui-focused': {
                        color: "#1976d2",
                      },
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        px: 0.5,
                        borderRadius: '4px',
                        transform: 'translate(14px, -9px) scale(1)',
                      },
                    },
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'Sarabun',
                      background: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      '& fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.2)",
                        borderWidth: "2px",
                      },
                      '&:hover fieldset': {
                        borderColor: "rgba(25, 118, 210, 0.4)",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontFamily: 'Sarabun',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease',
                    mb: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388E3C 0%, #4CAF50 100%)',
                      boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                </Button>
              </Box>
            )}

              <Box textAlign="center">
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Sarabun",
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    background: "rgba(25, 118, 210, 0.02)",
                    py: 0.5,
                    px: 1.5,
                    borderRadius: "6px",
                    border: "1px solid rgba(25, 118, 210, 0.1)"
                  }}
                >
                  © 2025 Police Position Management System
                </Typography>
              </Box>

          
          </Paper>
        </Container>
      </Box>

      {/* Custom Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={hideSnackbar}
      />
    </Box>
  )
}