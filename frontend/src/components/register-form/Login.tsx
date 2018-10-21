import { Button, Checkbox, Col, Form, Icon, Input, Row } from 'antd'
import { Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'
const FormItem = Form.Item

import { routerStore } from '../../stores/router/router-store'
import { CorelineLogo } from '../utils/Logo'
import { styles } from './LoginStyles'

interface Values {
  email: string
  password: string
}

export class Login extends React.Component {
  public render() {
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikActions<Values>,
        ) => {
          routerStore.gotoHome()
          setSubmitting(false)
        }}
        render={this.renderForm}
      />
    )
  }
  public goToHome = () => {
    routerStore.gotoHome()
  }
  public renderForm = (formik: FormikProps<Values>) => {
    const { handleChange, handleSubmit } = formik
    return (
      <>
        <Row type="flex" justify="center">
          <Form onSubmit={handleSubmit} className={styles.formStyle}>
            <h2 className={styles.title}>Login</h2>
            <Col>
              <FormItem>
                <Input
                  onChange={handleChange}
                  name="email"
                  placeholder="example@coreline.agency"
                  prefix={<Icon type="user" />}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem>
                <Input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  prefix={<Icon type="lock" />}
                />
              </FormItem>
            </Col>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
            >
              Log in
            </Button>
            <span style={{ marginLeft: '10px' }}>
              Or <a>register now!</a>{' '}
            </span>
          </Form>
        </Row>
      </>
    )
  }
}
