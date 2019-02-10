import { Button, Form, Icon, Input, message, Upload } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { UploadChangeParam } from 'antd/lib/upload'
import React from 'react'
import { Project } from '../../types/project-types'
import { getBase64 } from '../utils/misc'

interface Props extends FormComponentProps {
  onUpdate(project: Partial<Project>): void
  initialValues: Partial<Project>
}
interface State {
  loading: boolean
  avatar?: string
}

class BaseForm extends React.Component<Props, State> {
  public state: State = {
    loading: false,
    avatar: this.props.initialValues.avatar,
  }

  public render() {
    const { avatar, loading } = this.state

    const { getFieldDecorator } = this.props.form
    const { initialValues } = this.props

    const UploadButton = () => (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div> Upload</div>
      </div>
    )

    return (
      <Form onSubmit={this.updateProject} layout="vertical">
        <Form.Item label="Project name">
          {getFieldDecorator('name', {
            initialValue: initialValues.name, 
            rules: [{ required: true, message: 'Project name is required' }],
          })(<Input autoFocus />)}
        </Form.Item>
        <Form.Item label="Project avatar">
          {getFieldDecorator('avatar')(
            <Upload listType="picture-card" showUploadList={false} onChange={this.uploadFile}>
              {avatar ? <img style={{ maxHeight: 150, maxWidth: 150 }} src={avatar} /> : <UploadButton />}
            </Upload>,
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="button-green">
            Update Project
          </Button>
        </Form.Item>
      </Form>
    )
  }
  public uploadFile = async ({ file }: UploadChangeParam) => {
    const validType = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!validType) {
      return message.error('You can only upload png/jpeg files!')
    }

    this.setState({ loading: true })
    this.setState({ avatar: await getBase64(file.originFileObj as any) })
    this.setState({ loading: false })
  }

  public updateProject = e => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      return this.props.onUpdate({ 
        id: this.props.initialValues.id,  
        ...values,
        avatar: this.state.avatar
      })
    })
  }
}

export const UpdateProjectForm = Form.create()(BaseForm)
