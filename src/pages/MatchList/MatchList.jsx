
import { Container, Typography, Box, Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";

import { FaFutbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUpcomingGamesWithOdds } from "../../api/api";
import "./MatchList.scss";


export default function MatchList() {

   
   const [matchData, setmatchData] = useState([]);
   const navigate = useNavigate();
   useEffect(()=>{
    
    async function fetchData() {
      var data = []
      await getUpcomingGamesWithOdds().then((value)=>
        setmatchData(formatMatchData(value))
      )
      return data;
      }
     
      fetchData();
   },[])
   function formatMatchData(data){
    var formatedData = [];
    
    
    
    
    data.forEach(match => {
      var commenceTime = "";
      commenceTime =match.commenceTime;
      var dateTime = commenceTime.replace('Z','').split("T")
      var time = dateTime[1].split(":")
      var h2o = {
        awayWin : 0,
        draw:0,
        homeWin:0
      }
      if(parseInt(time[0])>12){
       dateTime[1] = (parseInt(time[0]) - 12)+":"+ time[1]+"pm"
      }
      else{
        dateTime[1]= time[0]+":"+time[1]+"am"
      }
      if(match.homeTeam == match.h2hOdds[0].name){
        h2o.homeWin = match.h2hOdds[0].price
        h2o.awayWin = match.h2hOdds[1].price
        h2o.draw = match.h2hOdds[2].price
      }
      else{
        h2o.homeWin = match.h2hOdds[1].price
        h2o.awayWin = match.h2hOdds[0].price
        h2o.draw = match.h2hOdds[2].price
      }


      var formatedMatch = {
        id:match.eventId,
        date:dateTime[0],
        time:dateTime[1],
        team1:match.homeTeam,
        team2:match.awayTeam,
        homeWin:h2o.homeWin,
        tie:h2o.draw,
        awayWin:h2o.awayWin
      }
      formatedData.push(formatedMatch)
    });


    return formatedData
   }
 



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