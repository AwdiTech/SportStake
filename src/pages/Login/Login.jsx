import { useState } from "react";
import "./Login.scss";
import { auth } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FaFutbol } from "react-icons/fa";
import { numberUsers } from "../../helperMethods/APIDatabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        numberUsers(true);
        navigate("/home");
        console.log(user);
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          setErrorMessage(
            "Failed to sign in. Please check your credentials and try again."
          );
        }
      });
  };

  // Login Page JSX here...
  return (
    <Container maxWidth="sm" className="login">
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
          SportStake Login
        </Typography>
      </Box>

      <form onSubmit={onLogin}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          slotProps={{
            input: {
              style: { color: "#f1ccf9" },
            },
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          slotProps={{
            input: {
              style: { color: "#f1ccf9" },
            },
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && (
          <Box my={2}>
            <Alert severity="error">{errorMessage}</Alert>{" "}
            {/* Display error message */}
          </Box>
        )}
        <Box my={2} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ backgroundColor: "green", padding: "10px 20px" }}
          >
            Login
          </Button>
        </Box>
      </form>

      <Box textAlign="center">
        <Typography variant="body1" gutterBottom>
          Don&apos;t have an account?{" "}
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate("/register")}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}