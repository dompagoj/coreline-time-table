import { Alert, Button, Card, Divider, Form, Icon, Input } from 'antd'
import { IpcRenderer } from 'electron'
import * as React from 'react'

import { axios } from '../../../main/axios'
import { authStore } from '../../stores/AuthStore'
import { routerStore } from '../../stores/router/router-store'
import { COLORS, getLogoSrc } from '../utils/misc'
import { styles } from './styles'

// @ts-ignore
const electron = window.require('electron')
const ipcRenderer: IpcRenderer = electron.ipcRenderer

export class LoginComponent extends React.Component<any, { error: string | null }> {
  public state = {
    error: null,
  }
  public render() {
    const { error } = this.state

    return (
      <div style={{ backgroundColor: COLORS.LIGHT_YELLOW, height: '100%' }}>
        <div className={styles.titleContainer}>
          <img style={{ height: 50, width: 50, margin: '0 10px' }} src={getLogoSrc()} />
          <h3 className={styles.title}>Coreline time table</h3>
        </div>
        {error && (
          <Alert
            style={{ width: '57%', margin: '20px auto' }}
            message="Error"
            description={this.state.error}
            type="error"
            showIcon
            closable
            onClose={this.closePopup}
          />
        )}
        <Card
          style={{ width: '57%', marginTop: 45 }}
          headStyle={{ textAlign: 'center' }}
          title={<h2 style={{ margin: 0, fontWeight: 'bold' }}>Sign in to your company</h2>}
          className={styles.mainContainer}
        >
          <Form style={{ padding: '0 50px', margin: '0 auto' }}>
            <Form.Item className={styles.formItem}>
              <Input
                style={{ height: '50px' }}
                size="large"
                placeholder="your-company-domain"
                addonBefore={<Icon type="home" />}
                addonAfter={<span>.ctt.com</span>}
              />
            </Form.Item>
            <Form.Item className={styles.formItem}>
              <Button style={{ width: '100%', height: '50px' }} type="primary">
                <span style={{ fontWeight: 'bold' }}>Continue</span>
                <Icon type="forward" />
              </Button>
            </Form.Item>
            <Divider>
              <span style={{ color: 'gray' }}>Or</span>
            </Divider>
            <Button style={{ width: '100%', height: '50px' }} onClick={this.login} icon="google" type="primary">
              Sign in with google
            </Button>
          </Form>
        </Card>
      </div>
    )
  }
  public login = async () => {
    ipcRenderer.on('reply', async (event, arg) => {
      const { token, user, error, authKey } = arg
      if (error) {
        return this.setState({ error })
      }
      authStore.token = token
      authStore.user = user
      authStore.companyAuthKey = authKey
      axios.defaults.headers.authorization = 'bearer ' + token
      routerStore.gotoHome()
    })
    ipcRenderer.send('login')
  }
  public closePopup = () => {
    this.setState({
      error: null,
    })
  }
}
