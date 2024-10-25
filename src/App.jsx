import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import GameScreen from './components/GameScreen';
import PlayerInput from './components/PlayerInput';

const App = () => {
  const [playerNames, setPlayerNames] = useState([]);
  const [numPlayers, setNumPlayers] = useState('');
  const [step, setStep] = useState(1); // لتحديد الخطوة الحالية

  const fetchPlayerNames = async () => {
    const { data } = await supabase.from('scores').select('player_name');
    if (data) {
      setPlayerNames(data.map(player => player.player_name));
    }
  };

  useEffect(() => {
    fetchPlayerNames();
  }, []);

  const handleNumPlayersChange = (e) => {
    const value = e.target.value;
    // التحقق مما إذا كان الإدخال رقميًا أو فارغًا
    if (/^\d*$/.test(value)) {
      setNumPlayers(value); // تعيين القيمة إذا كانت رقمًا
    }
  };

  const handleStartGame = () => {
    if (numPlayers > 0) {
      setStep(2); // الانتقال إلى خطوة إدخال أسماء اللاعبين
    }
  };

  return (
    <div className=" bg-gray-900 text-gray-300  overflow-x-hidden">
      <div className='max-w-[100vw] mx-auto  flex flex-col   font-display text-center  h-screen'>
        <div className='mt-10 mb-14   flex flex-col w-full items-center text-center'>
            <a href="https://al-zheimer.vercel.app/">

          <h1 className="text-3xl hover:text-fuchsia-400 text-fuchsia-600 font-bold ">AL-Zhaimer Game</h1>
            </a>
      
        </div>
        {step === 1 && (
        <div className="flex flex-col w-full px-8 items-center mb-4 mt-0">
            <h2 className="text-2xl font-bold mb-4">Enter Number of Players</h2>
            <div className='flex w-full h-12 justify-center gap-5 '>
                  
                <input
                  type="text" // تغيير نوع الإدخال إلى نص
                  className="p-2 border border-gray-300 rounded mb-4 w-[55%] h-full bg-gray-800" // لون النص أسود
                  placeholder="Number of players"
                  value={numPlayers}
                  onChange={handleNumPlayersChange}
                  />
                <button onClick={handleStartGame} className=" bg-teal-950 h-full w-auto rounded px-3 hover:bg-teal-800">
                  Start Game
                </button>
            </div>
        </div>
        )}
        {(step === 2 && (parseInt(numPlayers, 10) || 0)!==0) &&   (
          <PlayerInput 
            onPlayersUpdated={setPlayerNames} 
            numPlayers={parseInt(numPlayers, 10) || 0} // تحويل الرقم إلى عدد صحيح
            onGameStart={() => setStep(3)} // بدء اللعبة
            setNumPlayers={setNumPlayers}
            setStep={setStep}
          />
        )}
        {step === 3 && playerNames.length > 0 && <GameScreen playerNames={playerNames} />}
        <div className='bg-gray-800 mt-auto border-rad text-center h-14  text-sm flex items-center justify-center  '>
        <p>MADE WITH ❤️ BY HASSAN YOUNES</p>
  </div>
      </div>

    </div>
  );
  
};

export default App;
