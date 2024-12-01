import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Card,
  Paper,
  CardContent,
  Typography,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { auth } from "../../FirebaseConfig";
import { getEventOdds, getTotalsOdds, getBttsOdds, getPlayerGoalScorers } from "../../api/api";
import { createBet } from "../../helperMethods/APIDatabase";
import { useParams } from "react-router-dom";
import "./Bets.scss";

export default function Bets() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [h2hOdds, setH2hOdds] = useState({});
  const [overUnderOdds, setOverUnderOdds] = useState({});
  const [bttsOdds, setBttsOdds] = useState({});
  const [playerGoalScorers, setPlayerGoalScorers] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let h2hData = await getEventOdds(eventId);
      let overUnderData = await getTotalsOdds(eventId);
      let bttsData = await getBttsOdds(eventId);
      let playerGoalsData = await getPlayerGoalScorers(eventId);

      setIsLoading(false);
      setH2hOdds(h2hData);
      setOverUnderOdds(overUnderData);
      setBttsOdds(bttsData);
      setPlayerGoalScorers(playerGoalsData);
    };

    fetchData();
  }, [eventId]);

  const handleOpenModal = (bet) => {
    setSelectedBet(bet);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setBetAmount("");
  };

  const handlePlaceBet = () => {
    const userId = auth.currentUser?.uid;

    const bet = {
      ...selectedBet,
      betAmount: betAmount,
      matchTeams: `${h2hOdds.home_team} VS ${h2hOdds.away_team}`,
      matchDate: h2hOdds.commence_time,
    };
    delete bet.type;

    bet.betAmount = Number(bet.betAmount);
    bet.betOdds = Number(bet.betOdds);

    createBet(userId, bet);
    handleCloseModal();
  };

  return (
    <div>
      <Card sx={{ minWidth: 800, marginTop: 20 }}>
        <CardContent>
          <Typography variant="h4">
            {h2hOdds.home_team} VS {h2hOdds.away_team}
          </Typography>
          <Typography variant="h6">{h2hOdds.commence_time}</Typography>
        </CardContent>
      </Card>
      <br />
      <Paper className="paper">
        {/* Head to Head */}
        <Table className="tables">
          <TableHead>
            <TableRow>
              <TableCell className="tablecell" colSpan={3}>
                Head to Head
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Head to Head",
                    betType: "h2h",
                    betPrediction: "Home",
                    betOdds: h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === h2hOdds.home_team)?.price,
                  })
                }
              >
                Home:{" "}
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === h2hOdds.home_team)?.price}
                </span>
              </TableCell>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Head to Head",
                    betType: "h2h",
                    betPrediction: "Away",
                    betOdds: h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === h2hOdds.away_team)?.price,
                  })
                }
              >
                Away:{" "}
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === h2hOdds.away_team)?.price}
                </span>
              </TableCell>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Head to Head",
                    betType: "h2h",
                    betPrediction: "Tie",
                    betOdds: h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === "Draw")?.price,
                  })
                }
              >
                Tie:{" "}
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0]?.markets[0]?.outcomes.find((odds) => odds.name === "Draw")?.price}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Over / Under */}
        <Table className="tables">
          <TableHead>
            <TableRow>
              <TableCell className="tablecell" colSpan={3}>
                Over / Under
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="tablecell">
                <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[0].point}</span> Goals
              </TableCell>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Over / Under",
                    betType: "totals",
                    betPrediction: `Over ${overUnderOdds.totals[0].point} Goals`,
                    betOdds: overUnderOdds.totals[0]?.odds,
                  })
                }
              >
                Over: <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[0]?.odds}</span>
              </TableCell>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Over / Under",
                    betType: "totals",
                    betPrediction: `Under ${overUnderOdds.totals[0].point} Goals`,
                    betOdds: overUnderOdds.totals[1]?.odds,
                  })
                }
              >
                Under: <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[1]?.odds}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Both Teams to Score */}
        <Table className="tables">
          <TableHead>
            <TableRow>
              <TableCell className="tablecell" colSpan={2}>
                Both Teams to Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Both Teams to Score",
                    betType: "btts",
                    betPrediction: "Yes",
                    betOdds: bttsOdds.btts?.find((odds) => odds.type === "Yes")?.odds,
                  })
                }
              >
                Yes: <span className="highlight">{isLoading ? "..." : bttsOdds.btts?.find((odds) => odds.type === "Yes")?.odds}</span>
              </TableCell>
              <TableCell
                className="bet-tablecell"
                onClick={() =>
                  handleOpenModal({
                    type: "Both Teams to Score",
                    betType: "btts",
                    betPrediction: "No",
                    betOdds: bttsOdds.btts?.find((odds) => odds.type === "No")?.odds,
                  })
                }
              >
                No: <span className="highlight">{isLoading ? "..." : bttsOdds.btts?.find((odds) => odds.type === "No")?.odds}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Player To Score */}
        <TableContainer sx={{ maxHeight: 340 }}>
          <Table className="tables" stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell className="tablecell">Player To Score</TableCell>
                <TableCell className="tablecell">Anytime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerGoalScorers.playerMarkets
                ?.find((market) => market.marketType === "player_goal_scorer_anytime")
                ?.players.map((player) => (
                  <TableRow
                    key={player.player}
                    onClick={() =>
                      handleOpenModal({
                        type: "Player To Score Anytime",
                        betType: "player_goal_scorer_anytime",
                        betPrediction: player.player,
                        betOdds: player.bets[0]?.odds,
                      })
                    }
                  >
                    <TableCell className="tablecell">{player.player}</TableCell>
                    <TableCell className="bet-tablecell">{player.bets[0]?.odds}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Player To Score */}
        <TableContainer sx={{ maxHeight: 340 }}>
          <Table className="tables" stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell className="tablecell">Player To Score</TableCell>
                <TableCell className="tablecell">First</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerGoalScorers.playerMarkets
                ?.find((market) => market.marketType === "player_first_goal_scorer")
                ?.players.map((player) => (
                  <TableRow
                    key={player.player}
                    onClick={() =>
                      handleOpenModal({
                        type: "Player To Score First",
                        betType: "player_first_goal_scorer",
                        betPrediction: player.player,
                        betOdds: player.bets[0]?.odds,
                      })
                    }
                  >
                    <TableCell className="tablecell">{player.player}</TableCell>
                    <TableCell className="bet-tablecell">{player.bets[0]?.odds}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Player To Score */}
        <TableContainer sx={{ maxHeight: 340 }}>
          <Table className="tables" stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell className="tablecell">Player To Score</TableCell>
                <TableCell className="tablecell">Last</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerGoalScorers.playerMarkets
                ?.find((market) => market.marketType === "player_last_goal_scorer")
                ?.players.map((player) => (
                  <TableRow
                    key={player.player}
                    onClick={() =>
                      handleOpenModal({
                        type: "Player To Score Last",
                        betType: "player_last_goal_scorer",
                        betPrediction: player.player,
                        betOdds: player.bets[0]?.odds,
                      })
                    }
                  >
                    <TableCell className="tablecell">{player.player}</TableCell>
                    <TableCell className="bet-tablecell">{player.bets[0]?.odds}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal for placing bets */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Place Bet</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Bet Type: {selectedBet?.type}</Typography>
          <Typography variant="subtitle2">Bet Option: {selectedBet?.betPrediction}</Typography>
          <Typography variant="subtitle2">Odds: {selectedBet?.betOdds}</Typography>
          <Box mt={2}>
            <TextField label="Bet Amount" type="number" fullWidth value={betAmount} onChange={(e) => setBetAmount(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handlePlaceBet}>
            Place Bet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
