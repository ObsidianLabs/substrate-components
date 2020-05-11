import React, { PureComponent } from 'react'

import {
  Card,
  Button,
} from '@obsidians/ui-components'

import { ProjectPath } from '@obsidians/substrate-project'

import substrateNode from '@obsidians/substrate-node'

import InstanceHeader from './InstanceHeader'
import InstanceRow from './InstanceRow'

export default class InstanceList extends PureComponent {
  static defaultProps = {
    onLifecycle: () => {},
  }

  constructor (props) {
    super(props)

    this.state = {
      mainNode: '',
      instances: []
    }
  }

  componentDidMount () {
    this.refreshInstances()
  }

  componentDidUpdate (prevProps) {
    // this.refreshInstances()
  }

  refreshInstances = () => {
    const instances = [
      { name: 'alice' },
      { name: 'bob' },
      { name: 'charlie' },
      { name: 'dave' },
    ]
    this.setState({ instances })
  }

  onMainNode = mainNode => {
    this.setState({ mainNode })
  }

  purgeChain = () => {
    substrateNode.purgeChain(this.props.projectRoot, this.props.version)
  }

  renderTable = () => {
    return (
      <table className='table table-sm table-hover table-striped'>
        <InstanceHeader />
        <tbody>
          {this.renderTableBody()}
        </tbody>
      </table>
    )
  }

  renderTableBody = () => {
    if (!this.state.instances.length) {
      return <tr><td align='middle' colSpan={6}>(No Substrate node)</td></tr>
    }

    return this.state.instances.map(({ name }) => (
      <InstanceRow
        key={`instance-${name}`}
        name={name}
        mainNode={this.state.mainNode}
        onMainNode={this.onMainNode}
        onRefresh={this.refreshInstances}
      />
    ))
  }

  render () {
    return (
      <Card
        title={
          <div>
            <h4 className='mb-0'>Substrate Node Instances</h4>
            <div className='mt-1'><ProjectPath projectRoot={this.props.projectRoot} /></div>
          </div>
        }
        right={null}
      >
        <div className='flex-grow-1 overflow-auto'>
          {this.renderTable()}
        </div>
      </Card>
    )
  }
}
