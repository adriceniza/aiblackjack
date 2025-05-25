import React, { useEffect } from 'react'
import styles from './Card.module.css'

interface Props {
    card: string;
    dragSoundRef: React.RefObject<HTMLAudioElement | null>;
}

export default function Card({
    card,
    dragSoundRef
}: Props) {

    useEffect(() => {
        dragSoundRef.current = new Audio('/assets/sounds/drag.mp3');
    }, [])
    return (
        <div className={styles.card}>
            <img src={`/assets/cards/${card}.png`} alt={card} />
        </div>
    )
}
