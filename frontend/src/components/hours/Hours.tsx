import { Button, message, Modal } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'

import { findDOMNode } from 'react-dom'
import { hoursStore } from '../../stores/HoursStore'
import { Spinner } from '../spinner/Spinner'
import { getDaysAfter, getDaysBefore, today } from '../utils/hours'
import { inRange } from '../utils/misc'
import { ModalContent } from './PopoverContent'
import { styles } from './styles'

interface IState {
  currDate: moment.Moment
  openModal: boolean
  modalStyle: React.CSSProperties
  selectedDay: number
  hoursAmount: number
}

const MODAL_WIDTH = 400
const MODAL_HEIGHT = 150

@observer
export class Hours extends React.Component<any, IState> {
  public state: IState = {
    currDate: moment(),
    selectedDay: 0,
    hoursAmount: 0,
    openModal: false,
    modalStyle: {},
  }
  public render() {
    if (hoursStore.loading) {
      return <Spinner />
    }
    const { currDate, openModal } = this.state

    const daysBefore: number[] = getDaysBefore(currDate)

    const daysAfter: number[] = getDaysAfter(currDate)

    const days = inRange(currDate.daysInMonth())

    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{}}>
            <span style={{ marginRight: '5px', fontWeight: 'bold', fontSize: '20px' }}>{currDate.format('MMMM')}</span>
            <span>{currDate.format('YYYY')}</span>
          </div>
          <div>
            <Button onClick={this.goToPrevMonth}>&lt;</Button>
            <Button onClick={this.goToToday}>Today</Button>
            <Button onClick={this.goToNextMonth}>&gt;</Button>
          </div>
        </div>
        <div className={styles.header}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={styles.rowContainer}>
          {daysBefore.map(day => (
            <div onClick={this.goToPrevMonth} key={`${day}-before`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day + 1}</div>
              </div>
            </div>
          ))}
          {days.map(day => {
            const hours = hoursStore.getHour(currDate, day + 1)

            return (
              <div
                // tslint:disable-next-line:jsx-no-string-ref
                ref={`${day + 1}-current`}
                onClick={this.openModal(day + 1)}
                key={`${day}-current`}
                className={styles.dayContainer}
              >
                <div className={styles.dayContent}>
                  <div className={this.isToday(day + 1) ? styles.today : styles.day}>{day + 1}</div>
                  {hours && <div className={styles.content}>{hours.amount} Hours</div>}
                </div>
              </div>
            )
          })}
          {daysAfter.map(day => (
            <div onClick={this.goToNextMonth} key={`${day}-after`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day + 1}</div>
              </div>
            </div>
          ))}
        </div>
        <Modal
          // tslint:disable-next-line:jsx-no-string-ref
          ref="modal-ref"
          style={this.state.modalStyle}
          width={MODAL_WIDTH}
          visible={openModal}
          closable
          onCancel={this.closePopover}
          onOk={this.createHour}
          destroyOnClose
          okText="Save"
        >
          <ModalContent
            onChange={this.hoursAmountChange}
            currentAmount={hoursStore.getHour(this.state.currDate, this.state.selectedDay)}
          />
        </Modal>
      </div>
    )
  }
  public async componentDidMount() {
    await hoursStore.getHours()
  }

  public isToday = day => {
    const { currDate } = this.state
    if (currDate.month() !== today.month() || currDate.year() !== today.year()) {
      return false
    }

    return moment().date() === day
  }

  public goToToday = () => {
    this.setState({
      currDate: moment(),
    })
  }

  public goToPrevMonth = () => {
    this.setState({
      currDate: moment(this.state.currDate).add(-1, 'months'),
    })
  }

  public goToNextMonth = () => {
    this.setState({
      currDate: moment(this.state.currDate).add(1, 'months'),
    })
  }
  public openModal = day => () => {
    const element = this.refs[`${day}-current`]
    // @ts-ignore
    const rect = findDOMNode(element)!.getBoundingClientRect()

    const { top, right } = rect

    const modalXOffset = this.checkifOutOfBoundsX(right)
    const modalYOffset = this.checkIfOutOfBoundsY(top)
    this.setState({
      modalStyle: {
        top: top - modalYOffset,
        right: modalXOffset,
      },
      selectedDay: day,
      openModal: true,
    })
  }
  public closePopover = () => {
    this.setState({
      openModal: false,
    })
  }

  public createHour = async () => {
    const { currDate, selectedDay, hoursAmount } = this.state
    const day = moment(new Date(`${currDate.month() + 1}.${selectedDay + 1}.${currDate.year()}`))
    await hoursStore.createHour({
      date: new Date(day.toDate()),
      hours: {
        amount: hoursAmount,
      },
    })
    this.setState({ openModal: false, hoursAmount: 0 })
    message.success('Confirmed')
  }
  public checkIfOutOfBoundsY = top => {
    const condition = top + MODAL_HEIGHT * 2 - window.innerHeight
    if (condition > 0) {
      return condition
    }

    return 0
  }
  public checkifOutOfBoundsX = right => {
    const defaultXOffset = (window.innerWidth - MODAL_WIDTH) / 2 - 30 - right

    const modalRight = right + MODAL_WIDTH + 30
    if (modalRight > window.innerWidth) {
      return defaultXOffset + modalRight - window.innerWidth + MODAL_WIDTH / 2
    }

    return defaultXOffset
  }

  public hoursAmountChange = amount => {
    this.setState({
      hoursAmount: amount,
    })
  }
}
