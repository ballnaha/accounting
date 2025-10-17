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
        ...sketchBackgroundStyle,
        display: "flex",
        position: "relative",
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
          backgroundImage: "url('/images/bg_login.webp')",
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
              ...sketchPaperStyle,
              maxWidth: 400,
              mx: "auto",
              position: "relative"
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={sketchTitleStyle}
              >
                {appConfig.app.name}
              </Typography>
            </Box>

            {/* Tabs for Login/Register - Sketch Style */}
            {appConfig.enableRegistration ? (
              <Box sx={{ 
                borderBottom: "2px solid #333", 
                mb: 3,
                position: "relative"
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
                      color: "#666",
                      margin: "0 4px",
                      transition: "all 0.3s ease",
                      
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: systemColors.primary.main,
                      height: 3
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
                  variant="body2"
                  sx={{ 
                    fontFamily: "Sarabun",
                    color: "#666",
                    fontSize: "1.2rem",
                    fontWeight: 600
                  }}
                >
                  Accounting System
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
                        <Person sx={getSketchIconStyle(fieldErrors.username, systemColors.error.main)} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={sketchTextFieldStyle}
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
                          sx={sketchIconButtonStyle}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={sketchTextFieldStyle}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    ...sketchButtonStyle('#FFC107'),
                    mb: 2,
                    mt: 1
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
                        <Badge sx={getSketchIconStyle(fieldErrors.name, systemColors.error.main)} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={sketchTextFieldStyle}
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
                        <Person sx={getSketchIconStyle(fieldErrors.username, systemColors.error.main)} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={sketchTextFieldStyle}
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
                        <Email sx={getSketchIconStyle(fieldErrors.email, systemColors.error.main)} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={sketchTextFieldStyle}
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
                          sx={sketchIconButtonStyle}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={{ ...sketchTextFieldStyle, mb: 2 }}
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
                          sx={sketchIconButtonStyle}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={sketchInputLabelProps}
                  sx={{ ...sketchTextFieldStyle, mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    ...sketchButtonStyle('#4CAF50'),
                    mb: 3
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
                    color: "#999",
                    fontSize: "0.85rem",
                    fontWeight: 500
                  }}
                >
                  © 2025 Accounting System
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