import React from 'react'

import { styles } from './styles'

interface Props {
  value: string
  inputRef: any
  inputColor: string
  onChange(e: any): void
  executeInput(e: any): void
}

export function TerminalLine({ executeInput, inputRef, inputColor, onChange, value }: Props) {
  return (
    <div style={{ display: 'flex' }}>
      <span className={styles.arrow}>==></span>
      <input
        name="input"
        style={{ color: inputColor }}
        className={styles.input}
        type="text"
        ref={inputRef}
        onChange={onChange}
        value={value}
        onKeyDown={executeInput}
      />
    </div>
  )
}
