import React, { useEffect } from 'react'
import styles from './Card.module.css'
import useSound from "use-sound";

interface Props {
  card: string;
}

export default function Card({ card }: Props) {
  const [play] = useSound("/assets/sounds/drag.mp3");

  useEffect(() => {
    play();
  }, [play]);
  return (
    <div className={styles.card}>
      <img src={`/assets/cards/${card}.png`} alt={card} />
    </div>
  );
}
