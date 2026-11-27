import { useEffect, useState } from 'react';
import { newsHeadlines } from '../data/gameData';

export default function NewsTicker() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * newsHeadlines.length));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % newsHeadlines.length);
    }, 8000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <footer className="news">
      <span className="news-label">Crônicas</span>
      <span className="news-text" key={index}>{newsHeadlines[index]}</span>
    </footer>
  );
}
