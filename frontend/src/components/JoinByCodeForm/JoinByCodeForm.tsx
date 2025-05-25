import React, { useEffect, useState } from 'react'
import styles from './JoinByCodeForm.module.css'
import CodeField from '../CodeField/CodeField'
import { useGame } from '@/context/GameContext';

export default function JoinByCodeForm() {
    const { playerName, joinSession } = useGame();
    const [code, setCode] = useState("");

    const handleOnClick = () => {
        joinSession(code);
    }

    return (
        <div className={styles.joinByCodeForm}>
            <CodeField onChange={setCode} />
            {
                (playerName && code.length === 5) && <button className={styles.button} onClick={handleOnClick}>Entrar</button>
            }
        </div>
    )
}
