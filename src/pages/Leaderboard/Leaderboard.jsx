import React, { useState, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { db } from '../../FirebaseConfig';
import { Container, Typography, Box, Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from '@mui/material';
import "./Leaderboard.scss";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const dbRef = ref(db);
            try {
                const snapshot = await get(child(dbRef, 'users'));
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usersList = Object.keys(usersData).map((userId) => ({
                        id: userId,
                        username: usersData[userId].username || 'Unknown',
                        points: usersData[userId].points,
                    }));

                    usersList.sort((a, b) => {
                        if (b.points !== a.points) {
                            return b.points - a.points;
                        } else {
                            return a.username.localeCompare(b.username);
                        }
                    });
                    
                    setUsers(usersList);
                } else {
                    console.log('No users found');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <Container className='leaderboard'>
            <Box textAlign="center" my={5}>
                <Typography variant="h3" component="h1" gutterBottom className='leaderboard-title'>
                    Leaderboard
                </Typography>
            </Box>
            <TableContainer>
                <Table className="leaderboard-table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="leaderboard-rank">Rank</TableCell>
                            <TableCell className="leaderboard-username">Username</TableCell>
                            <TableCell className="leaderboard-points">Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell className="leaderboard-rank">{index + 1}</TableCell>
                                <TableCell className="leaderboard-username">{user.username}</TableCell>
                                <TableCell className="leaderboard-points">{user.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
