import React from 'react';
import Card from './Card';

const Player = ({ name, chips, cards, active, isHuman, gamePhase, image }) => {
  const score = cards.reduce((total, card) => {
    if (card.value === 'A') return total + 1;
    if (['10', 'J', 'Q', 'K'].includes(card.value)) return total + 10;
    return total + parseInt(card.value);
  }, 0);

  return (
    <div
      className="player"
      style={{
        backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        opacity: active ? 1 : 0.5,
      }}
    >
      <img src={image} alt={`${name}'s avatar`} className="player-image" />
      <h3>{name}</h3>
      <p>{chips} SUC</p>
      <p>Score: {gamePhase === 'showdown' ? score : '?'}</p>
      <div className="cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            suit={card.suit}
            hidden={!isHuman && gamePhase !== 'showdown'}
            animationDelay={index * 0.2}
          />
        ))}
      </div>
    </div>
  );
};

export default Player;