import { Button, Form, Input, message, Modal, Radio } from 'antd'
import * as React from 'react'
const FormItem = Form.Item

import { authStore } from '../../stores/AuthStore'
import { userStore } from '../../stores/UserStore'
import { UserType } from '../../types/enums'
import { styles } from './styles'

interface IState {
  modalOpen: boolean
  username: string
  authKey: string
  userType?: UserType
  errors: {
    authKey?: string,
  }
}

export class Profile extends React.Component<any, IState> {
  public state: IState = {
    modalOpen: false,
    username: authStore.user.username,
    authKey: authStore.companyAuthKey,
    userType: authStore.user.type,
    errors: {
      authKey: '',
    },
  }
  public render() {
    const { user } = authStore
    const { modalOpen, authKey, userType, errors, username } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.title}>Edit your profile</div>
        <div className={styles.formContainer}>
          <div>
            <Form onSubmit={this.updateProfile}>
              <FormItem>
                <Input
                  name="username"
                  onChange={this.onChange}
                  required
                  value={username}
                  addonBefore="Username"
                  size="large"
                />
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
                <Button htmlType="submit" onClick={this.updateProfile} size="large" type="primary" icon="save">
                  Save
                </Button>
              </FormItem>
            </Form>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '70%' }} src={user.avatar} />
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
              <Input type="password" name="authKey" addonBefore="Password" value={authKey} onChange={this.onChange} />
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
    if (e.target.value === 'employer') {
      return this.openModal()
    }
    this.setState({
      userType: e.target.value,
    })
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
      userType: UserType.EMPLOYER,
      modalOpen: false,
    })
  }

  public updateProfile = async e => {
    e.preventDefault()

    const { authKey, username, userType } = this.state
    const { data, error } = await userStore.updateUser({
      authKey,
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
  }
}
