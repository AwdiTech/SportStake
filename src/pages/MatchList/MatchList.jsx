import { Container, Typography, Box, Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUpcomingGamesWithOdds } from "../../api/api";
import "./MatchList.scss";

export default function MatchList() {
  const [matchData, setMatchData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    let fetchData = async () => {
      let data = await getUpcomingGamesWithOdds();
      //console.log(data);
      setMatchData(data);
    };

    fetchData();
  }, []);

  function navToDetails(eventId) {
    navigate(`/matchDetails/${eventId}`);
  }

  return (
    <Container>
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
          SportStake
        </Typography>
        <Typography gutterBottom>Live and upcoming Matches</Typography>
      </Box>
      <Typography variant="h5" gutterBottom>
        Upcoming Matches
      </Typography>
      <Box my={5} className="matchList">
        <TableContainer style={{ maxHeight: 400 }}>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontSize: 20, fontWeight: 650 }}>Date</TableCell>

                <TableCell sx={{ color: "white", fontSize: 20, fontWeight: 650 }} style={{ paddingLeft: 60 }}>
                  Match
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: 20, fontWeight: 650 }}>Home</TableCell>
                <TableCell sx={{ color: "white", fontSize: 20, fontWeight: 650 }}>Tie</TableCell>
                <TableCell sx={{ color: "white", fontSize: 20, fontWeight: 650 }}>Away</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchData.map((data) => (
                <TableRow key={data.eventId} onClick={() => navToDetails(data.eventId)}>
                  <TableCell sx={{ color: "white", fontSize: 14, fontWeight: 400 }}>
                    <div>{data.commenceTime}</div>
                  </TableCell>
                  <TableCell className="matchCell" sx={{ color: "white", fontSize: 18, fontWeight: 400, paddingRight: 13 }}>
                    {data.homeTeam} VS {data.awayTeam}{" "}
                  </TableCell>

                  <TableCell sx={{ color: "orange", fontSize: 18, fontWeight: 400, paddingLeft: 4 }}>
                    {" "}
                    {data.h2hOdds.find((odd) => odd.name === data.homeTeam).price}
                  </TableCell>
                  <TableCell sx={{ color: "orange", fontSize: 18, fontWeight: 400 }}>
                    {data.h2hOdds.find((odd) => odd.name === "Draw").price}
                  </TableCell>
                  <TableCell sx={{ color: "orange", fontSize: 18, fontWeight: 400 }}>
                    {data.h2hOdds.find((odd) => odd.name === data.awayTeam).price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
