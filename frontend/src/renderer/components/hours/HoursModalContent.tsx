import { Form, Icon, Input, InputNumber, Select, Tabs } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { css } from 'emotion'
import * as React from 'react'
import { projectStore } from '../../stores/ProjectStore'
import { Hour } from '../../types/hours-types'
import { ProjectStatus } from '../../types/project-types'
import { isNumber, maxNumber, positiveNumber, requiredIf } from '../utils/ant-custom-validators'
const FormItem = Form.Item

const contentContainer = css`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 5px;
  margin-top: 5px;
`

interface Props extends FormComponentProps {
  initialValues: Hour[]
  onSubmit(e: any): void
}
interface State {
  activeHour: any
}

class HoursModalFormBase extends React.Component<Props, State> {

  public state: State = {
    activeHour: '',
  }
  private activeProjects = projectStore.projects.filter(p => p.status === ProjectStatus.ACTIVE)
  public render() {
    const { initialValues, onSubmit } = this.props
    const { activeHour } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form

    return (
      <>
      { initialValues.length > 0 &&
          <Tabs activeKey={activeHour} onChange={this.onTabChange}>
            <Tabs.TabPane key="new" tab={<span><Icon type="plus-circle" />Add</span>} />
            {
              initialValues.map((hour, index) => {
                const project = this.activeProjects.find(p => p.id === hour.projectId)

                return (
                  <Tabs.TabPane
                    key={hour.id.toString()}
                    tab={project ? project.name : `No project(${index + 1})`}
                  />
                )}
              )
            }
          </Tabs>
      }
      <Form onSubmit={onSubmit}>
        <div className={contentContainer}>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id')(<> </>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: 'Required' },
                { validator: isNumber },
                { validator: positiveNumber },
                { validator: maxNumber(24) }
              ],
            })(<InputNumber placeholder="Hours" autoFocus min={0} max={24} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('projectId', {
              rules: [{ validator: requiredIf(getFieldValue('amount') > 0, 'Project is required') }],
            })(
              <Select placeholder="Select a project...">
                {this.activeProjects
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
          })(<Input.TextArea placeholder="Describe what you've done" />)}
        </FormItem>
      </Form>
      </>
    )
  }
  public componentDidMount = () => {
    const { initialValues } = this.props
    const activeValues = initialValues[0] || this.defaultValues()
    this.setState({
      activeHour: activeValues.id && activeValues.id.toString(),
    })
    this.props.form.setFieldsValue({
      id: activeValues.id,
      amount: activeValues.amount,
      projectId: activeValues.projectId,
      description: activeValues.description
    })
  }

  public onTabChange = (key) => {
    const { initialValues } = this.props
    const activeValues = initialValues
      .find(h => h.id === parseInt(key, 10)) || this.defaultValues()

    this.setState({
      activeHour: activeValues.id && activeValues.id.toString(),
    })
    this.props.form.setFieldsValue({
      id: activeValues.id,
      amount: activeValues.amount,
      projectId: activeValues.projectId,
      description: activeValues.description
    })
  }
  public defaultValues() {
    return {
      id: null,
      amount: null,
      projectId: undefined,
      description: null,
    }
  }
}

export const HoursModalForm = Form.create()(HoursModalFormBase)
