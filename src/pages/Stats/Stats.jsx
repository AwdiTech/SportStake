import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import InfoIcon from "@mui/icons-material/Info";

const sampleData = {
  totalUsers: 1500,
  activeUsers: 420,
  newUsers: [25, 30, 45, 60, 70], // Weekly new users (sample)
  totalBets: 3200,
  avgBetAmount: 75.5,
  betsByResult: { won: 65, lost: 35 }, // Percentage
  totalRevenue: 240000,
  payouts: 175000,
  netProfit: 65000,
};

const COLORS = ["#4caf50", "#f44336"]; // Colors for pie chart

const Stats = () => {
  const {
    totalUsers,
    activeUsers,
    newUsers,
    totalBets,
    avgBetAmount,
    betsByResult,
    totalRevenue,
    payouts,
    netProfit,
  } = sampleData;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        SportStake Stats
      </Typography>
      <Grid container spacing={3}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Active Users
                <Tooltip
                  title="The number of users who placed bets in the last 14 days."
                  placement="top"
                  arrow
                >
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography variant="h4">{activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Bets */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Bets Placed</Typography>
              <Typography variant="h4">{totalBets}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Bet Amount */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Bet Amount</Typography>
              <Typography variant="h4">${avgBetAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* New Users Weekly */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">New Users (Last 5 Weeks)</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={newUsers.map((value, index) => ({
                      name: `Week ${index + 1}`,
                      value,
                    }))}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    {newUsers.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bets by Result */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Bets by Result</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Won", value: betsByResult.won },
                      { name: "Lost", value: betsByResult.lost },
                    ]}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">${totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Payouts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Payouts</Typography>
              <Typography variant="h4">${payouts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Net Profit */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Net Profit</Typography>
              <Typography variant="h4">${netProfit}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
