import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import api from "@/api";
import { toast } from "react-toastify";

/**
 * Forgot password page which is to be shown to users who may have forgotten
 * their password.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * A function to handle the submitting for a password reset. Sends
   * a request to the backend containing the user's email for a password
   * reset link to be sent.
   * @param e The click event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("auth/forgot", {
        email: email
      })
      toast.success("A password reset link has been emailed.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1} textAlign={"center"}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        {message && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
