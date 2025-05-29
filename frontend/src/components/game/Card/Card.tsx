import React, { useEffect } from "react";
import styles from "./Card.module.css";
import useSound from "use-sound";
import { motion } from "framer-motion";

interface Props {
  card: string;
  isMini: boolean;
  offset?: number;
  zIndex?: number;
}

export default function Card({ card, isMini, offset = 0, zIndex = 1 }: Props) {
  const [play] = useSound("/assets/sounds/drag.mp3");

  useEffect(() => {
    play();
  }, [play]);
  return (
    <motion.div
      className={`${styles.card} ${isMini && styles.isMini}`}
      initial={{
        opacity: 0,
        translateY: -100,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <img src={`/assets/cards/${card}.png`} alt={card} />
    </motion.div>
  );
}
