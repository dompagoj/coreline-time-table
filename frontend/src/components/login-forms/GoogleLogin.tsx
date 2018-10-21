import * as React from 'react'
import { GoogleLogin } from 'react-google-login'

export class GoogleLoginComponent extends React.Component {
  public render() {
    return (
      <GoogleLogin
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
        clientId="252217239009-analcglomlijft6ekvbuu7sfvbb9seu5.apps.googleusercontent.com"
      />
    )
  }

  public onSuccess = arg => {
    console.log('success')
    console.log('success response: ', arg)
  }
  public onFailure = arg => {
    console.log('failed')
    console.log(arg)
  }
}
