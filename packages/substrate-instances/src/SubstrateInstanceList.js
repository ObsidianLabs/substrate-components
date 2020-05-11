import React, { useState } from 'react'

import {
  SplitPane,
} from '@obsidians/ui-components'

import { SubstrateNodeTerminal } from '@obsidians/substrate-node'

import InstanceList from './InstanceList'

export default function SubstrateInstanceList (props) {
  const { active, projectRoot, version } = props
  if (!projectRoot) {
    return null
  }

  const [terminal, openTerminal] = useState(false)
  return (
    <SplitPane
      split='horizontal'
      primary='second'
      allowResize={terminal}
      defaultSize={terminal ? 260 : 0}
      minSize={terminal ? 200 : 0}
    >
      <InstanceList projectRoot={projectRoot} version={version} />
      <SubstrateNodeTerminal
        input
        active={active}
        cwd={projectRoot}
        version={version}
        onOpenTerminal={openTerminal}
      />
    </SplitPane>
  )
}