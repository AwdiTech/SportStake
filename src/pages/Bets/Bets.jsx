import { Table, TableHead, TableBody, TableCell, TableRow, Card, Paper, CardContent, Typography, TableContainer, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getEventOdds, getTotalsOdds, getBttsOdds, getPlayerGoalScorers } from "../../api/api";
import { useParams } from "react-router-dom";
import "./Bets.scss";
export default function Bets() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [h2hOdds, setH2hOdds] = useState({});
  const [overUnderOdds, setOverUnderOdds] = useState({});
  const [bttsOdds, setBttsOdds] = useState({});
  const [playerGoalScorers, setPlayerGoalScorers] = useState({});

  useEffect(() => {
    let fetchData = async () => {
      let h2hData = await getEventOdds(eventId);
      let overUnderData = await getTotalsOdds(eventId);
      let bttsData = await getBttsOdds(eventId);
      let playerGoalsData = await getPlayerGoalScorers(eventId);

      setIsLoading(false);

      //console.log(playerGoalsData);

      setH2hOdds(h2hData);
      setOverUnderOdds(overUnderData);
      setBttsOdds(bttsData);
      setPlayerGoalScorers(playerGoalsData);
    };

    fetchData();
  }, []);

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
              <TableCell className="bet-tablecell">
                Home:
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0].markets[0].outcomes.find((odds) => odds.name === h2hOdds.home_team).price}
                </span>
              </TableCell>
              <TableCell className="bet-tablecell">
                Away:{" "}
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0].markets[0].outcomes.find((odds) => odds.name === h2hOdds.away_team).price}
                </span>
              </TableCell>
              <TableCell className="bet-tablecell">
                Tie:{" "}
                <span className="highlight">
                  {isLoading ? "..." : h2hOdds.bookmakers[0].markets[0].outcomes.find((odds) => odds.name === "Draw").price}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
                <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[0].point}</span>
              </TableCell>
              <TableCell className="bet-tablecell" align="center">
                Over: <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[0].odds}</span>
              </TableCell>
              <TableCell className="bet-tablecell" align="center">
                Under: <span className="highlight">{isLoading ? "..." : overUnderOdds.totals[1].odds}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
              <TableCell className="bet-tablecell">
                Yes: <span className="highlight">{isLoading ? "..." : bttsOdds.btts.find((odds) => odds.type == "Yes").odds}</span>
              </TableCell>
              <TableCell className="bet-tablecell">
                No: <span className="highlight">{isLoading ? "..." : bttsOdds.btts.find((odds) => odds.type == "No").odds}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {isLoading ? null : (
          <div>
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
                    .find((market) => market.marketType === "player_goal_scorer_anytime")
                    .players.map((player) => (
                      <TableRow key={player.player}>
                        <TableCell className="tablecell">{player.player}</TableCell>
                        <TableCell className="bet-tablecell">{player.bets[0].odds}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                    .find((market) => market.marketType === "player_first_goal_scorer")
                    .players.map((player) => (
                      <TableRow key={player.player}>
                        <TableCell className="tablecell">{player.player}</TableCell>
                        <TableCell className="bet-tablecell">{player.bets[0].odds}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                    .find((market) => market.marketType === "player_last_goal_scorer")
                    .players.map((player) => (
                      <TableRow key={player.player}>
                        <TableCell className="tablecell">{player.player}</TableCell>
                        <TableCell className="bet-tablecell">{player.bets[0].odds}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Paper>
    </div>
  );
}
