import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  CircularProgress,
} from "@mui/material";

import { AuthService } from "@/services/auth-service";

import { authenticationState, userState } from "@/domain/state";
import { MFAMethod } from "@/domain/type/mfaMethod";
import { Role } from "@/domain/enum/role";
import { Constants } from "@/domain/constants";

const authService = new AuthService();

export default function MFA() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: "signup" | "login" }>();
  
  const [mfaMethod, setMfaMethod] = useState<MFAMethod>();
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(type === "signup");

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && showCodeInput) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showCodeInput]);

  // Handle invalid type parameter
  useEffect(() => {
    if (type !== "login" && type !== "signup") {
      navigate("/");
      return;
    }
  }, [type, navigate]);

  const handleMfaMethodSelect = async () => {
    if (!mfaMethod) return;
    
    setIsLoading(true);
    try {
      const message = await authService.selectMFAMethod(mfaMethod);
      setShowCodeInput(true);
      setCountdown(30);
      // Display the actual message from the API (e.g., "phone number sent to 04...")
      toast.success(message || `Code sent via ${mfaMethod.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    if (!type) {
      toast.error("Invalid MFA type");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (type === "signup") {
        response = await authService.verifySignup(code);
      } else {
        response = await authService.loginMFA(code);
      }
      
      authenticationState.setState({ authenticated: true });
      userState.setState({
        role: response.role,
        userName: response.username,
        id: response.id
      });
      
      toast.success("Authentication successful!");

      if (response.role === Role.ADMIN || response.role === Role.MANAGER) {
        navigate(Constants.ADMIN_DASHBOARD_ROUTE);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    setIsLoading(true);
    try {
      let message;
      if (type === "signup") {
        message = await authService.resendMFA("email");
      } else {
        if (!mfaMethod) return;
        message = await authService.resendMFA(mfaMethod);
      }
      
      setCountdown(30);
      // Display the actual message from the API (e.g., "phone number sent to 04...")
      toast.success(message || "Code resent successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {type === "signup" ? "Verify Your Account" : "Two-Factor Authentication"}
        </Typography>

        {type === "login" && !showCodeInput && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleMfaMethodSelect(); }} sx={{ width: "100%" }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>MFA Method</InputLabel>
              
              <Select
                value={mfaMethod}
                onChange={(e) => setMfaMethod(e.target.value as MFAMethod)}
                label="MFA Method"
              >
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!mfaMethod || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Send Code"}
            </Button>
          </Box>
        )}

        {showCodeInput && (
          <Box component="form" onSubmit={handleCodeSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Verification Code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" } }}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Verify Code"}
            </Button>

            {countdown > 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Resend code in {countdown} seconds
              </Typography>
            ) : (
              <Box textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  sx={{ textDecoration: "none" }}
                >
                  Resend Code
                </Link>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
