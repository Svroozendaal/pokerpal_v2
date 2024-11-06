import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([{ name: '', startStack: '', endStack: '' }]);
  const [coinValue, setCoinValue] = useState('');
  const [buyInValue, setBuyInValue] = useState('');
  const [results, setResults] = useState([]);
  const [potValue, setPotValue] = useState(0);
  const [discrepancy, setDiscrepancy] = useState(0);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);

  const [totalStartingStack, setTotalStartingStack] = useState(0);
  const [totalEndingStack, setTotalEndingStack] = useState(0);

  useEffect(() => {
    const totalStarting = players.reduce((acc, player) => acc + (parseFloat(player.startStack) || 0), 0);
    const totalEnding = players.reduce((acc, player) => acc + (parseFloat(player.endStack) || 0), 0);
    setTotalStartingStack(totalStarting);
    setTotalEndingStack(totalEnding);
  }, [players]);

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: '', startStack: buyInValue, endStack: '' }]);
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const checkStackDiscrepancy = () => {
    const discrepancy = totalStartingStack - totalEndingStack;
    if (discrepancy !== 0) {
      setDiscrepancy(discrepancy * coinValue);
      setShowDiscrepancyModal(true);
      return true;
    }
    return false;
  };

  const calculatePayouts = () => {
    if (checkStackDiscrepancy()) return;

    const totalPot = totalEndingStack * coinValue;
    setPotValue(totalPot);

    const playerResults = players.map(player => {
      const startingValue = player.startStack * coinValue;
      const endingValue = player.endStack * coinValue;
      const result = endingValue - startingValue
      return { ...player, startingValue, endingValue, result};
    });

    const payouts = [];
    const winners = playerResults.filter(player => player.result > 0);
    const losers = playerResults.filter(player => player.result < 0);

    winners.forEach(winner => {
      losers.forEach(loser => {
        const amountToPay = Math.min(winner.result, Math.abs(loser.result));
        if (amountToPay > 0) {
          payouts.push(`${loser.name} should pay ${winner.name} €${amountToPay.toFixed(2)}`);
          winner.result -= amountToPay;
          loser.result += amountToPay;
        }
      });
    });

    setResults({ playerResults, payouts });
  };

  return (
    <div className="App">

      <div className="content-box">
        <h1>Poker Score Calculator</h1>
        <p>Enter player details, coin value, and starting/ending stacks to calculate payouts.</p>

        <div className="setup">
          <input
            type="number"
            placeholder="Coin Value (€)"
            value={coinValue}
            onChange={(e) => setCoinValue(parseFloat(e.target.value))}
          />
          <input
            type="number"
            placeholder="Buy-in Value (chips)"
            value={buyInValue}
            onChange={(e) => setBuyInValue(parseFloat(e.target.value))}
          />
        </div>

        <h2>Players</h2>
        <div className="player-input headers">
          <span>Name</span>
          <span>Starting Stack</span>
          <span>Ending Stack</span>
          <div className="col10"></div>
        </div>

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
              step={buyInValue}
              onChange={(e) => handlePlayerChange(index, 'startStack', parseFloat(e.target.value))}
            />
            <input
              type="number"
              placeholder="Ending Stack"
              value={player.endStack}
              step={buyInValue}
              onChange={(e) => handlePlayerChange(index, 'endStack', parseFloat(e.target.value))}
            />
            <button onClick={() => removePlayer(index)} className="remove-button">X</button>
          </div>
        ))}

        <button onClick={addPlayer}>Add Player</button>

        <div className="total-stack-display">
          <p>Total Starting Pot: {totalStartingStack}</p>
          <p>Total Ending Pot: {totalEndingStack}</p>
        </div>

        <button onClick={calculatePayouts}>Calculate</button>

        <div className="results-box">
          <h2>Results</h2>
          {results.playerResults && (
            <div>
              <h3>Total Pot Value: €{potValue.toFixed(2)}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Starting (€)</th>
                    <th>Ending (€)</th>
                    <th>Result (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.playerResults.map((player, index) => (
                    <tr key={index}>
                      <td>{player.name}</td>
                      <td>{player.startingValue.toFixed(2)}</td>
                      <td>{player.endingValue.toFixed(2)}</td>
                      <td>{player.result.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Payouts</h3>
              {results.payouts.length > 0 ? (
                results.payouts.map((payout, index) => <p key={index}>{payout}</p>)
              ) : (
                <p>No payouts necessary.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showDiscrepancyModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              The starting and ending stacks are not equal. 
              Discrepancy: €{Math.abs(discrepancy).toFixed(2)}. Adjust values before calculating.
            </p>
            <button onClick={() => setShowDiscrepancyModal(false)}>OK, Adjust Values</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
