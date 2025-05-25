import React from 'react'
import styles from './QuickPlayButton.module.css'
import { useGame } from '@/context/GameContext';

export default function QuickPlayButton() {
  const { quickJoin, playerName } = useGame();

  return (
    <div className={styles.quickPlayButton}>
      <button disabled={playerName === ""} onClick={quickJoin} className={styles.button}>QUICK MATCH</button>
    </div>
  )
}
