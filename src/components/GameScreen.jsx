import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const GameScreen = ({ playerNames }) => {
  const [players, setPlayers] = useState(
    playerNames.map((name) => ({ name, points: [0] }))
  );
  
  var allPointsValue=0 // for checking no change with prev values
  const [newPoints, setNewPoints] = useState(Array(playerNames.length).fill(""));
const [stat,setStat]= useState(false);
  const validatePoints = (value) => {
    const number = Number(value);
    return !isNaN(number) && number >= 0; // تحقق من أن الرقم صالح
  };

  const handleAddPoints = async () => {
    allPointsValue=newPoints.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      "",
    );
    allPointsValue.forEach((point)=>{
if (point>=1) {setStat(true)}
})
    if (allPointsValue===0 || stat === false) {return null};
    const updatedPlayers = players.map((player, index) => {
      const pointsToAdd = validatePoints(newPoints[index]) ? Number(newPoints[index]) : 0;
      return { ...player, points: [...player.points, player.points[player.points.length - 1] + pointsToAdd] };
    });
    setNewPoints(Array(playerNames.length).fill(""));
    setPlayers(updatedPlayers);
    setStat(false)

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

