import { Container, Typography, Box, Grid } from "@mui/material";
import { FaFutbol } from "react-icons/fa";

export default function Home() {
  return (
    <Container maxWidth="lg" className="home">
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
              <Typography variant="h6">Team A vs Team B</Typography>
              <Typography variant="body2">Score: 2-1</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={3} border={1} borderRadius={2} textAlign="center">
              <Typography variant="h6">Team C vs Team D</Typography>
              <Typography variant="body2">Score: 0-0</Typography>
            </Box>
          </Grid>
          {/* Add more matches as needed */}
        </Grid>
      </Box>
    </Container>
  );
}