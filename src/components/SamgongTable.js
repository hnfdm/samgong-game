import React, { useState, useEffect } from 'react';
import Player from './Player';
//import Card from './Card';
import './SamgongTable.css';

const SamgongTable = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([
    { id: 0, name: 'You', chips: 1000, cards: [], active: true },
    { id: 1, name: 'NPC 1', chips: 1000, cards: [], active: true },
    { id: 2, name: 'NPC 2', chips: 1000, cards: [], active: true },
    { id: 3, name: 'NPC 3', chips: 1000, cards: [], active: true },
    //{ id: 4, name: 'NPC 4', chips: 1000, cards: [], active: true },
  ]);
  const [pot, setPot] = useState(0);
  const [gamePhase, setGamePhase] = useState('betting'); // betting, dealing, showdown

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    suits.forEach(suit => values.forEach(value => deck.push({ value, suit })));
    return shuffle(deck);
  };

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateScore = (cards) => {
    return cards.reduce((total, card) => {
      if (card.value === 'A') return total + 1;
      if (['10', 'J', 'Q', 'K'].includes(card.value)) return total + 10;
      return total + parseInt(card.value);
    }, 0);
  };

  const dealCards = () => {
    const newDeck = createDeck();
    const newPlayers = players.map(p => ({
      ...p,
      cards: [newDeck.shift(), newDeck.shift(), newDeck.shift()],
      active: p.chips >= 50,
    }));
    setPlayers(newPlayers);
    setDeck(newDeck);
    setGamePhase('dealing');
    setTimeout(() => setGamePhase('showdown'), 1500); // Tunggu sebelum showdown
  };

  const determineWinner = () => {
    const activePlayers = players.filter(p => p.active);
    const scores = activePlayers.map(p => ({
      player: p,
      score: calculateScore(p.cards),
    }));

    const validScores = scores.filter(s => s.score <= 30);
    if (validScores.length === 0) {
      alert('All players bust! No winner.');
      return;
    }

    const winner = validScores.reduce((prev, curr) => 
      prev.score > curr.score ? prev : curr
    );
    alert(`${winner.player.name} wins with score ${winner.score}!`);
    setPlayers(players.map(p => 
      p.id === winner.player.id ? { ...p, chips: p.chips + pot } : p
    ));
  };

  const handleBet = (amount) => {
    if (gamePhase !== 'betting') return;
    const newPlayers = players.map(p => {
      if (p.id === 0 && p.chips >= amount) {
        return { ...p, chips: p.chips - amount };
      }
      return p;
    });
    setPlayers(newPlayers);
    setPot(pot + amount * 5); // Semua pemain bertaruh jumlah yang sama
    dealCards();
  };

  const npcBet = () => {
    const newPlayers = players.map(p => {
      if (p.id !== 0 && p.chips >= 50) {
        return { ...p, chips: p.chips - 50 };
      }
      return p;
    });
    setPlayers(newPlayers);
    return 50 * 4; // 4 NPC bertaruh 50 masing-masing
  };

  const startNewGame = () => {
    const npcBetAmount = npcBet();
    setPot(npcBetAmount);
    setGamePhase('betting');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gamePhase === 'showdown') {
      determineWinner();
    }
  }, [gamePhase]);

  return (
    <div className="samgong-table">
      <div className="game-info">
        <p>Pot: {pot}</p>
        <p>Phase: {gamePhase}</p>
      </div>

      <div className="players">
        {players.map(player => (
          <Player
            key={player.id}
            {...player}
            isHuman={player.id === 0}
            gamePhase={gamePhase}
          />
        ))}
      </div>

      {gamePhase === 'betting' && (
        <div className="controls">
          <button onClick={() => handleBet(50)}>Bet 50</button>
          <button onClick={() => handleBet(100)}>Bet 100</button>
        </div>
      )}

      <button onClick={startNewGame} className="new-game-btn">New Game</button>
    </div>
  );
};

export default SamgongTable;