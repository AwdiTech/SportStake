// App.js - Example usage of the Odds API in React
import React, { useEffect, useState } from 'react';
import {
    getSports,
    getOdds,
    getEventOdds,
    getScores,
    getUpcomingGamesWithOdds,
    getPlayerGoalScorers,
    getTotalsOdds,
    getBttsOdds,
    getHistoricalOdds,
} from '../api/api'; // Ensure this points to your api.js file

const APITester = () => {
    const [apiData, setApiData] = useState(null); // Optional: Store API data

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                // Call each function and log the results to the console
                const sports = await getSports();
                const eventId = "9e0c99af94ab830a4d5729388bd2398b"; // Replace this with a specifc event to see API fetching results for that event

                console.log('All Sports:', sports);

                const odds = await getOdds('soccer_epl', 'us', 'h2h');
                console.log('Odds for Soccer European Premier League:', odds);

                const eventOdds = await getEventOdds(eventId);
                console.log('Event Odds:', eventOdds);

                const scores = await getScores('soccer_epl', 1);
                console.log('Scores for European Premier League:', scores);

                const upcomingGamesWithOdds = await getUpcomingGamesWithOdds('soccer_epl', 'us');
                console.log('Upcoming Games (For European Premier League) With Odds:', upcomingGamesWithOdds);

                const playerGoalScorers = await getPlayerGoalScorers(eventId);
                console.log(`Player Goal Scorers for eventID(${eventId}):`, playerGoalScorers);

                const totalsOdds = await getTotalsOdds(eventId);
                console.log(`Totals Odds for eventID(${eventId}):`, totalsOdds);

                const bttsOdds = await getBttsOdds(eventId);
                console.log(`BTTS Odds for eventID(${eventId}):`, bttsOdds);

                // Optional: Store the API responses in the state to render on the page
                // setApiData({
                //     sports,
                //     odds,
                //     eventOdds,
                //     scores,
                //     upcomingGamesWithOdds,
                //     playerGoalScorers,
                //     totalsOdds,
                //     bttsOdds,
                // });

                // Old game b52655dd4e42aacd0e7281126f97b437
                const historicalData = await getHistoricalOdds(
                    "soccer_epl", // Example sport key
                    "b52655dd4e42aacd0e7281126f97b437", // Finished game ID
                );
                console.log('Historical Odds:', historicalData);

            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };

        fetchApiData();
    }, []);

    return (
        <div className="TestAPI">
            <h1>Odds API Demo</h1>
            <p>Check the console for API responses.</p>

            {/* Optional: Render data directly on the page */}
            {apiData && (
                <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(apiData, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default APITester;
