import React from 'react'
import { globalStyles } from '../globalStyles'

interface Props {
  text: string
}

export function Title(props: Props) {
  return <div className={globalStyles.title}>{props.text}</div>
}
