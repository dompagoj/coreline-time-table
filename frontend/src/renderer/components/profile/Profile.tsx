import { Button, Form, Input, message, Modal, Radio, Upload } from 'antd'
import * as React from 'react'
const FormItem = Form.Item

import { authStore } from '../../stores/AuthStore'
import { userStore } from '../../stores/UserStore'
import { UserType } from '../../types/enums'
import { Title } from '../utils/Title'
import { styles } from './styles'
import { FormComponentProps } from 'antd/lib/form'
import { UploadChangeParam } from 'antd/lib/upload'
import { dummyRequest } from '../utils/misc'
import { HTTPStatusCodes } from '../../types/HTTP_STATUS_CODES'

interface State {
  modalOpen: boolean
  authKey: string
  userType: UserType
  avatar?: string
  errors: {
    authKey?: string,
  }
}

type Props = FormComponentProps

class ProfileForm extends React.Component<Props, State> {
  public state: State = {
    modalOpen: false,
    authKey: authStore.companyAuthKey,
    avatar: authStore.user.avatar,
    userType: authStore.user.type,
    errors: {
      authKey: '',
    },
  }
  public render() {
    const { user } = authStore
    const { modalOpen, errors, userType, authKey, avatar }= this.state
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Title text="Edit your profile" />
        <div className={styles.formContainer}>
          <div>
            <Form onSubmit={this.updateProfile}>
              <FormItem>
                {
                  getFieldDecorator('username', {
                    initialValue: user.username,
                    rules: [{ required: true, message: 'Username is required' }]
                  })(
                    <Input
                      addonBefore="Username"
                      size="large"
                    />
                  )
                }
              </FormItem>
              <FormItem>
                <Input disabled defaultValue={user.firstName} addonBefore="Firstname" size="large" />
              </FormItem>
              <FormItem style={{ marginBottom: 5 }}>
                <Input disabled defaultValue={user.lastName} addonBefore="Lastname" size="large" />
              </FormItem>
              <FormItem style={{ textAlign: 'center' }}>
                <Radio.Group name="type" onChange={this.onRadioChange} buttonStyle="solid" value={userType}>
                  <Radio.Button style={{ marginRight: 10 }} value="employee">
                    Employee
                  </Radio.Button>
                  <Radio.Button style={{ marginRight: 10 }} value="employer">
                    Employer
                  </Radio.Button>
                </Radio.Group>
              </FormItem>
              <FormItem className={styles.buttons}>
                <Button htmlType="submit" size="large" type="primary" icon="save">
                  Save
                </Button>
              </FormItem>
            </Form>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Upload
              name="avatar"
              listType="picture-card"
              customRequest={dummyRequest}
              onChange={this.onAvatarChange}
              showUploadList={false}
            >
              <img style={{ width: '100%' }} src={avatar} />
            </Upload>
          </div>
        </div>
        <Modal
          title="Company password"
          visible={modalOpen}
          onCancel={this.cancelModal}
          closable
          okButtonProps={{ htmlType: 'submit' }}
          onOk={this.verifyAuthKey}
        >
          <Form onSubmit={this.verifyAuthKey}>
            <Form.Item validateStatus={errors.authKey ? 'error' : 'success'} help={errors.authKey}>
              <Input
                autoFocus
                type="password"
                name="authKey"
                addonBefore="Password"
                value={authKey}
                onChange={this.onChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
  public openModal = () => {
    this.setState({ modalOpen: true })
  }

  public cancelModal = () => {
    this.setState({
      modalOpen: false,
    })
  }

  public onRadioChange = e => {
    if (e.target.value === UserType.EMPLOYER) {
      return this.openModal()
    }
    this.setState({
      userType: UserType.EMPLOYEE,
    }, () => this.updateProfile())
  }

  public onAvatarChange = async ({ file }: UploadChangeParam) => {
    if (file.originFileObj) {
      const formData = new FormData()
      formData.append('avatar', file.originFileObj)

      const { data, status } = await userStore.updateAvatar(formData)
      if (status !== HTTPStatusCodes.OK) {
        return message.error('Failed to upload image...')
      }
      console.log(data)
      authStore.user.avatar = data.url
      this.setState({
        avatar: data.url,
      })
    }
  }

  public onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    } as any)
  }

  public verifyAuthKey = async e => {
    e.preventDefault()

    const { authKey } = this.state
    const { error } = await authStore.verifyCompanyKey(authKey)
    if (error) {
      return this.setState({
        errors: {
          authKey: error,
        },
      })
    }
    this.setState({
      errors: { authKey: '' },
      modalOpen: false,
      userType: UserType.EMPLOYER,
    })
    await this.updateProfile()
  }

  public updateProfile = async (e?) => {
    e && e.preventDefault()
    
    const { authKey, userType } = this.state
    const { validateFields } = this.props.form
    validateFields(async (errors, { username }) => {
      if (errors)
        return

      const { data, error } = await userStore.updateUser({
        authKey: authKey || authStore.companyAuthKey,
        type: userType,
        username,
      })
      if (error) {
        return message.error(error)
      }
      authStore.user = data
      if (userType === UserType.EMPLOYEE) {
        authStore.companyAuthKey = ''
        this.setState({
          authKey: '',
        })
      }
      message.success('Profile updated')

    })
  }
}

export const Profile = Form.create()(ProfileForm)
