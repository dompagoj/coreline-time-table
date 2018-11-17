import { Button, Form, Input, Modal, Radio } from 'antd'
import * as React from 'react'
const FormItem = Form.Item

import { authStore } from '../../stores/AuthStore'
import { UserType } from '../../types/enums'
import { styles } from './styles'

interface IState {
  modalOpen: boolean
  username: string
  authKey: string
  type?: UserType
}

export class Profile extends React.Component<any, IState> {
  public state: IState = {
    modalOpen: false,
    username: '',
    authKey: '',
    type: undefined,
  }
  public render() {
    const { user } = authStore
    const { modalOpen } = this.state

    return (
      <div className={styles.container}>
        <div>
          <div className={styles.title}>Edit your profile</div>
        </div>
        <div className={styles.formContainer}>
          <div>
            <Form>
              <FormItem>
                <Input required defaultValue={user.username} addonBefore="Username" size="large" />
              </FormItem>
              <FormItem>
                <Input disabled defaultValue={user.firstName} addonBefore="Firstname" size="large" />
              </FormItem>
              <FormItem style={{ marginBottom: 5 }}>
                <Input disabled defaultValue={user.lastName} addonBefore="Lastname" size="large" />
              </FormItem>
              <FormItem style={{ textAlign: 'center' }}>
                <Radio.Group name="type" onChange={this.onRadioChange} buttonStyle="solid" defaultValue={user.type}>
                  <Radio.Button style={{ marginRight: 10 }} value="employee">
                    Employee
                  </Radio.Button>
                  <Radio.Button style={{ marginRight: 10 }} value="employer">
                    Employer
                  </Radio.Button>
                </Radio.Group>
              </FormItem>
              <FormItem className={styles.buttons}>
                <Button onClick={this.updateProfile} size="large" type="primary" icon="save">
                  Save
                </Button>
              </FormItem>
            </Form>
          </div>
          <div>
            <h1>Todo: profile pic hehe</h1>
          </div>
        </div>
        <Modal title="Company password" visible={modalOpen} onCancel={this.closeModal}>
          <Input name="authKey" addonBefore="Password" />
        </Modal>
      </div>
    )
  }
  public openModal = () => {
    this.setState({ modalOpen: true })
  }
  public closeModal = () => {
    this.setState({ modalOpen: false })
  }

  public onRadioChange = e => {
    if (e.target.value === 'employer') {
      this.openModal()
    }
  }
  public onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    } as any)
  }

  public updateProfile = () => {}
}
