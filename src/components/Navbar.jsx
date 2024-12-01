/* eslint-disable react/prop-types */
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
import { numberUsers } from "../helperMethods/APIDatabase";

export default function Navbar({ isAdmin }) {
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
        
        numberUsers(false);
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
          {/* Common items */}
          {!isAdmin && (
            <>
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
                  navigate(`/profile/${auth.currentUser?.uid}`);
                  handleClose();
                }}
              >
                Profile
              </MenuItem>
            </>
          )}

          {/* Admin-only items */}
          {isAdmin && (
            <>
              <MenuItem
                onClick={() => {
                  navigate(`/adminMessage`);
                  handleClose();
                }}
              >
                Help Desk
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(`/stats`);
                  handleClose();
                }}
              >
                Stats
              </MenuItem>
            </>
          )}

          {/* Logout */}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
