import { Form, Input, InputNumber } from 'antd'
import { css } from 'emotion'
import * as React from 'react'
const FormItem = Form.Item

const contentContainer = css`
  display: grid;
`

export class HoursModalContent extends React.Component<{
  currentAmount: number
  onChange(amount: number),
}> {
  public render() {
    const { onChange, currentAmount } = this.props

    return (
      <Form className={contentContainer}>
        <FormItem label="Hours">
          <InputNumber defaultValue={currentAmount} onChange={onChange} min={0} max={12} />
        </FormItem>
        <FormItem validateStatus="warning" help="Not yet implemented">
          <Input addonBefore="Project" />
        </FormItem>
      </Form>
    )
  }
}
