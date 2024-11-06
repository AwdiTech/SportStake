// api.js - The Odds API integration using Axios
import axios from 'axios';

// Will be moving these to a .env file in the future
const API_KEY = '4ae353ebf3c5df433e45e7b806269017'; // The Odds API Key - Free tier
const BASE_URL = 'https://api.the-odds-api.com/v4'; // The Odds API base URL
const DEFAULT_SPORT = 'soccer_epl'; // Default sport for testing (soccer - English Premier League)


/**
 * Fetches data from a specified endpoint using TheOddsAPI and Axios for easier HTTP requests.
 *
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {Object} [params={}] - Optional parameters to include in the API request.
 * @param {string} params.apiKey - The API key for authentication.
 * @returns {Promise<Object|null>} - A promise that resolves to the response data, or null if an error occurs.
 */
const fetchData = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: { apiKey: API_KEY, ...params },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from TheOddsAPI:', error);
        return null;
    }
};


/**
 * Fetches the list of all sports available from TheOddsAPI.
 *
 * @async
 * @function getSports
 * @returns {Promise<Object>} A promise that resolves to the list of sports.
 */
export const getSports = async () => fetchData('/sports');


/**
 * Fetches the odds available for a given sport.
 *
 * @param {string} [sportKey=DEFAULT_SPORT] - The key of the sport to fetch odds for.
 * @param {string} [region='us'] - The region to fetch odds from.
 * @param {string} [markets='h2h'] - The type of markets to fetch odds for.
 * @returns {Promise<Object>} A promise that resolves to the fetched odds data.
 */
export const getOdds = async (sportKey = DEFAULT_SPORT, region = 'us', markets = 'h2h') =>
    fetchData(`/sports/${sportKey}/odds`, {
        regions: region,
        markets: markets,
    });


    /**
 * Fetches the odds for a specific event.
 *
 * @param {string} eventId - The ID of the event.
 * @param {string} [sportKey=DEFAULT_SPORT] - The key for the sport (default is DEFAULT_SPORT).
 * @param {string} [region='us'] - The region for the odds (default is 'us').
 * @param {string} [markets='h2h'] - The markets for the odds (default is 'h2h').
 * @returns {Promise<Object>} A promise that resolves to the odds data for the event.
 */
export const getEventOdds = async (eventId, sportKey = DEFAULT_SPORT, region = 'us', markets = 'h2h') =>
    fetchData(`/sports/${sportKey}/events/${eventId}/odds`, {
        regions: region,
        markets: markets,
    });



// Get scores for ongoing and completed events
/**
 * Fetches the scores for a given sport.
 *
 * @param {string} [sportKey=DEFAULT_SPORT] - The key representing the sport for which to fetch scores.
 * @param {number} [daysFrom=1] - The number of days in the past from which to return completed events. Valid values are integers from 1 to 3. If this field is missing, only live and upcoming events are returned.
 * @returns {Promise<Object>} A promise that resolves to the fetched scores data.
 */
export const getScores = async (sportKey = DEFAULT_SPORT, daysFrom = 1) =>
    fetchData(`/sports/${sportKey}/scores`, {
        daysFrom: daysFrom,
    });




/**
 * Fetches upcoming games with odds for a specified sport using the sport key id.
 *
 * @param {string} [sportKey=DEFAULT_SPORT] - The key of the sport to fetch odds for.
 * @param {string} [region='us'] - The region to fetch odds for.
 * @param {string} [markets='h2h'] - The type of markets to fetch odds for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of game objects with odds.
 * @property {string} eventId - The ID of the event.
 * @property {string} homeTeam - The name of the home team.
 * @property {string} awayTeam - The name of the away team.
 * @property {Array<Object>} h2hOdds - The head-to-head odds for the event.
 * @property {string} commenceTime - The commencement time of the event.
 */
