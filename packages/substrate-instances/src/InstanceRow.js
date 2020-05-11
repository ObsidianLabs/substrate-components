import React, { PureComponent } from 'react'

import {
  DeleteButton,
} from '@obsidians/ui-components'

import substrateNode, { SubstrateNodeButton, SubstrateNodeStatus } from '@obsidians/substrate-node'

export default class InstanceRow extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      lifecycle: 'stopped',
    }
  }

  renderStartStopBtn = () => {
    return (
      <SubstrateNodeButton
        name={this.props.name}
        lifecycle={this.state.lifecycle}
        mainNode={this.props.mainNode}
        onLifecycle={this.onLifecycle}
      />
    )
  }

  onLifecycle = (lifecycle, name) => {
    this.setState({ lifecycle })
    if (typeof name === 'string') {
      this.props.onMainNode(name)
    }
  }

  deleteInstance = async name => {
    await substrateNode.purgeChain(name)
  }

  render () {
    const { name } = this.props

    return (
      <tr>
        <td>
          <div className='flex-row align-items-center'>{name}</div>
        </td>
        <td>{this.renderStartStopBtn(name)}</td>
        <SubstrateNodeStatus
          name={this.props.name}
          lifecycle={this.state.lifecycle}
        />
        <td align='right'>
          <DeleteButton
            icon='fas fa-eraser'
            textConfirm='Click again to purge'
            onConfirm={() => this.deleteInstance(name)}
          />
        </td>
      </tr>
    )
  }
}
