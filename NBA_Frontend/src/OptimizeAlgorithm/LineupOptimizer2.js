  const sortByValue = (players) => {
    return players.sort((a, b) => (b.ProjectedFantasyPoints / b.DKSalary) - (a.ProjectedFantasyPoints / a.DKSalary));
  }
  
   const buildBestLineup = (groups, lineup = [], totalSalary = 0, totalPoints = 0, index = 0, bestLineup = { lineup: [], points: 0 }) => {
    if (lineup.length === 8) {
      if (totalPoints > bestLineup.points && totalSalary <= 50000) {
        bestLineup.lineup = [...lineup];
        bestLineup.points = totalPoints;
      }
      return bestLineup;
    }
  
    for (let i = 0; i < groups[index].length; i++) {
      const player = groups[index][i];
      if (totalSalary + player.DKSalary > 50000) continue;
      lineup.push(player);
      buildBestLineup(groups, lineup, totalSalary + player.DKSalary, totalPoints + player.ProjectedFantasyPoints, index + 1, bestLineup);
      lineup.pop();
    }
    
    return bestLineup;
  }
  
  const getOptimalLineup = (players) => {
    const sortedPlayers = sortByValue(players);
  
    const groups = {
      PG: sortedPlayers.filter(p => p.Position === 'PG'),
      SG: sortedPlayers.filter(p => p.Position === 'SG'),
      SF: sortedPlayers.filter(p => p.Position === 'SF'),
      PF: sortedPlayers.filter(p => p.Position === 'PF'),
      C: sortedPlayers.filter(p => p.Position === 'C')
    };
  
    const lineupGroups = [
      groups.PG,           // 1 PG
      groups.SG,           // 1 SG
      groups.SF,           // 1 SF
      groups.PF,           // 1 PF
      groups.C,            // 1 C
      [...groups.PG, ...groups.SG],  // 1 G (either PG or SG)
      [...groups.SF, ...groups.PF],  // 1 F (either SF or PF)
      sortedPlayers        // 1 UTIL (any Position)
    ];
  
    const bestLineup = buildBestLineup(lineupGroups);
  
    return bestLineup;
  }
  
  const optimalLineup = getOptimalLineup(players);
  console.log("Best Lineup:", optimalLineup.lineup);
  console.log("Total Salary:", optimalLineup.lineup.reduce((sum, p) => sum + p.DKSalary, 0));
  console.log("Total Projected Points:", optimalLineup.points);