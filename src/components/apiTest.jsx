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
    getBttsOdds
} from './api'; // Ensure this points to your api.js file

const App = () => {
    // const [apiData, setApiData] = useState(null); // Optional: Store API data

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                // Call each function and log the results to the console
                const sports = await getSports();
                console.log('Sports:', sports);

                const odds = await getOdds('soccer_epl', 'us', 'h2h');
                console.log('Odds:', odds);

                const eventOdds = await getEventOdds('b52655dd4e42aacd0e7281126f97b437');
                console.log('Event Odds:', eventOdds);

                const scores = await getScores('soccer_epl', 1);
                console.log('Scores:', scores);

                const upcomingGamesWithOdds = await getUpcomingGamesWithOdds('soccer_epl', 'us');
                console.log('Upcoming Games With Odds:', upcomingGamesWithOdds);

                const playerGoalScorers = await getPlayerGoalScorers('b52655dd4e42aacd0e7281126f97b437');
                console.log('Player Goal Scorers:', playerGoalScorers);

                const totalsOdds = await getTotalsOdds('b52655dd4e42aacd0e7281126f97b437');
                console.log('Totals Odds:', totalsOdds);

                const bttsOdds = await getBttsOdds('b52655dd4e42aacd0e7281126f97b437');
                console.log('BTTS Odds:', bttsOdds);

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
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };

        fetchApiData();
    }, []);

    return (
        <div className="App">
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

export default App;
