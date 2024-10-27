import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const GameScreen = ({ playerNames }) => {
  const [players, setPlayers] = useState(
    playerNames.map((name) => ({ name, points: [0] }))
  );
  
  var allPointsValue=0 // for checking no change with prev values
  const [newPoints, setNewPoints] = useState(Array(playerNames.length).fill(0));

  const validatePoints = (value) => {
    const number = Number(value);
    return !isNaN(number) && number >= 0; // تحقق من أن الرقم صالح
  };

  const handleAddPoints = async () => {
    allPointsValue=newPoints.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    console.log(allPointsValue)
    if (allPointsValue===0 ) {return null};
    const updatedPlayers = players.map((player, index) => {
      const pointsToAdd = validatePoints(newPoints[index]) ? Number(newPoints[index]) : 0;
      return { ...player, points: [...player.points, player.points[player.points.length - 1] + pointsToAdd] };
    });
    setNewPoints(Array(playerNames.length).fill(""));
    setPlayers(updatedPlayers);

    try {
      await Promise.all(
        updatedPlayers.map((player) =>
          supabase
            .from('scores')
            .update({ points: player.points[player.points.length - 1] })
            .eq('player_name', player.name)
        )
      );
    } catch (error) {
      console.error("Error updating scores:", error.message);
    }

    
  };

  const handlePointChange = (index, value) => {
    const updatedPoints = [...newPoints];
    updatedPoints[index] = validatePoints(value) ? value :0;
    setNewPoints(updatedPoints);
  };

  const handleResetScores = () => {
    setPlayers(players.map((player) => ({ ...player, points: [0] })));
    setNewPoints(Array(playerNames.length).fill(""));
  };

  const getPlayerColor = (points) => {
    const highestScore = Math.max(...players.map(player => player.points[player.points.length - 1]));
    const lowestScore = Math.min(...players.map(player => player.points[player.points.length - 1]));

    if (points === highestScore) {
      return 'bg-red-600'; // اللون الأحمر
    } else if (points === lowestScore) {
      return 'bg-green-700'; // اللون الأخضر
    } else {
      return 'bg-gray-700'; // اللون الرمادي
    }
  };

  return (
    <div className="mt-4 px-8 w-screen">
      <h2 className="text-xl font-semibold mb-10">Game Scoreboard</h2>
      <div className=" overflow-y-scroll w-full max-h-[65vw]">
        <div className="flex justify-between text-lg font-bold">
          {players.map((player, index) => (
            <div key={index} className="flex-1 text-center ">{player.name}</div>
          ))}
        </div>
        {players[0].points.map((_, roundIndex) => (
          <div key={roundIndex} className="flex  justify-between">
            {players.map((player, playerIndex) => (
              <div key={playerIndex} className={`flex-1 text-center rounded mx-1 text-lg ${(roundIndex===players[0].points.length-1) && getPlayerColor(player.points[roundIndex])}`}>
                {player.points[roundIndex]}
              </div>
            ))}
          </div>
        ))}
      
      </div>
          <div className="flex justify-around  overflow-x-scroll pt-5 gap-5 px-2 ">
          {players.map((_, index) => (
            <input
              key={index}
              type="number"
              className={` p-1 w-14  bg-gray-700 border  border-gray-300 rounded  text-center`}
              placeholder="points"
              value={newPoints[index]}
              onChange={(e) => handlePointChange(index, e.target.value)}
            />
          ))}
        </div>
      

      <div className="mt-14 flex justify-center ">
        <button onClick={handleAddPoints} className="mr-2 p-2 bg-blue-500 rounded hover:bg-blue-600">
          Add Points
        </button>
        <button onClick={handleResetScores} className="p-2 bg-gray-500 rounded hover:bg-gray-600">
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
