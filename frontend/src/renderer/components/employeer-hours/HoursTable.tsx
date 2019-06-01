import { Table } from 'antd'
import React from 'react'
import { sum } from '../utils/misc'

const { Column } = Table

interface Props {
  dataSource: any
  noProjectHours?: any
}

function getTotalHours(dataSource) {
  return sum(dataSource.map(d => d.hours))
}

export function HoursTable(props: Props) {
  const { noProjectHours } = props
  const dataSource = noProjectHours && noProjectHours.hours > 0 ? [...props.dataSource, noProjectHours] : props.dataSource

  return (
    <Table
      dataSource={dataSource}
      bordered
      size="small"
      pagination={false}
      footer={() => <TableFooter totalHours={getTotalHours(dataSource)} />}
    >
      <Column title="Hours" dataIndex="hours" />
      <Column title="Project" dataIndex="project" />
    </Table>
  )
}

const TableFooter = ({ totalHours }: {totalHours: number}) => <div>Total: {totalHours} h</div>
