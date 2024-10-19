import { Container, Typography, Box, Table } from "@mui/material";
import { useEffect } from "react";
import { FaFutbol } from "react-icons/fa";

export default function MatchList() {
   let matchData = [] //will get data from api funtion
   const navigate = useNavigate();
   useEffect(()=>{
    matchData = formatMatchData(matchData);

   })
   function formatMatchData(data){

   }
   function navToDetails(matchId){
    navigate("/MatchDetails",{matchID: matchId});
   }

  return (
    <Container maxWidth="lg" className="matchList">
 
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
         SportStake
        </Typography>
        <Typography variant="body1" gutterBottom>
          Live and upcoming Matches 
        </Typography>
      </Box>
   
      <Box my={5}>
        <Typography variant="h5" gutterBottom>
          Upcoming Matches
        </Typography>
        <Table>
            <TableHead>
                <TableRow>
                <Tablecell >Date</Tablecell>
                <TableCell ></TableCell>
                <TableCell style ={{ paddingLeft:60}}>Home</TableCell>
                <TableCell >Tie</TableCell>
                <TableCell >Away</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {matchData.map((data,index)=>(
                    <TableRow 
                    key ={index}
                    onClick={()=>navToDetails(data.id)}
                    >
                        <TableCell>{data.date}</TableCell>
                        <TableCell>{data.team1} VS {data.team2}</TableCell>
                        <TableCell style ={{ paddingLeft:60,color:"orange"}}>{data.homeWin}</TableCell>
                        <TableCell style ={{ color:"orange"}}>{data.tie}</TableCell>
                        <TableCell style ={{ color:"orange"}}>{data.awayWin}</TableCell>

                    </TableRow>
                
                ))}

            </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
