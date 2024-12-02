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
async function createUser(userId) {
  const refStats = ref(db, "stats/");
  const stats = await get(child(db, "stats"));
  const numUsers = stats.child("totalUsers").val();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  const userRef = ref(db, "users/" + userId);
  set(userRef, { points: 500 });
  set(userRef, { betsMade: 0 });
  set(userRef, { dateCreated: today });
  set(userRef, { win: 0 });
  set(userRef, { loss: 0 });

  update(refStats, { totalUsers: numUsers + 1 });
}
/**
 *
 * @param {Boolean} loginLogout
 */
async function numberUsers(loginLogout) {
  const dbRef = ref(db);
  const refStats = ref(db, "stats/");
  const stats = await get(child(dbRef, "stats"));
  const numUsers = stats.child("currentUsers").val();
  if (loginLogout) {
    update(refStats, { currentUsers: numUsers + 1 });
  } else update(refStats, { currentUsers: numUsers - 1 });
}
/**
 *
 * @param {String} userId
 * @param {Object} bet
 */
async function createBet(userId, bet) {
  const dbRef = ref(db);
  const statRef = ref(db, "stats/");
  const stats = await get(child(dbRef, "stats"));
  const totalBets = stats.child("betsMade").val();
  const totalRevenue = stats.child("totalRevenue").val();

  const avgBetAmount = stats.child("avgBetAmount").val();
  const newAvgBetAmount =
    (avgBetAmount * totalBets + bet.betAmount) / totalBets;
  const user = await get(child(dbRef, "users/" + userId));
  const betId = user.child("betsMade").val() + 1;
  const points = user.child("points").val();
  const betRef = ref(db, "users/" + userId + "/bets/" + betId);
  update(betRef, { betId: totalBets + 1 });
  update(betRef, { matchTeams: bet.matchTeams });
  update(betRef, { matchDate: bet.matchDate });
  update(betRef, { betType: bet.betType });
  update(betRef, { betAmount: bet.betAmount });
  update(betRef, { betOdds: bet.betOdds });
  update(betRef, { betPrediction: bet.betPrediction });
  update(betRef, { result: "Pending" });
  update(betRef, { winnings: 0 });
  update(betRef, { finalScore: "Pending" });
  update(statRef, { totalBets: totalBets + 1 });
  update(statRef, { totalRevenue: totalRevenue + bet.betAmount });
  update(statRef, { avgBetAmount: newAvgBetAmount });
  update(ref(db, `users/${userId}`), { betsMade: totalBets + 1 });
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
  const statRef = ref(db, "stats/");
  const stats = await get(child(dbRef, "stats"));
  const betsByResult = await get(child(dbRef, "stats/betsByResult"));
  const payout = stats.child("payout").val();
  const lost = betsByResult.child("lost").val();
  const won = betsByResult.child("won").val();
  const bet = await get(child(dbRef, "users/" + userId + "/bets/" + betId));
  const user = await get(dbRef, "users/" + userId);
  const points = user.child("points").val();
  const amount = bet.child("betAmount").val();
  const userWins = user.child("win").val();
  const userLoss = user.child("loss").val();
  const odds = bet.child("betOdds").val();

  if (win) {
    update(ref(db, `users/${userId}`), { points: points + amount * odds });
    update(betRef, { result: "Won" });
    update(betRef, { winnings: amount * odds });
    update(betRef, { result: finalScore });
    update(statRef, { payout: payout + amount * odds });
    update(ref(db, "stats/betsByResult"), { won: won + 1 });
    update(ref(db, `users/${userId}`), { points: points + amount * odds });
    update(ref(db, `users/${userId}`), { win: userWins + 1 });
  } else {
    update(betRef, { result: "Lost" });
    update(betRef, { winnings: 0 });
    update(betRef, { result: finalScore });
    update(ref(db, "stats/betsByResult"), { lost: lost + 1 });
    update(ref(db, `users/${userId}`), { loss: userLoss + 1 });
  }
}

async function getStats() {
  const dbRef = ref(db);
  const stats = await get(child(dbRef, "stats"));
  const users = await get(child(dbRef, "users"));
  const betsByResult = stats.child("betsByResult");
  const lost = betsByResult.child("lost").val();
  const won = betsByResult.child("won").val();
  const past5Days = pastFiveDays();
  var newUsers = [0, 0, 0, 0, 0];
  users.forEach((user) => {
    const newuserDate = user.child("dateCreated").val();
    switch (newuserDate) {
      case past5Days[0]:
        newUsers[0] += 1;
        break;
      case past5Days[1]:
        newUsers[1] += 1;
        break;
      case past5Days[2]:
        newUsers[2] += 1;
        break;
      case past5Days[3]:
        newUsers[3] += 1;
        break;
      case past5Days[4]:
        newUsers[4] += 1;
        break;
    }
  });

  const finalStats = {
    totalUsers: stats.child("totalUsers").val(),
    activeUsers: stats.child("currentUsers").val(),
    newUsers: newUsers,
    totalBets: stats.child("totalBets").val(),
    avgBetAmount: stats.child("avgBetAmount").val(),
    betsByResult: { won: won, lost: lost },
    totalRevenue: stats.child("totalRevenue").val(),
    payouts: stats.child("payouts").val(),
    netProfit: stats.child("totalRevenue").val() - stats.child("payouts").val(),
  };
  return finalStats;
}
/**
 *
 * @returns array of report objects{id,content,userId,timestamp}
 */
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

//Helper Functions
function pastFiveDays() {
  var last5Days = [];

  var today = new Date();
  for (let i = 0; i < 5; i++) {
    today.setDate(today.getDate() - i);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;

    last5Days[i] = today;
  }
}

export { createUser, createBet, updateBet, getReports, numberUsers, getStats };
