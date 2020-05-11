import React, { PureComponent } from 'react'

import Navbar from '@obsidians/navbar'
import { NewProjectModal, navbarItem } from '@obsidians/substrate-project' 

export default class SubstrateHeader extends PureComponent {
  render () {
    const {
      projects,
      selectedProject,
      network,
      networkList,
    } = this.props
    
    const navbarLeft = [
      navbarItem(projects, selectedProject)
    ]

    const navbarRight = [
      {
        route: 'explorer',
        title: 'Polkdadot JS',
        icon: 'fa-file-invoice',
        selected: { id: '', name: '' },
        dropdown: [{ none: true }],
      },
      {
        route: 'network',
        title: 'Network',
        icon: network.icon,
        selected: network,
        dropdown: networkList,
      },
    ]

    return (
      <React.Fragment>
        <Navbar
          navbarLeft={navbarLeft}
          navbarRight={navbarRight}
        />
        <NewProjectModal />
      </React.Fragment>
    )
  }
}
