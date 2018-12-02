import { Table } from 'antd'
import React from 'react'

const { Column } = Table

interface Props {
  dataSource: any
  totalHours: number
}

export function HoursTable(props: Props) {
  return (
    <Table
      dataSource={props.dataSource}
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

const TableFooter = ({ totalHours }) => <div>Total: {totalHours} h</div>
