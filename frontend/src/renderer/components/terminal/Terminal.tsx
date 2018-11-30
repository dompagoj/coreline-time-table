import { observer } from 'mobx-react'
import React from 'react'

import { terminalStore } from '../../stores/TerminalStore'
import { styles } from './styles'
import { TerminalLine } from './terminal-line'

interface State {
  input: string
}

@observer
export class Terminal extends React.Component<any, State> {
  public state: State = {
    input: '',
  }
  private inputRef = React.createRef<HTMLInputElement>()

  public render() {
    const { input } = this.state

    return (
      <div className={styles.container}>
        <h2 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>CTT Terminal</h2>
        {terminalStore.executed.map((command, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span className={styles.arrow}>==></span>
            <div className={styles.input}>{command}</div>
          </div>
        ))}
        <div onClick={this.focus} style={{ height: '100%', width: '100%' }}>
          <TerminalLine
            executeInput={this.executeInput}
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
  public executeInput = e => {
    if (e.keyCode === 13) {
      const { input } = this.state

      terminalStore.addExecuted(input)
      this.setState({
        input: '',
      })
      if (input === 'clear') {
        terminalStore.executed = []
      }
    }
  }
}
