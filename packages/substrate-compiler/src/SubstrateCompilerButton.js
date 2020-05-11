import React, { PureComponent } from 'react'

import {
  Button,
  UncontrolledTooltip
} from '@obsidians/ui-components'

import substrateCompiler from './substrateCompiler'

export default class SubstrateCompilerButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      building: false
    }
  }

  componentDidMount () {
    substrateCompiler.button = this
  }

  onClick = () => {
    if (this.state.building) {
      substrateCompiler.stop()
    } else if (this.props.onClick) {
      this.props.onClick()
    } else {
      substrateCompiler.build({})
    }
  }

  render () {
    const {
      version = 'none',
      className,
      size = 'sm',
      color = 'default',
    } = this.props

    let icon = <span key='substrate-build-icon'><i className='fas fa-hammer' /></span>
    if (this.state.building) {
      icon = (
        <React.Fragment>
          <span key='substrate-building-icon' className='hover-hide'><i className='fas fa-spinner fa-spin' /></span>
          <span key='substrate-stop-build-icon' className='hover-show'><i className='fas fa-stop-circle' /></span>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Button
          color={color}
          size={size}
          id='tooltip-substrate-build-btn'
          key='tooltip-substrate-build-btn'
          className={`hover-block ${className}`}
          onClick={this.onClick}
        >
          {icon}
        </Button>
        <UncontrolledTooltip trigger='hover' delay={0} placement='bottom' target='tooltip-substrate-build-btn'>
          { this.state.building ? 'Stop Build' : `Build (${version})`}
        </UncontrolledTooltip>
      </React.Fragment>
    )
  }
}