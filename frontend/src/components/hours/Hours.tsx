import { Button, message, Modal, Popover } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'

import { css } from 'emotion'
import { findDOMNode } from 'react-dom'
import { hoursStore } from '../../stores/HoursStore'
import { Spinner } from '../spinner/Spinner'
import { checkIfOutOfBounds, checkifOutOfBoundsX, getDaysAfter, getDaysBefore, today } from '../utils/hours'
import { inRange } from '../utils/misc'
import { PopoverContent } from './PopoverContent'
import { styles } from './styles'

interface IState {
  currDate: moment.Moment
  openModal: boolean
  modalStyle: React.CSSProperties
}

const MODAL_WIDTH_STYLE = '400px'
const MODAL_HEIGHT_STYLE = '100px'
const MODAL_WIDTH = 400
const MODAL_HEIGHT = 100

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

@observer
export class Hours extends React.Component<any, IState> {
  public state: IState = {
    currDate: moment(),
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
                ref={`${day}-current`}
                onClick={this.openPopover(day)}
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
          bodyStyle={{ height: MODAL_HEIGHT_STYLE, width: MODAL_WIDTH_STYLE }}
          style={this.state.modalStyle}
          visible={openModal}
          title="Input hours"
          closable
          onCancel={this.closePopover}
        />
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

  public onConfirm = () => {
    message.success('Confirmed')
  }

  public onCancel = () => {
    message.warning('Canceled')
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
  public openPopover = day => () => {

    const element = this.refs[`${day}-current`]
    const modal = this.refs['modal-ref']
    // @ts-ignore
    const rect = findDOMNode(element)!.getBoundingClientRect()

    const { top, left, right, height, width, bottom, x, y } = rect
    console.log({ left }, { right }, { height }, { width }, { x }, { y }, { bottom }, { top })

    const modalXOffset = ((windowWidth - MODAL_WIDTH) / 2) - 70 - right
    const modalYOffset = checkIfOutOfBounds(top, windowHeight, MODAL_HEIGHT)
    const modalLeftOffset = checkifOutOfBoundsX(x, width, modalXOffset, windowHeight, MODAL_WIDTH)
    console.log('MODAL LEFT OFFSET: ', modalLeftOffset)

    this.setState({
      modalStyle: {
        top: top - modalYOffset,
        right: modalXOffset + modalLeftOffset,
      },
      openModal: true,
    })
  }
  public closePopover = () => {
    this.setState({
      openModal: false,
    })
  }

  public createHour = day => async () => {
    const { currDate } = this.state
    const selectedDay = moment(new Date(`${currDate.month() + 1}.${day + 1}.${currDate.year()}`))
    await hoursStore.createHour({
      date: new Date(selectedDay.toDate()),
      hours: {
        amount: 8,
      },
    })
    this.onConfirm()
  }

}
