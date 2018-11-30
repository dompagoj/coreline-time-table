import React from 'react'

import { terminalStore } from '../../stores/TerminalStore'
import { styles } from './styles'
import { TerminalLine } from './terminal-line'

interface State {
  input: string
}

export class Terminal extends React.Component<any, State> {
  public state: State = {
    input: '',
  }
  private inputRef = React.createRef<HTMLInputElement>()

  public render() {
    const { input } = this.state
    console.log({ input })

    return (
      <div className={styles.container}>
        <h1 style={{ color: 'white' }}>Terminal!</h1>
        <div onClick={this.focus} style={{ height: '100%', width: '100%' }}>
          <TerminalLine
            value={input}
            onChange={this.onChange}
            inputRef={this.inputRef}
          />
        </div>
      </div>
    )
  }
  public onChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    } as any)
  }
  public componentDidMount = () => {
    this.inputRef.current!.focus()
  }
  public focus = () => {
    this.inputRef.current!.focus()
  }
}
