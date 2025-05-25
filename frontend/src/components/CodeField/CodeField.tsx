'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './CodeField.module.css';

const CODE_LENGTH = 5;

export default function CodeField({onChange}: { onChange: (code: string) => void }) {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[A-Za-z0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    // Move to next input
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (code[index] === '') {
        inputsRef.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  useEffect(() => {
    onChange(code.join(''));
  }, [code])

  return (
    <div className={styles.codeField}>
      <label>Enter a room code</label>
      <div className={styles.inputsContainer}>
        {code.map((char, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={styles.input}
          />
        ))}
      </div>
    </div>
  );
}
