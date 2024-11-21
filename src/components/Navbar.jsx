import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig";

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown positioning
  const open = Boolean(anchorEl);

  // Handle dropdown open
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle dropdown close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
    handleClose(); // Close the dropdown after logout
  };

  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left-aligned SportStake text */}
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: "left" }}>
          SportStake
        </Typography>

        {/* Right-aligned IconButton */}
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle fontSize="large" />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate("/home");
              handleClose();
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/matchList`);
              handleClose();
            }}
          >
            Matches
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/adminMessage`);
              handleClose();
            }}
          >
            Admin
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/profile/${auth.currentUser?.uid}`);
              handleClose();
            }}
          >
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate(`/leaderboard`);
              handleClose();
            }}
          >
            Leaderboard
          </MenuItem>
          
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
