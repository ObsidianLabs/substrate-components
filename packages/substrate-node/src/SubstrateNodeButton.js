import React, { PureComponent } from 'react'
import notification from '@obsidians/notification'

import substrateNode from './substrateNode'

export default class SubstrateNodeButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      joined: false,
    }
  }

  componentWillUnmount () {
    if (this.props.lifecycle !== 'stopped') {
      this.stop()
    }
  }

  onLifecycle = (lifecycle, name) => {
    if (this.props.onLifecycle) {
      this.props.onLifecycle(lifecycle, name)
    }
  }

  start = async () => {
    if (this.props.lifecycle !== 'stopped') {
      return
    }
    this.onLifecycle('starting')
    try {
      await substrateNode.start(this.props.name)
    } catch (e) {
      this.onLifecycle('stopped')
      return
    }
    this.onLifecycle('started', this.props.name)
    notification.success(`Substrate Node Started`, `Substrate node <b>${this.props.name}</b> is running now.`)
  }

  stop = async () => {
    if (substrateNode.nJoins) {
      notification.error('Stop Failed', 'Cannot stop the main node if other nodes are running.')
      return
    }
    this.onLifecycle('stopping')
    await substrateNode.stop(this.props.name)
    this.onLifecycle('stopped', '')
    notification.info(`Substrate Node Stopped`, `Substrate node <b>${this.props.name}</b> stops to run.`)
  }

  join = async () => {
    try {
      await substrateNode.join(this.props.name)
    } catch (e) {
      this.onLifecycle('stopped')
      return
    }
    this.setState({ joined: true })
    this.onLifecycle('joined')
    notification.success(`Substrate Node Started`, `Substrate node <b>${this.props.name}</b> is running now.`)
  }

  unjoin = async () => {
    await substrateNode.unjoin(this.props.name)
    this.setState({ joined: false })
    this.onLifecycle('stopped')
    notification.info(`Substrate Node Stopped`, `Substrate node <b>${this.props.name}</b> stops to run.`)
  }

  render () {
    switch (this.props.lifecycle) {
      case 'stopped':
        if (this.props.mainNode && this.props.name !== this.props.mainNode) {
          return (
            <div key='substrate-node-btn-join' className='btn btn-sm btn-success' onClick={this.join}>
              <i className='fas fa-plus-circle mr-1' />Join
            </div>
          )
        } else {
          return (
            <div key='substrate-node-btn-start' className='btn btn-sm btn-success' onClick={this.start}>
              <i className='fas fa-play mr-1' />Start
            </div>
          )
        }
      case 'started':
        return (
          <div key='substrate-node-btn-stop' className='btn btn-sm btn-danger' onClick={this.stop}>
            <i className='fas fa-stop mr-1' />Stop
          </div>
        )
      case 'joined':
        return (
          <div key='substrate-node-btn-unjoin' className='btn btn-sm btn-warning' onClick={this.unjoin}>
            <i className='fas fa-minus-circle mr-1' />Disconnect
          </div>
        )
      case 'starting':
        return (
          <div key='substrate-node-btn-starting' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Starting
          </div> 
        )
      case 'stopping':
        return (
          <div key='substrate-node-btn-stopping' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Stopping
          </div> 
        )
      default:
        return null
    }
  }
}