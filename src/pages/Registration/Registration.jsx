import { useState, useEffect } from "react";
import "./Registration.scss";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser } from "../../helperMethods/APIDatabase";
import { auth } from "../../FirebaseConfig";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FaFutbol } from "react-icons/fa"; // React Icons for soccer theme
import { createUser } from "../../helperMethods/APIDatabase";

export default function Registration() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SportStake - Registration";
  }, []);

  // Form fields...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle form submission and register a new user
  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Next actions here..
        createUser(user.uid);

        console.log(user);
        //Example: go to profile page after registration - `navigate("/profile")`
        navigate(`/profile/${user.uid}`);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage(
              "This email is already in use. Please use a different email."
            );
            break;
          case "auth/invalid-email":
            setErrorMessage("The email address is not valid.");
            break;
          case "auth/weak-password":
            setErrorMessage("Password should be at least 6 characters.");
            break;
          default:
            setErrorMessage("Failed to register. Please try again.");
        }
      });
  };

  // Registration Page JSX here...
  return (
    <Container maxWidth="sm" className="registration">
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
          SportStake Registration
        </Typography>
      </Box>

      <form onSubmit={onSubmit}>
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
        {/* Display error message */}
        {errorMessage && (
          <Box my={2}>
            <Alert severity="error">{errorMessage}</Alert>{" "}
            {/* Material-UI Alert for errors */}
          </Box>
        )}
        <Box my={2} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ backgroundColor: "green", padding: "10px 20px" }}
          >
            Register
          </Button>
        </Box>
      </form>

      <Box textAlign="center">
        <Typography variant="body1" gutterBottom>
          Already have an account?{" "}
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate("/login")}
          >
            Log in here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}
