import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import './SamgongTable.css';

import asc from './asc.png';
import puma from './puma.jpg';
import addy from './Addy.jpg';
import fakedev from './fakedev9999.jpg';

const SamgongTable = () => {
  const [players, setPlayers] = useState([
    { id: 0, name: 'Prover', chips: 1000, cards: [], active: true, image: asc },
    { id: 1, name: 'Puma', chips: 1000, cards: [], active: true , image: puma},
    { id: 2, name: 'Addy', chips: 1000, cards: [], active: true , image: addy},
    { id: 3, name: 'Fake Dev', chips: 1000, cards: [], active: true , image: fakedev},
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
    setPlayers(prevPlayers =>
      prevPlayers.map(p => ({
        ...p,
        cards: [newDeck.shift(), newDeck.shift(), newDeck.shift()],
        active: p.chips >= 50,
      }))
    );
    setGamePhase('dealing');
    setTimeout(() => setGamePhase('showdown'), 1500); // Tunggu sebelum showdown
  };

  const determineWinner = useCallback((currentPot) => {
    const activePlayers = players.filter(p => p.active);
    const scores = activePlayers.map(p => ({
      player: p,
      score: calculateScore(p.cards),
    }));

    const validScores = scores.filter(s => s.score <= 30);
    if (validScores.length === 0) {
      alert('All players bust! No winner.');
    } else {
      const winner = validScores.reduce((prev, curr) => 
        prev.score > curr.score ? prev : curr
      );
      alert(`${winner.player.name} wins with score ${winner.score}!`);
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === winner.player.id ? { ...p, chips: p.chips + currentPot } : p
        )
      );
    }
    setTimeout(() => startNewGame(), 5000); // Tunggu 5 detik sebelum game baru
  }, [players]); // Dependensi hanya players, karena pot sekarang dilewatkan sebagai argumen

  const handleBet = (amount) => {
    if (gamePhase !== 'betting') return;
    console.log('Before betting:', players);
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(p => {
        if (p.chips >= amount) {
          console.log(`Player ${p.name} betting ${amount} SUC. Chips before: ${p.chips}`);
          const updatedPlayer = { ...p, chips: p.chips - amount };
          console.log(`Player ${p.name} chips after: ${updatedPlayer.chips}`);
          return updatedPlayer;
        }
        console.log(`Player ${p.name} cannot bet ${amount} SUC. Chips: ${p.chips}`);
        return { ...p, active: false };
      });
      console.log('New players state after betting:', newPlayers);
      return newPlayers;
    });
    const activePlayerCount = players.filter(p => p.chips >= amount).length;
    const newPot = amount * activePlayerCount;
    setPot(newPot);
    dealCards();
    // Panggil determineWinner dengan pot saat ini setelah kartu dibagikan
    setTimeout(() => determineWinner(newPot), 1500); // Sinkronkan dengan showdown
  };

  const startNewGame = () => {
    setPot(0);
    setGamePhase('betting');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gamePhase === 'showdown') {
      // determineWinner dipanggil di handleBet, jadi tidak perlu di sini
    }
  }, [gamePhase, determineWinner]);

  return (
    <div className="samgong-table">
      {console.log('Rendered players:', players)}
      <div className="game-info">
        <p>Pot: {pot} SUC</p>
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
          <button onClick={() => handleBet(50)}>Bet 50 SUC</button>
          <button onClick={() => handleBet(100)}>Bet 100 SUC</button>
        </div>
      )}

      <button onClick={() => window.location.reload()} className="new-game-btn">New Game</button>
    </div>
  );
};

export default SamgongTable;