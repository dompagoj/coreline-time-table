import { Button, Input, InputNumber } from 'antd'
import * as React from 'react'

export const PopoverContent = ({ createHour }: any) => {
  return (
    <div>
      <p>Hours: </p>
      <InputNumber min={0} max={12} defaultValue={0} />
      <p>Project: </p>
      <Input />
      <Button onClick={createHour} style={{ marginTop: '5px' }}>
        Click me!
      </Button>
    </div>
  )
}
