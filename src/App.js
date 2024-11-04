import React, { useState } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([{ name: '', startStack: '', endStack: '' }]);
  const [coinValue, setCoinValue] = useState('');
  const [results, setResults] = useState([]);

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: '', startStack: '', endStack: '' }]);
  };

  const calculatePayouts = () => {
    const payouts = [];
    const totalGain = players.reduce((acc, player) => acc + (player.endStack - player.startStack), 0);
    
    players.forEach(winner => {
      if (winner.endStack > winner.startStack) {
        players.forEach(loser => {
          if (loser.endStack < loser.startStack) {
            const amountToPay = Math.min(
              winner.endStack - winner.startStack,
              loser.startStack - loser.endStack
            ) * coinValue;
            if (amountToPay > 0) {
              payouts.push(`${loser.name} should pay ${winner.name} €${amountToPay.toFixed(2)}`);
            }
          }
        });
      }
    });
    setResults(payouts);
  };

  return (
    <div className="App">
      <div className="content-box">
        <h1>Poker Score Calculator</h1>
        <p>This app helps you calculate final scores in a game of poker. Enter player names, their starting and ending stacks, and the coin value to see who should pay whom.</p>
        
        <div className="form-box">
          <h2>Enter Players</h2>
          {players.map((player, index) => (
            <div key={index} className="player-input">
              <input
                type="text"
                placeholder="Name"
                value={player.name}
                onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Starting Stack"
                value={player.startStack}
                onChange={(e) => handlePlayerChange(index, 'startStack', parseFloat(e.target.value))}
              />
              <input
                type="number"
                placeholder="Ending Stack"
                value={player.endStack}
                onChange={(e) => handlePlayerChange(index, 'endStack', parseFloat(e.target.value))}
              />
            </div>
          ))}
          <button onClick={addPlayer}>Add Player</button>
          <div className="coin-value-input">
            <input
              type="number"
              placeholder="Coin Value (€)"
              value={coinValue}
              onChange={(e) => setCoinValue(parseFloat(e.target.value))}
            />
          </div>
          <button onClick={calculatePayouts}>Calculate</button>
        </div>

        <div className="results-box">
          <h2>Results</h2>
          {results.length > 0 ? (
            results.map((result, index) => <p key={index}>{result}</p>)
          ) : (
            <p>No results to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