export const getUpcomingGamesWithOdds = async (sportKey = DEFAULT_SPORT, region = 'us', markets = 'h2h') => {
    const data = await fetchData(`/sports/${sportKey}/odds`, {
        regions: region,
        markets: markets,
    });

    if (!data) return [];

    // Formating the raw data to return Home Team, Away Team, and h2h Odds
    return data.map(event => ({
        eventId: event.id,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        h2hOdds: event.bookmakers?.at(0).markets?.at(0).outcomes || null, // Just returning the first bookmaker's odds if available for simplicity
        commenceTime: event.commence_time,
    }));
};


/**
 * Fetches and processes player goal scorer odds for a given event and returns a formatted object with player markets and odds.
 *
 * @param {string} eventId - The ID of the event to fetch odds for.
 * @param {string} [sportKey=DEFAULT_SPORT] - The sport key to use for fetching odds (default is 'DEFAULT_SPORT').
 * @param {string} [region='us'] - The region to use for fetching odds (default is 'us').
 * @returns {Promise<Object>} A promise that resolves to an object containing event details and player markets.
 * @property {string} eventId - The ID of the event.
 * @property {string} homeTeam - The name of the home team.
 * @property {string} awayTeam - The name of the away team.
 * @property {string} commenceTime - The start time of the event.
 * @property {Array<Object>} playerMarkets - An array of player market objects.
 * @property {string} playerMarkets.marketType - The type of market (e.g., 'player_goal_scorer_anytime').
 * @property {Array<Object>} playerMarkets.players - An array of player objects.
 * @property {string} playerMarkets.players.player - The name of the player.
 * @property {Array<Object>} playerMarkets.players.bets - An array of bet objects.
 * @property {string} playerMarkets.players.bets.type - The type of bet (e.g., 'Yes', 'Over', 'Under').
 * @property {number} playerMarkets.players.bets.odds - The averaged odds for the bet type.
 * @property {number|null} playerMarkets.players.bets.point - The point value for the bet type, if applicable.
 */
export const getPlayerGoalScorers = async (eventId, sportKey = DEFAULT_SPORT, region = 'us') => {
    const allPlayerMarketsString = 'player_goal_scorer_anytime,player_first_goal_scorer,player_last_goal_scorer,player_shots_on_target,player_shots,player_assists'; // All player markets we'll need to fetch
    const data = await getEventOdds(eventId, sportKey, region, allPlayerMarketsString);

    if (!data || !data.bookmakers) return [];

    const marketMap = new Map();

    // Iterate through bookmakers to group odds by market type and player name
    data.bookmakers.forEach((bookmaker) => {
        bookmaker.markets.forEach((market) => {
            const marketKey = market.key;

            if (!marketMap.has(marketKey)) {
                marketMap.set(marketKey, new Map()); // Store players by name within each market
            }

            market.outcomes.forEach((outcome) => {
                const playerName = outcome.description;
                const odds = outcome.price;
                const betType = outcome.name; // Example: 'Yes', 'Over', 'Under'
                const point = outcome.point || null;

                const playerMap = marketMap.get(marketKey);

                if (!playerMap.has(playerName)) {
                    playerMap.set(playerName, []);
                }

                // Add the odds to the player's list for this market
                playerMap.get(playerName).push({ type: betType, odds, point });
            });
        });
    });

    // Format the output by averaging odds for each player in every market
    const formattedMarkets = Array.from(marketMap.entries()).map(([marketType, players]) => ({
        marketType,
        players: Array.from(players.entries()).map(([playerName, bets]) => ({
            player: playerName,
            bets: Object.values(
                bets.reduce((acc, bet) => {
                    const { type, odds, point } = bet;
            
                    if (!acc[type]) {
                        acc[type] = { type, odds: [], point };
                    }
            
                    acc[type].odds.push(odds); // Collect odds for this type into an array
            
                    return acc;
                }, {})
            ).map((betGroup) => ({
                type: betGroup.type,
                odds: calculateAverageOdds(betGroup.odds), // Average the odds using the array of odds from different bookmakers
                point: betGroup.point,
            })),
        })),            
    }));

    return {
        eventId: data.id,
        homeTeam: data.home_team,
        awayTeam: data.away_team,
        commenceTime: data.commence_time,
        playerMarkets: formattedMarkets,
    };
};


