'use client';

import { useRef, useState } from 'react';

import styles from './CodeField.module.css';

const CODE_LENGTH = 5;

export default function FakeCodeField() {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className={styles.codeField}>
      <label>Enter a room code</label>
      <div>
        {code.map((char, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={char}
            disabled
          />
        ))}
      </div>
    </div>
  );
}
