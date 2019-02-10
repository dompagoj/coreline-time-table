import { Button, message, Modal } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'

import { findDOMNode } from 'react-dom'
import { hoursStore } from '../../stores/HoursStore'
import { projectStore } from '../../stores/ProjectStore'
import { Hour } from '../../types/hours-types'
import { Spinner } from '../spinner/Spinner'
import { dateFromNums, getDaysAfter, getDaysBefore } from '../utils/hours'
import { inRange, sum, validateFieldsPromise } from '../utils/misc'
import { HoursModalForm } from './HoursModalContent'
import { styles } from './styles'

interface IState {
  loading: boolean
  currDate: moment.Moment
  today: moment.Moment
  openModal: boolean
  modalStyle: React.CSSProperties
  selectedDay: number
  initialValues: any
  modalTitle: string
}

const MODAL_WIDTH = 400
const MODAL_HEIGHT = 150
const LIGHT_RED = '#ff8e8ef0'
const LIGHT_GREEN = '#b7ffd7f0'

@observer
export class Hours extends React.Component<any, IState> {
  public state: IState = {
    loading: false,
    currDate: moment(),
    today: moment(),
    selectedDay: 0,
    openModal: false,
    modalStyle: {},
    initialValues: {},
    modalTitle: '',
  }
  public render() {
    if (this.state.loading) {
      return null
    }
    const { currDate, openModal, modalStyle, today, modalTitle, initialValues } = this.state

    const daysBefore: number[] = getDaysBefore(currDate)

    const daysAfter: number[] = getDaysAfter(currDate)

    const days = inRange(currDate.daysInMonth())

    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span
              style={{
                marginRight: '5px',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              {currDate.format('MMMM')}
            </span>
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
        <div className={styles.rowContainer(currDate.daysInMonth() + daysBefore.length)}>
          {daysBefore.map(day => (
            <div onClick={this.goToPrevMonth} key={`${day}-before`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day}</div>
              </div>
            </div>
          ))}
          {days.map((day, index) => {
            const hours = hoursStore.getHour(currDate, day) as Hour | undefined

            const saturday = (daysBefore.length + index + 2) % 7 === 0
            const sunday = (daysBefore.length + index + 1) % 7 === 0
            const weekend = saturday || sunday

            return (
              <div
                // tslint:disable-next-line:jsx-no-string-ref
                ref={`${day}-current`}
                onClick={this.openModal(day, weekend, hours)}
                key={`${day}-current`}
                className={styles.dayContainer}
                style={{
                  backgroundColor: hours
                    ? hours.amount === 0 && !weekend
                      ? '#ffe4aa'
                      : LIGHT_GREEN
                    : weekend
                    ? '#d1d1d1'
                    : today.date() > day && today.month() === currDate.month()
                    ? LIGHT_RED
                    : 'white',
                }}
              >
                <div className={styles.dayContent}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '20% auto',
                      gridGap: '20px',
                      justifyContent: 'spaceBetween',
                    }}
                  >
                    {hours && (weekend || !this.beforeToday(day)) && (
                      <Button onClick={this.deleteHour(currDate, day)} icon="delete" type="danger" shape="circle" />
                    )}
                    <div className={this.isToday(day) ? styles.today : styles.day}>{day}</div>
                  </div>
                  {hours && <div className={styles.content}>{hours.amount} Hours</div>}
                </div>
              </div>
            )
          })}
          {daysAfter.map(day => (
            <div onClick={this.goToNextMonth} key={`${day}-after`} className={styles.disabledDayContainer}>
              <div className={styles.dayContent}>
                <div className={styles.day}>{day}</div>
              </div>
            </div>
          ))}
        </div>
        <Modal
          style={modalStyle}
          width={MODAL_WIDTH}
          visible={openModal}
          closable
          onCancel={this.closePopover}
          onOk={this.createHour}
          destroyOnClose
          title={modalTitle}
          okText="Save"
        >
          <HoursModalForm ref="form" onSubmit={this.createHour} initialValues={initialValues} />
        </Modal>
      </div>
    )
  }
  public async componentDidMount() {
    this.setState({ loading: true })
    await Promise.all([
      hoursStore.getHours(),
      projectStore.getProjects()
    ])
    this.setState({ loading: false })
  }

  public isToday = day => {
    const { currDate, today } = this.state
    if (today.date() !== day) {
      return false
    }

    return !(currDate.month() !== today.month() || currDate.year() !== today.year())
  }

  public beforeToday = day => {
    const { today, currDate } = this.state
    if (today.month() > currDate.month() || today.year() > currDate.year()) {
      return true
    }

    return today.date() > day && today.month() === currDate.month()
  }

  public goToToday = () => {
    this.setState({
      currDate: moment(),
    })
  }

  public goToPrevMonth = async () => {
    const currDate = moment(this.state.currDate).add(-1, 'months')
    await hoursStore.getHours({
      where: { month: currDate.month() + 1 }
    })
    this.setState({
      currDate,
    })
  }

  public goToNextMonth = async () => {
    const currDate = moment(this.state.currDate).add(1, 'months')
    await hoursStore.getHours({
      where: { month: currDate.month() + 1 }
    })
    this.setState({
      currDate,
    })
  }
  public openModal = (day: number, weekend: boolean, hours) => () => {
    const element = this.refs[`${day}-current`]
    // @ts-ignore
    const rect = findDOMNode(element)!.getBoundingClientRect()

    const { top, right } = rect

    const modalXOffset = this.checkifOutOfBoundsX(right)
    const modalYOffset = this.checkIfOutOfBoundsY(top)

    const modalTitle = weekend ? 'You shouldn\'t work on the weekends' : hours ? 'Update entry' : 'New entry'

    const initialValues = {
      amount: hours ? hours.amount : undefined,
      projectId: hours ? hours.projectId : undefined,
      description: hours ? hours.description : '',
    }

    this.setState({
      modalStyle: {
        top: top - modalYOffset,
        right: modalXOffset,
      },
      selectedDay: day,
      initialValues,
      modalTitle,
      openModal: true,
    })
  }
  public closePopover = () => {
    this.setState({
      openModal: false,
    })
  }

  public createHour = async e => {
    if (e) {
      e.preventDefault()
    }
    // @ts-ignore
    const { errors, values } = await validateFieldsPromise(this.refs.form.validateFields)
    if (errors) {
      return
    }
    const { amount, description, projectId } = values

    const { currDate, selectedDay } = this.state
    const date = dateFromNums(currDate.month() + 1, selectedDay, currDate.year())

    await hoursStore.createHour({
      date,
      hours: { amount, projectId, description },
    })

    this.setState({ openModal: false })
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

  public deleteHour = (currDate, day) => async e => {
    e.stopPropagation()

    await hoursStore.deleteHour(currDate, day)
    message.warning('Deleted')
  }
}
