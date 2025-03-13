import React from 'react';

const Card = ({ value, suit, hidden, animationDelay = 0 }) => {
  const cardColor = suit === '♥' || suit === '♦' ? 'red' : 'black';
  return (
    <div
      className={`card ${hidden ? 'hidden' : ''}`}
      style={{ color: hidden ? 'white' : cardColor, animationDelay: `${animationDelay}s` }}
    >
      {hidden ? '?' : `${value}${suit}`}
    </div>
  );
};

export default Card;