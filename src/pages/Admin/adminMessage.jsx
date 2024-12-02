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
  });

  useEffect(() => {
    document.title = "SportStake - Helpdesk";
  }, []);

  useEffect(() => {
    var reports;
    async function fetchData() {
      reports = await getReports();
      setUserRequest({
        reports: reports,
        open: userRequest.open,
        reportId: userRequest.reportId,
      });
    }
    fetchData();

    console.log(userRequest);
  }, [userRequest]);
  const { open, reports, reportId } = userRequest;
  const handleClose = () => {
    update(ref(db, `helpRequests/${reportId}`), { status: "closed" });

    async function fetchData() {
      var reports = await getReports();
      setUserRequest({
        reports: reports,
        open: false,
        reportId: "",
      });
    }
    fetchData();
  };
  const handleNo = () => {
    setUserRequest({
      reports: userRequest.reports,
      open: false,
      reportId: userRequest.reportId,
    });
  };
  function toDetails(Id) {
    setUserRequest({
      reports: userRequest.reports,
      open: true,
      reportId: Id,
    });
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
                  sx={{ color: "white", fontSize: 20, fontWeight: 650 }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((data, index) => (
                <TableRow key={index} onClick={() => toDetails(data.id)}>
                  <TableCell
                    sx={{ color: "white", fontSize: 18, fontWeight: 400 }}
                  >
                    {" "}
                    {data.timestamp}
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
            Has {reportId} been Finished
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
