import { useState } from "react";
import { Box, Modal, TextField, Typography, Fab, Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { push, ref } from "firebase/database";
import { db, auth } from "../FirebaseConfig";

const HelpButton = () => {
  const [open, setOpen] = useState(false);
  const [helpRequest, setHelpRequest] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setIsSubmitted(false); // Reset submission state when modal opens
  };

  const handleClose = () => {
    setOpen(false);
    setHelpRequest(""); // Clear the input field
  };

  const handleSubmit = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !helpRequest.trim()) return;

    // Save help request to Firebase
    const helpRequestData = {
      userId,
      content: helpRequest,
      timestamp: new Date().toISOString(),
      status: "open",
    };

    try {
      await push(ref(db, "helpRequests"), helpRequestData);
      setIsSubmitted(true); // Show the confirmation state
      setHelpRequest(""); // Clear the input field
    } catch (error) {
      console.error("Error submitting help request:", error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="help"
          onClick={handleOpen}
          sx={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <HelpOutlineIcon />
        </Fab>
      </Box>

      {/* Help Request Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          {!isSubmitted ? (
            <>
              <Typography variant="h6" gutterBottom>
                Submit a Help Request
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe your issue"
                value={helpRequest}
                onChange={(e) => setHelpRequest(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={!helpRequest.trim()}
                sx={{
                  mt: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Submit Request
              </Button>
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: 100, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Request Submitted!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your help request has been successfully sent.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default HelpButton;
