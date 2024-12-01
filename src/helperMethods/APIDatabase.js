import { db } from "../FirebaseConfig";
import { ref, get, child, update, set } from "firebase/database";
/**
 * Create User
 * Create Bet
 * Update Bet
 *
 */

/**
 *
 * @param {String} userId
 */
function createUser(userId) {
  const userRef = ref(db, "users/" + userId);
  set(userRef, { points: 500 });
  set(userRef, { betsMade: 0 });
}
/**
 *
 * @param {String} userId
 * @param {Object} bet
 */
async function createBet(userId, bet) {
  const dbRef = ref(db);

  const user = await get(child(dbRef, "users/" + userId));
  const betId = user.child("betsMade").val();
  const points = user.child("betsMade").val();
  const newBetId = betId + 1;
  const betRef = ref(db, "users/" + userId + "/bets/" + newBetId);
  update(betRef, { betId: newBetId });
  update(betRef, { matchTeams: bet.matchTeams });
  update(betRef, { matchDate: bet.matchDate });
  update(betRef, { betType: bet.betType });
  update(betRef, { betAmount: bet.betAmount });
  update(betRef, { betOdds: bet.betOdds });
  update(betRef, { betPrediction: bet.betPrediction });
  update(betRef, { result: "Pending" });
  update(betRef, { winnings: 0 });
  update(betRef, { finalScore: "Pending" });
  update(ref(db, `users/${userId}`), { betsMade: newBetId });
  update(ref(db, `users/${userId}`), { points: points - bet.betAmount });
}
/**
 *
 * @param {String} userId
 * @param {String} betId
 * @param {Boolean} win
 * @param {String} finalScore
 */
async function updateBet(userId, betId, win, finalScore) {
  const dbRef = ref(db);
  const betRef = ref(db, `users/${userId}/bets/${betId}`);
  const bet = await get(child(dbRef, "users/" + userId + "/bets/" + betId));
  const user = await get(dbRef, "users/" + userId);
  const points = user.child("points").val();
  const amount = bet.child("betAmount").val();
  const odds = bet.child("betOdds").val();
  if (win) {
    update(ref(db, `users/${userId}`), { points: points + amount * odds });
    update(betRef, { result: "Won" });
    update(betRef, { winnings: amount * odds });
    update(betRef, { result: finalScore });
  } else {
    update(betRef, { result: "Lost" });
    update(betRef, { winnings: 0 });
    update(betRef, { result: finalScore });
  }
}

async function getReports() {
  const dbRef = ref(db);
  const reports = await get(child(dbRef, "helpRequests"));
  var sortedReports = [];
  if (!reports.exists) return sortedReports;

  reports.forEach((report) => {
    if (report.child("status").val() == "open") {
      var temp = {
        id: report.key,
        content: report.child("content").val(),
        userId: report.child("userId").val(),
        timestamp: report.child("timestamp").val(),
      };
      sortedReports.push(temp);
    }
  });
  console.log(sortedReports);
  return sortedReports;
}

export { createUser, createBet, updateBet, getReports };
