import React, { useState } from 'react';

const players = [
  { ID: 1, Name: 'Player 1', Position: 'PG', DKSalary: 100, ProjectedFantasyPoints: 50 },
  { ID: 2, Name: 'Player 2', Position: 'SG', DKSalary: 8500, ProjectedFantasyPoints: 45 },
  { ID: 3, Name: 'Player 3', Position: 'SF', DKSalary: 900, ProjectedFantasyPoints: 40 },
  { ID: 4, Name: 'Player 4', Position: 'PF', DKSalary: 9500, ProjectedFantasyPoints: 42 },
  { ID: 5, Name: 'Player 5', Position: 'C', DKSalary: 800, ProjectedFantasyPoints: 55 },
  { ID: 6, Name: 'Player 6', Position: 'PG', DKSalary: 12000, ProjectedFantasyPoints: 60 },
  { ID: 7, Name: 'Player 7', Position: 'SG', DKSalary: 700, ProjectedFantasyPoints: 48 },
  { ID: 8, Name: 'Player 8', Position: 'SF', DKSalary: 7000, ProjectedFantasyPoints: 38 },
  { ID: 9, Name: 'Player 9', Position: 'PF', DKSalary: 700, ProjectedFantasyPoints: 39 },
  { ID: 10, Name: 'Player 10', Position: 'C', DKSalary: 700, ProjectedFantasyPoints: 49 },
];

const MAX_BUDGET = 50000;

const LineupOptimizer = () => {
  const [bestLineup, setBestLineup] = useState([]);
  const [maxPoints, setMaxPoints] = useState(0);

  const PositionsRequired = {
    PG: 1,
    SG: 1,
    SF: 1,
    PF: 1,
    C: 1,
    PGorSG: 1,
    SForPF: 1,
    Any: 1,
  };

  const findBestLineup = (players, budget, Positions) => {
    const lineup = [];
    const used = new Set();

    const backtrack = (index, currentBudget, currentPoints, currentPositions) => {
      if (lineup.length === 8) {
        if (currentPoints > maxPoints) {
          setMaxPoints(currentPoints);
          setBestLineup([...lineup]);
        }
        return;
      }

      for (let i = index; i < players.length; i++) {
        const player = players[i];

        if (currentBudget >= player.DKSalary && !used.has(player.ID)) {
          lineup.push(player);
          used.add(player.ID);
          currentBudget -= player.DKSalary;
          currentPoints += player.ProjectedFantasyPoints;

          const Position = player.Position;
          if (currentPositions[Position] < PositionsRequired[Position]) {
            currentPositions[Position]++;
          } else if (Position === 'PG' || Position === 'SG') {
            currentPositions.PGorSG++;
          } else if (Position === 'SF' || Position === 'PF') {
            currentPositions.SForPF++;
          } else {
            currentPositions.Any++;
          }

          backtrack(i + 1, currentBudget, currentPoints, currentPositions);

          currentBudget += player.DKSalary;
          currentPoints -= player.ProjectedFantasyPoints;
          lineup.pop();
          used.delete(player.ID);

          if (currentPositions[Position] > 0) {
            currentPositions[Position]--;
          } else if (Position === 'PG' || Position === 'SG') {
            currentPositions.PGorSG--;
          } else if (Position === 'SF' || Position === 'PF') {
            currentPositions.SForPF--;
          } else {
            currentPositions.Any--;
          }
        }
      }
    };

    backtrack(0, budget, 0, { ...Positions });
  };

  const handleOptimize = () => {
    findBestLineup(players, MAX_BUDGET, PositionsRequired);
  };

  return (
    <div>
      <h2>NBA Lineup Optimizer</h2>
      <button onClick={handleOptimize}>Optimize Lineup</button>
      <h3>Best Lineup (Max Points: {maxPoints})</h3>
      <ul>
        {bestLineup.map(player => (
          <li key={player.ID}>
            {player.Name} - {player.Position} - ${player.DKSalary} - {player.ProjectedFantasyPoints} FP
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineupOptimizer;