import { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Collapse, IconButton, Typography, Pagination } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ref, child, get } from "firebase/database";
import { db, auth } from "../FirebaseConfig";

const sampleBettingHistory = [
  {
    betId: "1",
    matchTeams: "Team A vs Team B",
    matchDate: "2024-10-01",
    betType: "Match Winner",
    betAmount: 100,
    betOdds: 2.5,
    betPrediction: "Team A wins",
    result: "Won",
    winnings: 250,
    finalScore: "2-1",
  },
  {
    betId: "2",
    matchTeams: "Team C vs Team D",
    matchDate: "2024-10-02",
    betType: "Total Goals",
    betAmount: 50,
    betOdds: 1.8,
    betPrediction: "Over 2.5 goals",
    result: "Lost",
    winnings: 0,
    finalScore: "1-1",
  },
  {
    betId: "3",
    matchTeams: "Team E vs Team F",
    matchDate: "2024-10-03",
    betType: "First Goalscorer",
    betAmount: 30,
    betOdds: 3.0,
    betPrediction: "Player X scores first",
    result: "Lost",
    winnings: 0,
    finalScore: "0-2",
  },
  // Add more sample data as needed
];

const BettingHistory = () => {
  const [expandedBet, setExpandedBet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bettingHistory, setBettingHistory] = useState([]);
  const itemsPerPage = 2;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //const currentItems = sampleBettingHistory.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = bettingHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch the user's betting history from Firebase Realtime Database
  useEffect(() => {
    const fetchBettingHistory = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.log("No user is logged in");
          return;
        }

        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${userId}/bets/`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the object to an array to be able to map it
          const formattedData = Object.keys(data).map((betId) => ({
            betId,
            ...data[betId],
          }));
          setBettingHistory(formattedData);
        } else {
          console.log("No betting history found");
        }
      } catch (error) {
        console.error("Error fetching betting history:", error);
      }
    };

    fetchBettingHistory();
  }, []);

  const handleExpandClick = (betId) => {
    setExpandedBet(expandedBet === betId ? null : betId);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom textAlign="left">
        Betting History
      </Typography>
      <List>
        {currentItems.map((bet) => (
          <Box key={bet.betId} mb={2}>
            <ListItem button="false" onClick={() => handleExpandClick(bet.betId)}>
              <ListItemText
                primary={`${bet.matchTeams}`}
                secondary={`Bet Type: ${bet.betType} | Date: ${bet.matchDate} | Result: ${bet.result}`}
              />
              <IconButton onClick={() => handleExpandClick(bet.betId)}>
                {expandedBet === bet.betId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </ListItem>

            <Collapse in={expandedBet === bet.betId} timeout="auto" unmountOnExit>
              <Box p={2}>
                <Typography variant="body2">Bet Amount: {bet.betAmount}</Typography>
                <Typography variant="body2">Odds: {bet.betOdds}</Typography>
                <Typography variant="body2">Prediction: {bet.betPrediction}</Typography>
                <Typography variant="body2">Final Score: {bet.finalScore}</Typography>
                {bet.result === "Won" && (
                  <Typography variant="body2" color="success.main">
                    Winnings: {bet.winnings}
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(sampleBettingHistory.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default BettingHistory;
