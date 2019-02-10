import { observer } from 'mobx-react'
import React from 'react'

import { terminalStore } from '../../stores/TerminalStore'
import { executeCommand, findCommand } from './commands'
import { styles } from './styles'
import { TerminalLine } from './terminal-line'

interface State {
  input: string
  inputColor: string
}

@observer
export class Terminal extends React.Component<any, State> {
  public state: State = {
    input: '',
    inputColor: 'white',
  }
  private inputRef = React.createRef<HTMLInputElement>()

  public render() {
    const { input, inputColor } = this.state

    return (
      <div onClick={this.focus} className={styles.container}>
        <h2 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>CTT Terminal</h2>
        {terminalStore.executed.map((command, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span className={styles.arrow}>==></span>
            <div className={styles.input}>{command}</div>
          </div>
        ))}
        <div style={{ width: '100%' }}>
          <TerminalLine
            executeInput={this.executeInput}
            value={input}
            onChange={this.onChange}
            inputColor={inputColor}
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
    const command = findCommand(e.target.value)

    command ? this.setState({ inputColor: 'green' }) : this.setState({ inputColor: 'red' })
  }

  public componentDidMount = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  public focus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  public executeInput = async e => {
    if (e.keyCode === 13) {
      const { input } = this.state
      await executeCommand(input)

      return this.setState({ input: '' })
    }
  }
}
