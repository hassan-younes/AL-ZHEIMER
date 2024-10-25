import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const PlayerInput = ({ onPlayersUpdated,setNumPlayers, setStep,numPlayers, onGameStart }) => {
  const [inputName, setInputName] = useState('');
  const [playerNames, setPlayerNames] = useState([]);

  const handleAddPlayer = async () => {
    if (inputName && !playerNames.includes(inputName) && playerNames.length < numPlayers) {
      const { data, error } = await supabase.from('scores').insert([{ player_name: inputName }]);
      if (!error) {
        const updatedNames = [...playerNames, inputName];
        setPlayerNames(updatedNames);
        onPlayersUpdated(updatedNames); // تحديث قائمة اللاعبين في الأب
        setInputName(''); // تفريغ حقل الإدخال
      } else {
        console.error(error);
      }
    }
  };

  const handleNewGame = async () => {
    // حذف اللاعبين من قاعدة البيانات
    await supabase.from('scores').delete().neq('player_name', null);
    setPlayerNames([]); // إعادة تعيين حالة الأسماء
    onPlayersUpdated([]); // تحديث قائمة اللاعبين في الأب
    setNumPlayers(0);
    setStep(1);
};

  const handleStartGame = () => {
    if (playerNames.length === numPlayers) {
      onGameStart(); // بدء اللعبة
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 mt-0">
      {playerNames.length > 0 && (
        <div className="mb-10 flex flex-col  items-center ">
          <h3 className="text-2xl font-bold mb-7">Players:</h3>
       
            <div className='flex justify-center flex-wrap gap-4 w-screen px-3'>
            {playerNames.map((name, index) => (
              <p className='bg-pink-950 rounded-[50%]  justify-center  flex items-center  aspect-square  min-w-14' key={index} >{name}</p>
            ))}
            </div>
         
        </div>
      )}
     {(playerNames.length!==numPlayers )&&(
      <>
      <h2 className="text-2xl font-bold mb-4">Enter Player Names</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="p-2 border bg-gray-800 border-gray-300 rounded " // تغيير لون النص إلى الأسود
          placeholder="Enter player name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <button onClick={handleAddPlayer} className="ml-2 p-2 bg-teal-950 rounded hover:bg-teal-800">
          Add Player
        </button>
      </div>
          </>
      )}
      <div className='flex gap-3'>

      {playerNames.length === numPlayers && ( // إظهار زر البدء فقط عند إدخال جميع الأسماء
        <button onClick={handleStartGame} className="mt-4 p-2 bg-green-950 rounded hover:bg-green-700">
          Start Game
        </button>
      )}
      <button onClick={handleNewGame} className="mt-4 p-2 bg-indigo-950 rounded hover:bg-indigo-500">
        New Game
      </button>
      </div>
      
    </div>
  );
};

export default PlayerInput;
