import React from 'react'
import styles from './TextField.module.css'

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextField({
    label,
    value,
    onChange,
}: Props) {
  return (
    <div className={styles.textField}>
      <label>
        {label}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoFocus
        />
      </label>
    </div>
  )
}
