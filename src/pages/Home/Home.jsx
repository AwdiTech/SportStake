import { Container, Typography, Box, Grid } from "@mui/material";
import { FaFutbol } from "react-icons/fa";
import { useEffect } from "react";

export default function Home() {
  // Check and complete wagers if the match is over
  useEffect(() => {
    document.title = "SportStake - Home";
  }, []);

  return (
    <Container maxWidth="lg" className="home">
      {/* <APITester /> */}
      {/* Welcome Section */}
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to SportStake
        </Typography>
        <Typography variant="body1" gutterBottom>
          Engage in exciting football simulations, track your bets, and climb
          the leaderboards.
        </Typography>
      </Box>

      {/* Recent Matches Section (You can later map through dynamic data here) */}
      <Box my={5}>
        <Typography variant="h5" gutterBottom>
          Recent Matches
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={3} border={1} borderRadius={2} textAlign="center">
              <Typography variant="h6">Liverpool vs Man City</Typography>
              <Typography variant="body2">Score: 2-0</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={3} border={1} borderRadius={2} textAlign="center">
              <Typography variant="h6">Chelsea vs Aston Villa</Typography>
              <Typography variant="body2">Score: 3-0</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={3} border={1} borderRadius={2} textAlign="center">
              <Typography variant="h6">Tottenham vs Fulham</Typography>
              <Typography variant="body2">Score: 1-1</Typography>
            </Box>
          </Grid>
          {/* Add more matches as needed */}
        </Grid>
      </Box>
    </Container>
  );
}
