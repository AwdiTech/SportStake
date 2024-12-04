import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { ref, child, get, update } from "firebase/database";
import { db } from "../../FirebaseConfig";
import "./AdminConsole.scss";

const AdminConsole = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPoints, setNewPoints] = useState("");

  // Fetch users from the database
  const fetchUsers = async () => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "users"));
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.keys(usersData)
          .map((userId) => ({
            id: userId,
            username: usersData[userId].username || "Unknown",
            points: usersData[userId].points,
            isAdmin: usersData[userId].isAdmin || false,
          }))
          .filter((user) => !user.isAdmin) // Filter out admin users
          .sort((a, b) => a.username.localeCompare(b.username));

        setUsers(usersList);
      } else {
        console.log("No users found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    document.title = "SportStake - Admin Console";
    fetchUsers();
  }, []);

  /**
   * This function checks if a user is selected and if a valid point value is entered.
   * If both conditions are met, it updates the user's points in the database.
   * After updating, it alerts the user, resets the selected user and points input,
   * and re-fetches the list of users.
   *
   * @async
   * @function handleUpdatePoints
   * @returns {Promise<void>} A promise that resolves when the points are updated.
   * @throws Will alert and log an error if the update fails.
   */
  const handleUpdatePoints = async () => {
    if (!selectedUser || newPoints === "") {
      alert("Please select a user and enter a valid point value.");
      return;
    }

    const userRef = ref(db, `users/${selectedUser.id}`);
    try {
      await update(userRef, { points: Number(newPoints) });
      alert(`Points updated for ${selectedUser.username}!`);
      setSelectedUser(null);
      setNewPoints("");
      fetchUsers(); // Re-fetch users after updating points
    } catch (error) {
      console.error("Error updating user points:", error);
      alert("Failed to update points. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" className="admin-console">
      <Typography variant="h3" gutterBottom textAlign="center">
        Admin Console
      </Typography>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Select a User
        </Typography>
        <Select
          fullWidth
          value={selectedUser?.id || ""}
          onChange={(e) => {
            const user = users.find((u) => u.id === e.target.value);
            setSelectedUser(user);
            setNewPoints(user?.points || "");
          }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a user
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.username} ({user.points} points)
            </MenuItem>
          ))}
        </Select>
      </Box>

      {selectedUser && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Adjust Points for {selectedUser.username}
          </Typography>
          <TextField
            label="New Points"
            fullWidth
            type="number"
            value={newPoints}
            onChange={(e) => setNewPoints(e.target.value)}
            slotProps={{ input: { min: 0 } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleUpdatePoints}
          >
            Update Points
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AdminConsole;
