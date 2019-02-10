import React from 'react'

import { Button, Card, Drawer, Input, Table, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { observer } from 'mobx-react'
import { projectStore } from '../../stores/ProjectStore'
import { Project, ProjectStatus } from '../../types/project-types'
import { Spinner } from '../spinner/Spinner'
import { sum } from '../utils/misc'
import { Title } from '../utils/Title'
import { NewProjectForm } from './NewProjectForm'
import { styles } from './styles'

interface State {
  drawerVisible: boolean
  search: string
  activeTab: 'active' | 'all'
}

@observer
export class Projects extends React.Component<any, State> {
  public state: State = {
    drawerVisible: false,
    search: '',
    activeTab: 'active'
  }

  public render() {
    if (projectStore.loading) {
      return <Spinner />
    }
    const { drawerVisible, search, activeTab } = this.state

    return (
      <div>
        <Title text="Projects" />
        <div className={styles.headerContainer}>
          <Tabs
            activeKey={activeTab}
            onChange={this.onTabChange}
            tabBarExtraContent={
              <TabExtraContent
                onChange={this.onChange}
                openDrawer={this.openDrawer}
              />
            }
          >
            <Tabs.TabPane key="active" tab="Active Projects" />
            <Tabs.TabPane key="all" tab="All Projects" />
          </Tabs>
        </div>
        <Drawer
          visible={drawerVisible}
          onClose={this.closeDrawer}
          destroyOnClose
          width={'50%'}
          title="Create a new project"
        >
          <NewProjectForm onCreate={this.onCreate} />
        </Drawer>
        {projectStore.activeProjects.length === 0 && activeTab === 'active' ? (
          <div style={{ textAlign: 'center', fontSize: '25px', padding: 25 }}>
            <span>
              Your company has no active projects, click{' '}
              <a onClick={this.openDrawer}>here</a> to create one
            </span>
          </div>
        ) : (
          <Card className={styles.tableContainer}>
            <Table
              columns={projectsTableColumns}
              dataSource={this.getTableData(search)}
            />
          </Card>
        )}
      </div>
    )
  }
  public async componentDidMount() {
    await projectStore.getProjects()
  }
  public onCreate = async (project: Project) => {
    this.setState({
      drawerVisible: false
    })

    await projectStore.createProject(project)
  }

  public getTableData(search: string) {
    const projects =
      this.state.activeTab === 'active'
        ? projectStore.activeProjects
        : projectStore.projects

    return projects
      .filter(project =>
        project.name.toLowerCase().startsWith(search.toLowerCase())
      )
      .map(project => ({
        key: project.id,
        name: project.name,
        status: project.status,
        hours: project.hours ? sum(project.hours.map(p => p.amount)) : 0
      }))
  }

  public openDrawer = () => {
    this.setState({ drawerVisible: true })
  }
  public closeDrawer = () => {
    this.setState({ drawerVisible: false })
  }
  public onChange = event => {
    // @ts-ignore
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  public onTabChange = key => {
    this.setState({
      activeTab: key
    })
  }
}

const TabExtraContent = props => (
  <div className={styles.extraContent}>
    <Input
      onChange={props.onChange}
      name="search"
      placeholder="Search by name..."
    />
    <Button onClick={props.openDrawer} className="button-green">
      New Project
    </Button>
  </div>
)

const projectsTableColumns: Array<
  ColumnProps<{
    key: string | number;
    name: any;
    status: any;
    hours: any;
  }>
> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render(status, p) {
      return (
        <Button
          type={status === ProjectStatus.ACTIVE ? 'primary' : 'danger'}
          ghost
          onClick={() =>
            projectStore.updateProject(p.key, {
              status:
                status === ProjectStatus.ACTIVE
                  ? ProjectStatus.DONE
                  : ProjectStatus.ACTIVE
            })
          }
        >
          {status}
        </Button>
      )
    }
  },
  {
    title: 'Total hours',
    dataIndex: 'hours',
    key: 'hours'
  },
  {
    title: 'Actions',
    className: styles.actionsContainer,
    key: 'actions',
    render(project) {
      return (
        <div className={styles.actionsContainer}>
          <Button
            className="tab-button"
            onClick={() => projectStore.deleteProject(project.key)}
            type="danger"
            shape="circle-outline"
            icon="delete"
          />
        </div>
      )
    }
  }
]
