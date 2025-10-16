import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api";

/**
 * Reset password page which is to be shown to users who have been given a link
 * to reset their password via email.
 */
export default function ResetPassword() {
  // The id of the user and the backend generated token in the URL.
  const { email, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * A function that handles the submitting of a new password. Sends a
   * request to the backend to change the old user's password for the new
   * supplied one.
   * @param e The click event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/reset-password", {
        email,
        token,
        new_password: password,
      });

      toast.success("Password successfully reset!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      if (error.response?.data?.detail)
        toast.error(error.response.data.detail);
      else toast.error("Invalid or expired link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "black" }}
        textAlign={"center"}
      >
        Reset Password
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2} textAlign={"center"}>
        Enter your new password below.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? "Submitting..." : "Reset Password"}
        </Button>

        {message && (
          <Typography variant="body2" color="error" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
