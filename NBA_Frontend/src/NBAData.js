import React, { useState, useEffect } from 'react';
import PlayersList from './components/PlayersList';
const TOTAL_BUDGET = 50000;

const NBAData = () => {
  const [bestLineup, setBestLineup] = useState(null);
  const [playerDetails, setPlayerDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [keyword, setKeyWord] = useState('');
  const [optimizeFlag, setOptimize] = useState(false);
  const [optimizePlayers, setOptimizePlayers] = useState([]);

  const fetchDailyPlayersData = async () => {
    setLoading(true);
    try {
      // const todayUpdate = await fetch('https://api.sportradar.com/nba/trial/v8/en/seasons/2024/REG/teams/583eca2f-fb46-11e1-82cb-f4ce4684ea4c/statistics.json', {
      //   method: 'GET',
      //   headers: {
      //     'accept': 'application/json',
      //     'api_key': 'YOUR_API_KEY_HERE'
      //   }
      // });
      // if (!todayUpdate.ok) throw new Error('Failed to fetch and save todayUpdate');

      const todayUpdate = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/today_update`, {
        method: 'POST', 
      });
      if (!todayUpdate.ok) throw new Error('Failed to fetch and save todayUpdate');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/player_average_data`, {
        method: 'POST', 
      });
      if (!response.ok) throw new Error('Failed to fetch and save DFS slates');
      const result = await response.json();
      setPlayerDetails(result.state);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = [...playerDetails].sort((a, b) => {
    if (a[sortConfig.key] === 'NaN') {
      a[sortConfig.key] = parseFloat(0.000).toFixed(3);
    }
    if (b[sortConfig.key] === 'NaN') {
      b[sortConfig.key] = parseFloat(0.000).toFixed(3);
    }
    if (sortConfig.key === 'No' || sortConfig.key === 'Name' || sortConfig.key === 'Position' || sortConfig.key === 'Team' || sortConfig.key === 'Opponent' || sortConfig.key === 'HomeOrAway') {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    } else {
      if (parseFloat(a[sortConfig.key]) < parseFloat(b[sortConfig.key])) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (parseFloat(a[sortConfig.key]) > parseFloat(b[sortConfig.key])) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.Name.toLowerCase().includes(keyword.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  // Helper function to filter players by Position
  const filterByPosition = (players, Position) => {
    return players.filter(player => player.Position === Position);
  };

  // Function to get all valid lineups and pick the best one
  const getBestLineup = (playersData) => {
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

  const handleOptimize = () => {
    if (optimizeFlag === false) {
      let temp_sortedData = playerDetails.map((player, idx) => {
        return {
          ID: player.ID,
          Name: player.Name, 
          Position: player.Position, 
          Team: player.Team,
          Opponent: player.Opponent,
          ProjectedMinutes: player.ProjectedMinutes,
          ProjectedFantasyPoints: player.ProjectedFantasyPoints === 'NaN' ? 0 : Number(player.ProjectedFantasyPoints),
          DKSalary: player.DKSalary,
          HomeOrAway: player.HomeOrAway,
          AvgFPPM: player.AvgFPPM,
          AvgFPPMHome: player.AvgFPPMHome,
          AvgFPPMAway: player.AvgFPPMAway,
          AvgFPPMLast5: player.AvgFPPMLast5,
          AvgFPPMOpponent: player.AvgFPPMOpponent,
          SDProjectedFPPM: player.SDProjectedFPPM,
          FantasyValue: player.FantasyValue,
        }
      });
      if(temp_sortedData.length === 0) {

      } else {
        temp_sortedData.sort((a, b) => b.ProjectedFantasyPoints - a.ProjectedFantasyPoints);
        let members = [];
        let PG_members = [];
        let SG_members = [];
        let SF_members = [];
        let PF_members = [];
        let C_members = [];
        PG_members = temp_sortedData.filter(p => p.Position === 'PG');
        SG_members = temp_sortedData.filter(p => p.Position === 'SG');
        SF_members = temp_sortedData.filter(p => p.Position === 'SF');
        PF_members = temp_sortedData.filter(p => p.Position === 'PF');
        C_members = temp_sortedData.filter(p => p.Position === 'C');
        for (let i = 0; i < 5; i++) {
          members.push(PG_members[i]);
          members.push(SG_members[i]);
          members.push(PF_members[i]);
          members.push(SF_members[i]);
          members.push(C_members[i]);
        }
        getBestLineup(members)
        if (bestLineup === null || bestLineup.length === 0) {
          return
        }
        setOptimizePlayers(bestLineup);
      }
    }
    setOptimize(!optimizeFlag);
  };

  useEffect(() => {
    fetchDailyPlayersData();
  }, []);

  return (
    <div className='flex flex-col justify-top bg-white bg-slate-100 h-screen'>
      <div className="flex pl-10 pr-10 pt-5 pb-5 fixed top-0 w-full shadow-md bg-white justify-between">
        <img
          src="/fantasylog.png"
          alt="Logo"
          className="mt-2 h-10 w-25 object-cover"
        />
        <div className="relative w-full max-w-xs">
          <input 
              type="text" 
              onChange={(e) => setKeyWord(e.target.value)}
              className="mt-1 pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Search..."
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm7-7l-3.5-3.5" />
              </svg>
          </div>
      </div>
        <button onClick={ handleOptimize } className='w-200 px-3 py-2 my-2 mx-1 text-white rounded hover:bg-teal-500' style={{backgroundColor: '#1f9cad'}}>
          {!optimizeFlag&&'Optimize'}
          {optimizeFlag&&'See All'}
        </button>
      </div>
      <div className='mt-24 flex flex-col items-center'>
        <h2 className="text-lg font-semibold mb-2">Players on {date.toDateString()}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
        <div className='flex w-full items-center overflow-x-scroll flex'>
          <table className='max-w-[100%] bg-white text-center mx-auto' style={{ border: '1px solid black' }}>
            <thead>
              <tr className='bg-gray-200'>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('No')}>No</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('Name')}>Name</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('Position')}>Position</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('Team')}>Team</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('Opponent')}>Opponent</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('DKSalary')}>DK Salary</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('HomeOrAway')}>HomeOrAway</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('AvgFPPM')}>Avg FPPM</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('AvgFPPMHome')}>Avg FPPM (Home)</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('AvgFPPMAway')}>Avg FPPM (Away)</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('AvgFPPMLast5')}>Avg FPPM (Last 5)</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('AvgFPPMOpponent')}>Avg FPPM (Opponent)</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('SDProjectedFPPM')}>SD Projected FPPM</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('ProjectedMinutes')}>Projected Minutes</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('ProjectedFantasyPoints')}>Projected Fantasy Points</th>
                <th style={{ border: '1px solid black' }} className='py-1 cursor-pointer' onClick={() => requestSort('FantasyValue')}>Fantasy Value</th>
              </tr>
            </thead>
            { optimizeFlag === false ? 
              <PlayersList players = { filteredData }/>
              :
              <PlayersList players = { optimizePlayers }/>
            }
          </table>
        </div>
        )}
      </div>
    </div> 
  );
};

export default NBAData;
