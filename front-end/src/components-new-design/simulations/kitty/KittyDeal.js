import { useEffect, useRef, useState } from 'react';
import Deck from '../../../simulation-logic/kitty/Deck';
import solveKitty from '../../../simulation-logic/kitty/KittySolver';

const SUIT_SYMBOLS = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const PlayingCard = ({ card, cardIndex, compact = false }) => (
  <article className={`kitty-playing-card ${card.isRed ? 'red' : ''} ${compact ? 'compact' : ''}`} aria-label={cardIndex ? `Card ${cardIndex}: ${card.rank} of ${card.suit}` : `${card.rank} of ${card.suit}`}>
    {cardIndex && <span className="kitty-card-index">{cardIndex}</span>}
    <div className="kitty-card-corner">
      <strong>{card.rank}</strong>
      <span>{SUIT_SYMBOLS[card.suit]}</span>
    </div>
    <span className="kitty-card-suit">{SUIT_SYMBOLS[card.suit]}</span>
    <div className="kitty-card-corner bottom">
      <strong>{card.rank}</strong>
      <span>{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  </article>
);

export default function KittyDeal() {
  const [dealNumber, setDealNumber] = useState(0);
  const [dealtCards, setDealtCards] = useState([]);
  const [phase, setPhase] = useState('shuffling');
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [handWeights, setHandWeights] = useState([5, 3, 1]);
  const handWeightsRef = useRef(handWeights);

  const changeHandWeight = (handIndex, value) => {
    const nextWeights = handWeights.map((weight, index) => index === handIndex ? Number(value) : weight);
    handWeightsRef.current = nextWeights;
    setHandWeights(nextWeights);
  };

  useEffect(() => {
    const cards = new Deck().shuffle().deal(9);
    setDealtCards([]);
    setSolutions([]);
    setSolutionIndex(0);
    setPhase('shuffling');

    let dealInterval;
    const shuffleTimeout = setTimeout(() => {
      setPhase('dealing');
      let cardIndex = 0;
      dealInterval = setInterval(() => {
        setDealtCards((current) => [...current, cards[cardIndex]]);
        cardIndex += 1;
        if (cardIndex === cards.length) {
          clearInterval(dealInterval);
          setPhase('dealt');
        }
      }, 260);
    }, 900);

    return () => {
      clearTimeout(shuffleTimeout);
      clearInterval(dealInterval);
    };
  }, [dealNumber]);

  useEffect(() => {
    if (phase !== 'solving') return undefined;
    const solveTimeout = setTimeout(() => {
      setSolutions(solveKitty(dealtCards, 5, handWeightsRef.current));
      setSolutionIndex(0);
      setPhase('ready');
    }, 50);
    return () => clearTimeout(solveTimeout);
  }, [phase, dealtCards]);

  const activeSolution = solutions[solutionIndex];
  const showPreviousSolution = () => {
    setSolutionIndex((current) => (current - 1 + solutions.length) % solutions.length);
  };
  const showNextSolution = () => {
    setSolutionIndex((current) => (current + 1) % solutions.length);
  };

  return (
    <section className="kitty-table" aria-label="Kitty card dealing animation">
      <div className="kitty-table-glow" />
      {(phase === 'shuffling' || phase === 'dealing') && (
        <div className={`kitty-deck ${phase === 'shuffling' ? 'shuffling' : ''}`} aria-hidden="true">
          <div className="kitty-card-back" />
          <div className="kitty-card-back" />
          <div className="kitty-card-back" />
        </div>
      )}

      <div className={`kitty-deal-area ${phase === 'ready' ? 'ready' : ''} ${phase === 'dealt' || phase === 'solving' ? 'configuring' : ''}`}>
        <div className="kitty-status" aria-live="polite">
          <span>
            {phase === 'shuffling' && 'Shuffling the deck'}
            {phase === 'dealing' && `Dealing ${dealtCards.length} of 9`}
            {phase === 'dealt' && 'Nine cards dealt · choose weights and solve'}
            {phase === 'solving' && 'Evaluating 1,680 arrangements'}
            {phase === 'ready' && activeSolution && `Solution score ${activeSolution.combinationScore.toFixed(2)}`}
            {phase === 'ready' && !activeSolution && 'No valid ordered solution found'}
          </span>
          {phase === 'ready' && activeSolution && (
            <div className="kitty-solution-navigation">
              <button type="button" onClick={showPreviousSolution} aria-label="Show previous solution">‹</button>
              <strong>{solutionIndex + 1} of {solutions.length}</strong>
              <button type="button" onClick={showNextSolution} aria-label="Show next solution">›</button>
            </div>
          )}
          {phase === 'ready' && <button type="button" onClick={() => setDealNumber((value) => value + 1)}>Shuffle again</button>}
        </div>
        {(phase === 'dealt' || phase === 'solving') && (
          <section className="kitty-weight-controls" aria-label="Solution hand weights">
            <div className="kitty-weight-heading">
              <span>Hand weights</span>
              <small>Choose from 1–5 before solving</small>
            </div>
            <div className="kitty-weight-sliders">
              {handWeights.map((weight, handIndex) => (
                <label key={handIndex}>
                  <span>Hand {handIndex + 1}</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={weight}
                    disabled={phase === 'solving'}
                    onChange={(event) => changeHandWeight(handIndex, event.target.value)}
                  />
                  <strong>{weight}</strong>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="kitty-solve-button"
              onClick={() => setPhase('solving')}
              disabled={phase === 'solving'}
            >
              {phase === 'solving' ? 'Solving…' : 'Solve Kitty'}
            </button>
          </section>
        )}
        {phase === 'ready' && (
          <section className="kitty-original-deal" aria-label="Cards in their original dealt order">
            <div className="kitty-original-label">
              <div className="kitty-mini-deck" aria-hidden="true">
                <i /><i /><i />
              </div>
              <span>Original deal</span>
            </div>
            <div className="kitty-original-cards">
              {dealtCards.map((card, index) => <PlayingCard key={card.id} card={card} cardIndex={index + 1} />)}
            </div>
          </section>
        )}
        {phase !== 'ready' && (
          <div className="kitty-hand">
            {dealtCards.map((card, index) => <PlayingCard key={card.id} card={card} cardIndex={index + 1} />)}
          </div>
        )}
        {phase === 'ready' && activeSolution && (
          <div key={`${dealNumber}-${solutionIndex}`} className="kitty-solution">
            {activeSolution.hands.map((hand, handIndex) => (
              <section className="kitty-solution-hand" key={handIndex}>
                <div className="kitty-hand-heading">
                  <span>Hand {handIndex + 1}</span>
                  <strong>{hand.category.replace('-', ' ')}</strong>
                  <small>{hand.handScore.toFixed(1)}</small>
                </div>
                <div className="kitty-solution-cards">
                  {hand.cards.map((card) => (
                    <PlayingCard key={card.id} card={card} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