/**
 * Fetches the total goal/score odds for a given event.
 *
 * @param {string} eventId - The ID of the event.
 * @param {string} [sportKey=DEFAULT_SPORT] - The key for the sport (default is DEFAULT_SPORT).
 * @param {string} [region='us'] - The region for the odds (default is 'us').
 * @returns {Promise<Object>} An object containing event details and formatted total odds.
 * @returns {string} return.eventId - The ID of the event.
 * @returns {string} return.homeTeam - The name of the home team.
 * @returns {string} return.awayTeam - The name of the away team.
 * @returns {string} return.commenceTime - The commencement time of the event.
 * @returns {Object} return.totals - The formatted total odds for the event.
 */
export const getTotalsOdds = async (eventId, sportKey = DEFAULT_SPORT, region = 'us') => {
    const data = await getEventOdds(eventId, sportKey, region, 'totals');
    return {
        eventId: data.id,
        homeTeam: data.home_team,
        awayTeam: data.away_team,
        commenceTime: data.commence_time,
        totals: formatMarketOdds(data, 'totals'),
    };
};


/**
 * Fetches Both Teams To Score (BTTS) odds for a given event.
 *
 * @param {string} eventId - The ID of the event for which to fetch BTTS odds.
 * @param {string} [sportKey=DEFAULT_SPORT] - The sport key (default is 'DEFAULT_SPORT').
 * @param {string} [region='us'] - The region for which to fetch odds (default is 'us').
 * @returns {Promise<Object>} An object containing event details and BTTS odds.
 * @property {string} eventId - The ID of the event.
 * @property {string} homeTeam - The name of the home team.
 * @property {string} awayTeam - The name of the away team.
 * @property {string} commenceTime - The start time of the event.
 * @property {Object} btts - The formatted BTTS odds.
 */
export const getBttsOdds = async (eventId, sportKey = DEFAULT_SPORT, region = 'us') => {
    const data = await getEventOdds(eventId, sportKey, region, 'btts');
    return {
        eventId: data.id,
        homeTeam: data.home_team,
        awayTeam: data.away_team,
        commenceTime: data.commence_time,
        btts: formatMarketOdds(data, 'btts'),
    };
};


export default {
    getSports,
    getOdds,
    getEventOdds,
    getScores,
    getUpcomingGamesWithOdds,
    getPlayerGoalScorers,
    getTotalsOdds,
    getBttsOdds,
};



// ------------------ HELPER FUNCTIONS ------------------

// This function takes the array of odds and calculates the average of the values.
const calculateAverageOdds = (oddsArray) =>
    (oddsArray.reduce((acc, val) => acc + val, 0) / oddsArray.length).toFixed(2);

// Helper to extract and format data for each market type
const formatMarketOdds = (data, marketKey) => {
    if (!data || !data.bookmakers) return [];

    const marketMap = new Map();

    // Iterate through each bookmaker to gather market outcomes
    data.bookmakers.forEach((bookmaker) => {
        const market = bookmaker.markets.find((m) => m.key === marketKey);

        if (market) {
            market.outcomes.forEach((outcome) => {
                const betType = outcome.name; // Over, Under, Yes, No
                const point = outcome.point || null;
                const odds = outcome.price;

                const existingBet = marketMap.get(betType + point) || { odds: [], point, type: betType };

                existingBet.odds.push(odds);
                marketMap.set(betType + point, existingBet);
            });
        }
    });

    // Format the data by averaging odds and returning organized outcomes
    return Array.from(marketMap.values()).map((bet) => ({
        type: bet.type,
        odds: calculateAverageOdds(bet.odds),
        point: bet.point,
    }));
};

