import { Form, Icon, Input, InputNumber, Select, Tabs } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { css } from 'emotion'
import * as React from 'react'
import { projectStore } from '../../stores/ProjectStore'
import { ProjectStatus } from '../../types/project-types'
import { maxNumber, positiveNumber } from '../utils/ant-custom-validators'
const FormItem = Form.Item

const contentContainer = css`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 5px;
  margin-top: 5px;
`

interface Props extends FormComponentProps {
  initialValues: any
  onSubmit(e: any): void
}

class HoursModalFormBase extends React.Component<Props> {
  public render() {
    const { initialValues, onSubmit } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <>
      <Tabs>
        <Tabs.TabPane key="new" tab={<span><Icon type="plus-circle" />Add</span>} />
        <Tabs.TabPane key="Project1" tab="Project1" />
        <Tabs.TabPane key="Projct2" tab="Projec2" />
        <Tabs.TabPane key="Projct3" tab="Projec2" />
        <Tabs.TabPane key="Projct4" tab="Projec2" />
      </Tabs>
      <Form onSubmit={onSubmit}>
        <div className={contentContainer}>
          <FormItem>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: 'Required, ' },
                { type: 'number', message: 'Must be a number'},
                { validator: positiveNumber },
                { validator: maxNumber(24) }
              ],
              initialValue: initialValues.amount
            })(<InputNumber placeholder="Hours" autoFocus min={0} max={24} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('projectId', {
              rules: [{ required: true, message: 'Please select a project' }],
              initialValue: initialValues.projectId
            })(
              <Select placeholder="Select a project...">
                {projectStore.projects
                .filter(p => p.status === ProjectStatus.ACTIVE)
                .map(p => (
                  <Select.Option key={p.id.toString()} value={p.id}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </div>
        <FormItem>
          {getFieldDecorator('description', {
            initialValue: initialValues.description
          })(<Input.TextArea placeholder="Describe what you've done" />)}
        </FormItem>
      </Form>
      </>
    )
  }
}

export const HoursModalForm = Form.create()(HoursModalFormBase)
