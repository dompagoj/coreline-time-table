import { Spin } from 'antd'
import { css } from 'emotion'
import * as React from 'react'

const spinnerContainerStyle = css`
  height: 500px;
  width: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const Spinner = () => (
  <div>
    <Spin size="large" />
  </div>
)
