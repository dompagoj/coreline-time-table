import React from 'react'

import { styles } from './styles'

interface Props {
  value: string
  inputRef: any
  onChange(e: any): void
}

export function TerminalLine(props: Props) {
  const { inputRef, onChange, value } = props

  return (
    <div style={{ display: 'flex' }}>
      <span className={styles.arrow}>==></span>
      <input name="input" className={styles.input} type="text" ref={inputRef} onChange={onChange} value={value}/>
    </div>
  )
}
