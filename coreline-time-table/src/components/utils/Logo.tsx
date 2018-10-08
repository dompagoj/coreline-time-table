import * as React from 'react'

import logo from '../../assets/coreline-logo.svg'

interface IProps {
  className?: string
}

export const CorelineLogo = (props: IProps) => (
  <img src={logo} className={props.className || ''} />
)
