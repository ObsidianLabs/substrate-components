import React, { PureComponent } from 'react'

import substrateNode from './substrateNode'

export default class SubstrateNodeStatus extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      best: '',
      finalized: '',
      nodeIdentity: '',
    }
  }

  componentDidMount () {
    substrateNode.setStatusButton(this.props.name, this)
  }

  render () {
    const { lifecycle } = this.props

    if (lifecycle === 'stopped') {
      return (
        <React.Fragment>
          <td></td>
          <td></td>
          <td></td>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <td>
          <div className="btn btn-sm btn-secondary">
            <i className='fas fa-circle-notch fa-spin' /> {this.state.best}
          </div>
        </td>
        <td>
          <div className="btn btn-sm btn-secondary">
            <i className='fas fa-circle-notch fa-spin' /> {this.state.finalized}
          </div>
        </td>
        <td>
          <code>{this.state.nodeIdentity}</code>
        </td>
      </React.Fragment>
    )
  }
}
