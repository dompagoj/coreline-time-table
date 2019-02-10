import { Button, message, Modal } from 'antd'
import { observer } from 'mobx-react'
import * as moment from 'moment'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { hoursStore } from '../../stores/HoursStore'
import { projectStore } from '../../stores/ProjectStore'
import { ID } from '../../types/general'
import { Hour } from '../../types/hours-types'
import { dateFromNums, getDaysAfter, getDaysBefore } from '../utils/hours'
import { inRange, sum, validateFieldsPromise } from '../utils/misc'
import { HoursModalForm } from './HoursModalContent'
import { styles } from './styles'


interface State {
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
const YELLOW= '#ffe4aa'

@observer
export class Hours extends React.Component<any, State> {
  private formRef = React.createRef<any>()
  public state: State = {
    loading: false,
    currDate: moment(),
    today: moment(),
    selectedDay: 0,
    openModal: false,
    modalStyle: {},
    initialValues: null,
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
            const hours = hoursStore.findHours(currDate, day)
            if (!hours) {
              return null
            }
            const saturday = (daysBefore.length + index + 2) % 7 === 0
            const sunday = (daysBefore.length + index + 1) % 7 === 0
            const weekend = saturday || sunday

            return (
              <div
                ref={`${day}-current`}
                onClick={this.openModal(day, weekend, hours)}
                key={`${day}-current`}
                className={styles.dayContainer}
                style={{
                  backgroundColor: hours.length > 0
                    ? sum(hours.map(h => h.amount)) === 0 && !weekend
                      ? YELLOW
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
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {hours.length > 0 && (weekend || !this.beforeToday(day)) && (
                      <Button
                        onClick={this.deleteHours(hours.map(h => h.id))}
                        icon="delete"
                        type="danger"
                        shape="circle"
                      />
                    )}
                    <div className={this.isToday(day) ? styles.today : styles.day}>{day}</div>
                  </div>
                  {
                    hours.length < 3 
                      ? 
                      hours.map(hour => (
                        <div key={hour.id} className={styles.content}>{hour.amount} Hours {hour.project && `(${hour.project.name[0].toUpperCase()})`}</div>
                      ))
                      : <>
                        {hours.slice(0, 2).map(hour => {
                          return <div key={hour.id} className={styles.content}>{hour.amount} Hours {hour.project && `(${hour.project.name[0].toUpperCase()})`}</div>
                        })}
                        <span>...</span>
                      </>
                  }
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
          destroyOnClose
          title={modalTitle}
          okText="Save"
          footer={
            <>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button onClick={this.onSubmit} type="primary">Save</Button>
            </>
          }
        >
          <HoursModalForm ref={this.formRef} onSubmit={this.onSubmit} initialValues={initialValues} />
        </Modal>
      </div>
    )
  }
  public async componentDidMount() {
    this.setState({ loading: true })
    await Promise.all([
      hoursStore.getHours({
        include: ['project']
      }),
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

  public goToToday = async () => {
    await hoursStore.getHours({
      where: { month: this.state.today.month() + 1 },
      include: ['project'],
    })
    this.setState({
      currDate: moment(),
    })
  }

  public goToPrevMonth = async () => {
    const currDate = moment(this.state.currDate).add(-1, 'months')
    await hoursStore.getHours({
      where: { month: currDate.month() + 1 },
      include: ['project'],
    })
    this.setState({
      currDate,
    })
  }

  public goToNextMonth = async () => {
    const currDate = moment(this.state.currDate).add(1, 'months')
    await hoursStore.getHours({
      where: { month: currDate.month() + 1 },
      include: ['project'],
    })
    this.setState({
      currDate,
    })
  }
  public openModal = (day: number, weekend: boolean, hours: Hour[]) => () => {
    // eslint-disable-next-line react/no-string-refs
    const element = this.refs[`${day}-current`]
    // @ts-ignore
    // eslint-disable-next-line react/no-find-dom-node
    const node: Element | null = findDOMNode(element)
    if (!node) {
      return
    }
    const rect = node.getBoundingClientRect()

    const { top, right } = rect

    const modalXOffset = this.checkifOutOfBoundsX(right)
    const modalYOffset = this.checkIfOutOfBoundsY(top)

    const modalTitle = weekend ? 'You shouldn\'t work on the weekends' : hours.length > 0 ? '' : 'New entry'
    this.setState({
      modalStyle: {
        top: top - modalYOffset,
        right: modalXOffset,
      },
      selectedDay: day,
      initialValues: hours,
      modalTitle,
      openModal: true,
    })
  }
  public closeModal = () => {
    this.setState({
      openModal: false,
    })
  }

  public createHour = async (data) => {

    const { currDate, selectedDay } = this.state
    const date = dateFromNums(currDate.month() + 1, selectedDay, currDate.year())
    await hoursStore.createHour({
      date,
      hours: data,
    })

    this.setState({ openModal: false, initialValues: null })
    message.success('Confirmed')
  }

  public updateHour = async (data) => {

    await hoursStore.updateHour(data)

    this.setState({ openModal: false, initialValues: null })
    message.success('Updated')
  }

  public onSubmit = async (e) => {
    // @ts-ignore
    const { errors, values } = await validateFieldsPromise(this.formRef.current.validateFields)
    if (errors) {
      return
    }
    const { id, ...data } = values
    id ? this.updateHour({ id, ...data }) : this.createHour(data)
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

  public deleteHours = (ids: ID[]) => async e => {
    e.stopPropagation()

    await hoursStore.deleteHours(ids)
    await hoursStore.getHours()
    message.warning('Deleted')
  }
}
