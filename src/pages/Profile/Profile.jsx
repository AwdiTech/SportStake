import { useState, useEffect } from "react";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, get, child, update } from "firebase/database";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage"; // Firebase storage
import BettingHistory from "../../components/BettingHistory";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [points, setPoints] = useState(500);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [isUsernameEditable, setIsUsernameEditable] = useState(true);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    document.title = "SportStake - Profile";
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsername(data.username);
        setAvatar(data.avatar);
        setPoints(data.points);
        setWins(data.wins);
        setLosses(data.losses);

        if (data.username) {
          setIsUsernameEditable(false);
        }
      }
    };
    fetchProfile();
  }, [userId]);

  const handleUsernameSave = async () => {
    if (username.trim() === "") {
      alert("Username cannot be empty.");
      return;
    }

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "users"));
    const users = snapshot.val();
    const isUnique = !Object.values(users || {}).some(
      (user) => user.username === username
    );

    if (!isUnique) {
      setIsUsernameTaken(true);
      return;
    }

    update(ref(db, `users/${userId}`), { username });
    setIsUsernameEditable(false);
    setIsUsernameTaken(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const avatarRef = storageRef(storage, `avatars/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(avatarRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading avatar:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            update(ref(db, `users/${userId}`), { avatar: downloadURL });
            setAvatar(downloadURL);
          });
        }
      );
    }
  };

  return (
    <Box
      textAlign="center"
      mt={5}
      sx={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}
    >
      {/* Avatar Section */}
      <Box mb={3}>
        <Avatar
          src={avatar || "/default-avatar.png"}
          alt="Avatar"
          sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }}
        />
        <Button variant="contained" component="label" sx={{ mt: 1 }}>
          Change Avatar
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Button>
      </Box>

      <Box mb={3} textAlign="center">
        {/* Conditionally Render */}
        {isUsernameEditable ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ marginRight: 2 }}
              placeholder="Enter your username"
              slotProps={{
                input: {
                  style: { color: "#f1ccf9" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleUsernameSave}
              size="small"
              sx={{ height: "40px" }}
            >
              Save
            </Button>
          </Box>
        ) : (
          // If the username is already set, show it on the same line as "Username:"
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              Username:
            </Typography>
            <Typography variant="h5">{username}</Typography>
          </Box>
        )}

        {isUsernameTaken && (
          <Typography color="error" mt={2}>
            This username is already taken. Please choose another.
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* User Stats */}
      <Box>
        <Typography variant="h6">Points: {points}</Typography>
        <Typography variant="h6">Wins: {wins || 0}</Typography>
        <Typography variant="h6">Losses: {losses || 0}</Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Betting History Section */}
      <BettingHistory />
    </Box>
  );
}
