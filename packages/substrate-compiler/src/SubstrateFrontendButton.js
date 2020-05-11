import React, { PureComponent } from 'react'

import {
  Button,
  UncontrolledTooltip
} from '@obsidians/ui-components'

import substrateCompiler from './substrateCompiler'

export default class SubstrateFrontendButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      running: false
    }
  }

  componentDidMount () {
    substrateCompiler.frontendButton = this
  }

  onClick = () => {
    if (this.state.running) {
      substrateCompiler.stopFrontend()
    } else if (this.props.onClick) {
      this.props.onClick()
    } else {
      substrateCompiler.startFrontend({})
    }
  }

  render () {
    const {
      version = 'none',
      className,
      size = 'sm',
      color = 'default',
    } = this.props

    let icon = <span key='substrate-frontend-icon'><i className='far fa-window' /></span>
    if (this.state.running) {
      icon = (
        <React.Fragment>
          <span key='substrate-frontend-starting-icon' className='hover-hide'><i className='fas fa-spinner fa-spin' /></span>
          <span key='substrate-frontend-stop-icon' className='hover-show'><i className='fas fa-stop-circle' /></span>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Button
          color={color}
          size={size}
          id='tooltip-substrate-frontend-btn'
          key='tooltip-substrate-frontend-btn'
          className={`hover-block ${className}`}
          onClick={this.onClick}
        >
          {icon}
        </Button>
        <UncontrolledTooltip trigger='hover' delay={0} placement='bottom' target='tooltip-substrate-frontend-btn'>
          { this.state.running ? 'Stop Frontend' : `Start Frontend`}
        </UncontrolledTooltip>
      </React.Fragment>
    )
  }
}