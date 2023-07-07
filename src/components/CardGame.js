/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Suit = {
  Spades: 1,
  Hearts: 2,
  Diamonds: 3,
  Clubs: 4,
};

const Card = ({ rank, suit }) => {
  return <div>{`${rank} ${suit}`}</div>;
};

const Deck = () => {
  const [cards, setCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  const initializeDeck = () => {
    const newCards = [];
    for (let rank = 1; rank <= 13; rank++) {
      for (let suit in Suit) {
        newCards.push({ rank, suit: Suit[suit] });
      }
    }
    setCards(newCards);
    setDiscardPile([]);
  };

  const shuffle = () => {
    // Shuffle the cards
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    setCards(shuffledCards);
  };

  const deal = () => {
    if (cards.length === 0) {
      setCards(discardPile);
      setDiscardPile([]);
      shuffle();
    }
    const card = cards.pop();
    return card;
  };

  const discard = (card) => {
    setDiscardPile((prevDiscardPile) => [...prevDiscardPile, card]);
  };

  return (
    <div>
      <h3>Deck</h3>
      <button onClick={initializeDeck}>Initialize Deck</button>
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={() => discard(cards[cards.length - 1])}>Discard Top Card</button>
      <div>
        <h4>Cards:</h4>
        {cards.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} />
        ))}
      </div>
      <div>
        <h4>Discard Pile:</h4>
        {discardPile.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} />
        ))}
      </div>
    </div>
  );
};

const Player = ({ name }) => {
  const [score, setScore] = useState(0);
  const [hand, setHand] = useState([]);

  const addPoint = () => {
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <div>
      <h3>{name}</h3>
      <p>Score: {score}</p>
      {/!* Render player's hand *!/}
      {hand.map((card, index) => (
        <Card key={index} rank={card.rank} suit={card.suit} />
      ))}
    </div>
  );
};

const Score = () => {
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const updateScore = (player) => {
    setScores((prevScores) => ({
      ...prevScores,
      [player]: prevScores[player] + 1,
    }));
  };

  const getScore = (player) => {
    return scores[player];
  };

  return (
    <div>
      {/!* Render scores *!/}
      <p>Player 1: {getScore('player1')}</p>
      <p>Player 2: {getScore('player2')}</p>
    </div>
  );
};

const CardGame = () => {
  const [playing, setPlaying] = useState(true);
  const navigate = useNavigate();

  const handleNextGame = (playNext) => {
    if (!playNext) {
      navigate('/menu');
    } else {
      // Reset game state and deal new cards
      // ...
    }
  };

  return (
    <div>
      <h1>Card Game</h1>
      {/!* Render game components *!/}
      {playing ? (
        <>
          <Deck />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table>
              <thead>
                <tr>
                  <th>Player 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Player name="Player 1" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Player 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Player name="Player 2" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Dealer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Player name="Dealer" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Score />
          <button onClick={() => handleNextGame(true)}>Next Game</button>
          <button onClick={() => handleNextGame(false)}>Quit</button>
        </>
      ) : (
        <p>Game Ended</p>
      )}
    </div>
  );
};

export default CardGame;*/
