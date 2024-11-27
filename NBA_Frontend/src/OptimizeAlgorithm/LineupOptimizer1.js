  const sortByValue = (players) => {
    return players.sort((a, b) => (b.ProjectedFantasyPoints / b.DKSalary) - (a.ProjectedFantasyPoints / a.DKSalary));
  }
  
  const constructOptimalLineup = (players) => {
    const salaryCap = 50000;
    const lineup = [];
    let totalSalary = 0;
    let totalPoints = 0;
  
    const grouped = {
      PG: players.filter(p => p.Position === 'PG'),
      SG: players.filter(p => p.Position === 'SG'),
      SF: players.filter(p => p.Position === 'SF'),
      PF: players.filter(p => p.Position === 'PF'),
      C: players.filter(p => p.Position === 'C')
    };
  
    const tryAddPlayer = (player) => {
      if (totalSalary + player.DKSalary <= salaryCap) {
        lineup.push(player);
        totalSalary += player.DKSalary;
        totalPoints += player.ProjectedFantasyPoints;
        return true;
      }
      return false;
    }
  
    tryAddPlayer(grouped.PG[0]);
    tryAddPlayer(grouped.SG[0]);
    tryAddPlayer(grouped.SF[0]);
    tryAddPlayer(grouped.PF[0]);
    tryAddPlayer(grouped.C[0]);
  
    tryAddPlayer([...grouped.PG, ...grouped.SG][1]);
    tryAddPlayer([...grouped.SF, ...grouped.PF][1]);
    tryAddPlayer(players[6]); // any top available player
    
    if (lineup.length === 8) {
      return { lineup, totalSalary, totalPoints };
    }
    return null;
  }
  
  const getBestLineup = (players) => {
    const sortedPlayers = sortByValue(players);
    return constructOptimalLineup(sortedPlayers);
  }
  
  // Example usage
  const bestLineup = getBestLineup(players);
  console.log("Best Lineup:", bestLineup.lineup);
  console.log("Total Salary:", bestLineup.totalSalary);
  console.log("Total Projected Points:", bestLineup.totalPoints);