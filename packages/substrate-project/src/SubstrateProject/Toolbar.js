import React from 'react'

import { ToolbarButton } from '@obsidians/ui-components'
import { SubstrateCompilerButton, SubstrateFrontendButton } from '@obsidians/substrate-compiler'

import substrateProjectManager from '../substrateProjectManager'

export default function SubstrateToolbar ({ projectRoot, compilerVersion }) {
  return (
    <React.Fragment>
      <SubstrateCompilerButton
        className='rounded-0 border-0 flex-none w-5'
        version={compilerVersion}
        onClick={() => substrateProjectManager.compile()}
      />
      <SubstrateFrontendButton
        className='rounded-0 border-0 flex-none w-5'
        onClick={() => substrateProjectManager.startFrontend()}
      />
      <div className='flex-1' />
      <ToolbarButton
        id='settings'
        icon='fas fa-cog'
        tooltip='Project Settings'
        onClick={() => substrateProjectManager.openProjectSettings()}
      />
    </React.Fragment>
  )
}
