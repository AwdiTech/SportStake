import { Container, Typography, Box, Table,TableHead,TableBody,TableCell,TableRow ,TableContainer } from "@mui/material";
import { useEffect } from "react";
import { FaFutbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MatchList.scss";

export default function MatchList() {
   let matchData = [,{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"},{date:"2024-20-20",time:"9:30",team1:"Canada",team2:"america",homeWin:"2.0",tie:"1.5",awayWin:"3.5"}] //will get data from api funtion
   const navigate = useNavigate();
   useEffect(()=>{
    matchData = formatMatchData(matchData);

   })
   function formatMatchData(data){
    return data
   }
   function navToDetails(matchId){
    navigate("/MatchDetails",{matchID: matchId});
   }

  return (
    <Container>
      
      <Box textAlign="center" my={5}>
        <FaFutbol size={50} color="green" />
        <Typography variant="h4" component="h1" gutterBottom>
         SportStake
        </Typography>
        <Typography  gutterBottom>
          Live and upcoming Matches 
        </Typography>
      </Box>
      <Typography variant="h5" gutterBottom>
          Upcoming Matches
        </Typography>
      <Box my={5} className="matchList">
       
        
          <TableContainer style={{ maxHeight: 400 }}>
        <Table className="table">
            <TableHead >
                <TableRow >
                <TableCell  sx={{color:"white",fontSize:20 ,fontWeight:650}}>Date</TableCell>
                
                <TableCell sx={{color:"white",fontSize:20 ,fontWeight:650}} style ={{ paddingLeft:60}}>Match</TableCell>
                <TableCell sx={{color:"white",fontSize:20 ,fontWeight:650}} >Home</TableCell>
                <TableCell sx={{color:"white",fontSize:20 ,fontWeight:650}} >Tie</TableCell>
                <TableCell sx={{color:"white",fontSize:20 ,fontWeight:650}} >Away</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {matchData.map((data,index)=>(
                    <TableRow 
                    key ={index}
                    onClick={()=>navToDetails(data.id)}
                    >
                        <TableCell sx={{color:"white",fontSize:14 ,fontWeight:400}} ><div>{data.date}</div> {data.time} </TableCell>
                        <TableCell className="matchCell" sx={{color:"white",fontSize:18 ,fontWeight:400, paddingRight:13}}  >{data.team1} VS {data.team2} </TableCell>
                       
                        <TableCell sx={{color:"orange",fontSize:18 ,fontWeight:400, paddingLeft:4}}> {data.homeWin}</TableCell>
                        <TableCell sx={{color:"orange",fontSize:18 ,fontWeight:400}}>{data.tie}</TableCell>
                        <TableCell sx={{color:"orange",fontSize:18 ,fontWeight:400}}>{data.awayWin}</TableCell>

                    </TableRow>
                
                ))}

            </TableBody>
        </Table>
        </TableContainer>
        </Box>
     
      </Container>
   
  );
}
