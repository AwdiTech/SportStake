import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
  Legend,
} from "recharts";

import InfoIcon from "@mui/icons-material/Info";
//import { getStats } from "../../helperMethods/APIDatabase";

const COLORS = ["#4caf50", "#f44336"]; // Colors for pie chart
const USERCOLORS = ["#ffeb3b", "#2196f3", "#9c27b0", "#ff9800", "#00bcd4"];

// Function to generate week labels for the past 5 weeks
const generateWeekLabels = () => {
  const labels = [];
  const currentDate = new Date();

  // Get to the current Monday of this week
  const currentDay = currentDate.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Sunday case handled (-6 to get to Monday)
  const currentMonday = new Date(currentDate);
  currentMonday.setDate(currentDate.getDate() + mondayOffset);

  for (let i = 0; i < 5; i++) {
    const startOfWeek = new Date(currentMonday);
    startOfWeek.setDate(currentMonday.getDate() - i * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const label = `${startOfWeek.toLocaleString("default", {
      month: "short",
    })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleString("default", {
      month: "short",
    })} ${endOfWeek.getDate()}`;

    labels.unshift(label);
  }

  return labels;
};

const Stats = () => {
  // Sample Data based on provided information
  const [stats, setStats] = useState({
    totalUsers: 9,
    activeUsers: 5,
    newUsers: [0, 0, 1, 2, 2], // Weekly new users
    totalBets: 16,
    avgBetAmount: 50.5,
    betsByResult: { won: 9, lost: 6 },
    avgPointsPerUser: 543,
    pointsEarned: 724.8,
    pointsLost: 303,
  });

  // Generate labels for each week
  const weekLabels = generateWeekLabels();

  useEffect(() => {
    // Since we are using sample data, no need to fetch from API
  }, []);

  // Custom label renderer for the "New Users" pie chart, showing only the value
  const renderValueLabel = ({ value }) => value;

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
              <Typography variant="h4">{stats.totalUsers}</Typography>
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
              <Typography variant="h4">{stats.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Bets */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Bets Placed
                <Tooltip title="Including pending bets." placement="top" arrow>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography variant="h4">{stats.totalBets}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Bet Amount */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Bet Amount</Typography>
              <Typography variant="h4">${stats.avgBetAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* New Users Weekly */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">New Users (Last 5 Weeks)</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.newUsers.map((value, index) => ({
                      name: weekLabels[index],
                      value,
                    }))}
                    dataKey="value"
                    outerRadius={80}
                    label={renderValueLabel} // Use only the value as the label
                  >
                    {stats.newUsers.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={USERCOLORS[index % USERCOLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartTooltip />
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
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Won", value: stats.betsByResult.won },
                      { name: "Lost", value: stats.betsByResult.lost },
                    ]}
                    dataKey="value"
                    outerRadius={80}
                    label={renderValueLabel} // Show only the value as the label
                    labelLine={false}
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <RechartTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Points per User */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Points per User</Typography>
              <Typography variant="h4">${stats.avgPointsPerUser}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Points Earned through Betting */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Points Earned through Betting
              </Typography>
              <Typography variant="h4">${stats.pointsEarned}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Points Lost in Bets */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Points Lost in Bets</Typography>
              <Typography variant="h4">${stats.pointsLost}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
