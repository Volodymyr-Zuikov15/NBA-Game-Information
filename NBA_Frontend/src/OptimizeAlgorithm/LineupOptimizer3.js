import React, { useState } from 'react';

// Sample data structure for players (in reality, you'd get this data from an API or static file)
const playersData = [
  { ID: 1, Position: 'PG', DKSalary: 8000, ProjectedFantasyPoints: 40 },
  { ID: 2, Position: 'SG', DKSalary: 7800, ProjectedFantasyPoints: 38 },
  { ID: 3, Position: 'SF', DKSalary: 7600, ProjectedFantasyPoints: 36 },
  { ID: 4, Position: 'PF', DKSalary: 8200, ProjectedFantasyPoints: 42 },
  { ID: 5, Position: 'C', DKSalary: 8500, ProjectedFantasyPoints: 44 },
  // ... add more player data
];

// Budget and lineup constraints
const TOTAL_BUDGET = 50000;

const FantasyOptimizer = () => {
  const [bestLineup, setBestLineup] = useState(null);

  // Helper function to filter players by Position
  const filterByPosition = (players, Position) => {
    return players.filter(player => player.Position === Position);
  };

  // Function to get all valid lineups and pick the best one
  const getBestLineup = () => {
    const PGs = filterByPosition(playersData, 'PG');
    const SGs = filterByPosition(playersData, 'SG');
    const SFs = filterByPosition(playersData, 'SF');
    const PFs = filterByPosition(playersData, 'PF');
    const Cs = filterByPosition(playersData, 'C');
    
    let bestScore = 0;
    let bestCombination = null;

    // Loop through each possible combination of players to form a lineup
    PGs.forEach(pg => {
      SGs.forEach(sg => {
        SFs.forEach(sf => {
          PFs.forEach(pf => {
            Cs.forEach(c => {
              // Choose an additional player who can be either PG or SG
              const pgOrSgOptions = [...PGs, ...SGs].filter(p => p.ID !== pg.ID && p.ID !== sg.ID);
              pgOrSgOptions.forEach(pgOrSg => {
                // Choose an additional player who can be either SF or PF
                const sfOrPfOptions = [...SFs, ...PFs].filter(p => p.ID !== sf.ID && p.ID !== pf.ID);
                sfOrPfOptions.forEach(sfOrPf => {
                  // Choose any other player for the final slot
                  const remainingPlayers = playersData.filter(p => 
                    p.ID !== pg.ID && p.ID !== sg.ID && p.ID !== sf.ID && p.ID !== pf.ID &&
                    p.ID !== c.ID && p.ID !== pgOrSg.ID && p.ID !== sfOrPf.ID
                  );

                  remainingPlayers.forEach(anyOther => {
                    const lineup = [pg, sg, sf, pf, c, pgOrSg, sfOrPf, anyOther];
                    const totalSalary = lineup.reduce((sum, player) => sum + player.DKSalary, 0);
                    const totalFantasyPoints = lineup.reduce((sum, player) => sum + player.ProjectedFantasyPoints, 0);

                    if (totalSalary <= TOTAL_BUDGET && totalFantasyPoints > bestScore) {
                      bestScore = totalFantasyPoints;
                      bestCombination = lineup;
                    }
                  });
                });
              });
            });
          });
        });
      });
    });

    setBestLineup(bestCombination);
  };

  return (
    <div>
      <h1>NBA Fantasy Lineup Optimizer</h1>
      <button onClick={getBestLineup}>Generate Best Lineup</button>
      
      {bestLineup ? (
        <div>
          <h2>Best Lineup</h2>
          <ul>
            {bestLineup.map(player => (
              <li key={player.ID}>
                {player.Position} - ${player.DKSalary} - {player.ProjectedFantasyPoints} points
              </li>
            ))}
          </ul>
          <p>
            Total Fantasy Points: {bestLineup.reduce((sum, player) => sum + player.ProjectedFantasyPoints, 0)}
          </p>
          <p>Total Salary: ${bestLineup.reduce((sum, player) => sum + player.DKSalary, 0)}</p>
        </div>
      ) : (
        <p>No lineup generated yet</p>
      )}
    </div>
  );
};

export default FantasyOptimizer;