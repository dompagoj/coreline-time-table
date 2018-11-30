import React from 'react'

import { styles } from './styles'

interface Props {
  value: string
  inputRef: any
  noInput?: boolean
  onChange(e: any): void
  executeInput(e: any): void
}

export function TerminalLine({
  noInput = false,
  executeInput,
  inputRef,
  onChange,
  value,
}: Props) {
  return (
    <div style={{ display: 'flex' }}>
      <span className={styles.arrow}>==></span>
      <input
        name="input"
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
