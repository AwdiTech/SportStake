import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { db } from "../../FirebaseConfig";
import { ref, update } from "firebase/database";
import "./adminMessage.scss";
import { getReports } from "../../helperMethods/APIDatabase";

export default function AdminMessage() {
  const [userRequest, setUserRequest] = useState({
    open: false,
    reports: [],
    reportId: "",
    username: "",
  });

  useEffect(() => {
    document.title = "SportStake - Helpdesk";
  }, []);

  useEffect(() => {
    async function fetchData() {
      const reports = await getReports();
      setUserRequest((prev) => ({
        ...prev,
        reports: reports,
      }));
    }
    fetchData();
  }, []);

  const { open, reports, reportId, username } = userRequest;

  const handleClose = () => {
    update(ref(db, `helpRequests/${reportId}`), { status: "closed" });

    async function fetchData() {
      const reports = await getReports();
      setUserRequest({
        reports: reports,
        open: false,
        reportId: "",
        username: "",
      });
    }
    fetchData();
  };

  const handleNo = () => {
    setUserRequest((prev) => ({
      ...prev,
      open: false,
    }));
  };

  function toDetails(Id, username) {
    setUserRequest((prev) => ({
      ...prev,
      open: true,
      reportId: Id,
      username: username,
    }));
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <Container>
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
          SportStake
        </Typography>
      </Box>
      <Typography variant="h5" gutterBottom>
        Help Desk
      </Typography>
      <Box my={5} className="matchList">
        <TableContainer style={{ maxHeight: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: 650,
                    width: "20%",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontSize: 20, fontWeight: 650 }}
                >
                  Content
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontSize: 20, fontWeight: 650 }}
                >
                  UserID
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontSize: 20, fontWeight: 650 }}
                >
                  Username
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((data, index) => (
                <TableRow
                  key={index}
                  onClick={() => toDetails(data.id, data.username)}
                >
                  <TableCell
                    sx={{ color: "white", fontSize: 18, fontWeight: 400 }}
                  >
                    {formatDate(data.timestamp)}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: 18, fontWeight: 400 }}
                  >
                    {data.content}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: 18, fontWeight: 400 }}
                  >
                    {data.userId}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontSize: 18, fontWeight: 400 }}
                  >
                    {data.username}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Help Report Finished"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Has {username}&apos;s ticket been finished?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>No</Button>
          <Button onClick={handleClose} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
