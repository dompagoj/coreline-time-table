import { Button, Form, Input, Radio } from 'antd'
import * as React from 'react'
const FormItem = Form.Item

import { styles } from './styles'

export class Profile extends React.Component {
  public render() {
    return (
      <div className={styles.container}>
        <div>
          <div className={styles.title}>Edit your profile</div>
        </div>
        <div className={styles.formContainer}>
          <div>
            <Form>
              <FormItem>
                <Input addonBefore="Username" size="large" />
              </FormItem>
              <FormItem>
                <Input addonBefore="Firstname" size="large" />
              </FormItem>
              <FormItem>
                <Input addonBefore="Lastname" size="large" />
              </FormItem>
              <FormItem style={{ textAlign: 'center' }}>
                <Radio.Group buttonStyle="solid" defaultValue="employee">
                  <Radio.Button style={{ marginRight: 10 }} value="employee">
                    Employee
                  </Radio.Button>
                  <Radio.Button style={{ marginRight: 10 }} value="employer">
                    Employer
                  </Radio.Button>
                </Radio.Group>
              </FormItem>
            </Form>
          </div>
          <div>
            <h1>World</h1>
          </div>
        </div>
      </div>
    )
  }
}
