import React from 'react';

const PlayersList = (props) => {

  return (
      <tbody>
      { props.players !== null && props.players.length > 0 ? props.players.map((player, index) => (
          <tr key={index} className='border' style={{ border: '1px solid black' }}>
            <td style={{ border: '1px solid black' }} className='py-1'>{index + 1}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.Name}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.Position}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.Team}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.Opponent !== 'NaN' ? player.Opponent : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.DKSalary !== 'NaN' ? player.DKSalary : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.HomeOrAway !== 'NaN' ? player.HomeOrAway : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.AvgFPPM !== 'NaN' ? player.AvgFPPM : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.AvgFPPMHome !== 'NaN' ? player.AvgFPPMHome : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.AvgFPPMAway !== 'NaN' ? player.AvgFPPMAway : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.AvgFPPMLast5 !== 'NaN' ? player.AvgFPPMLast5 : parseFloat(0.000).toFixed(3)}</td>  
            <td style={{ border: '1px solid black' }} className='py-1'>{player.AvgFPPMOpponent !== 'NaN' ? player.AvgFPPMOpponent : parseFloat(0.000).toFixed(3)}</td>           
            <td style={{ border: '1px solid black' }} className='py-1'>{player.SDProjectedFPPM !== 'NaN' ? player.SDProjectedFPPM : parseFloat(0.000).toFixed(3)}</td> 
            <td style={{ border: '1px solid black' }} className='py-1'>{player.ProjectedMinutes!== 'NaN' ? player.ProjectedMinutes : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.ProjectedFantasyPoints !== 'NaN' ? player.ProjectedFantasyPoints : parseFloat(0.000).toFixed(3)}</td>
            <td style={{ border: '1px solid black' }} className='py-1'>{player.FantasyValue!== 'NaN' ? player.FantasyValue : parseFloat(0.000).toFixed(3)}</td> 
          </tr>
        )) : (
          <tr>
            <td colSpan='16' className='py-1' style={{ border: '1px solid black' }}>No players found</td>
          </tr>
          )
        }
      </tbody>
  );
};

export default PlayersList;
