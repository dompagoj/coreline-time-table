import { Button, Input, InputNumber } from 'antd'
import { css } from 'emotion'
import * as React from 'react'

const contentContainer = css`
  display: grid;
`

const row = css`
  grid: 50% 50%;
`

export class ModalContent extends React.Component<{
  currentAmount?: any | null
  onChange(amount: number),
}> {
  public render() {
    const { onChange, currentAmount } = this.props

    return (
      <div className={contentContainer}>
        <div className={row}>
          <p>Hours: </p>
          <InputNumber
            defaultValue={(currentAmount && currentAmount.amount) || 0}
            onChange={onChange}
            min={0}
            max={12}
          />
        </div>
        <div className={row}>
          <p>Project: </p>
          <Input defaultValue="Not yet implemented" />
        </div>
      </div>
    )
  }
}
