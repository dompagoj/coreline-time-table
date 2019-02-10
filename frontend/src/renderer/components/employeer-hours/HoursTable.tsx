import { Table } from 'antd'
import React from 'react'

const { Column } = Table

interface Props {
  dataSource: any
  totalHours: number
  noProjectHours?: any
}

export function HoursTable(props: Props) {
  const { noProjectHours } = props
  const dataSource = noProjectHours ? [...props.dataSource, noProjectHours] : props.dataSource

  return (
    <Table
      dataSource={dataSource}
      bordered
      size="small"
      pagination={false}
      footer={() => <TableFooter totalHours={props.totalHours} />}
    >
      <Column title="Hours" dataIndex="hours" />
      <Column title="Project" dataIndex="project" />
    </Table>
  )
}

const TableFooter = ({ totalHours }: {totalHours: number}) => <div>Total: {totalHours} h</div>
