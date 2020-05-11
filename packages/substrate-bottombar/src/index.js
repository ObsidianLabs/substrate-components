import React from 'react'

import { ToolbarButton } from '@obsidians/ui-components'

import CacheRoute from 'react-router-cache-route'

import { PolkadotJsButton } from '@obsidians/substrate-keypair'
import { RustWithWasmSelector } from '@obsidians/substrate-compiler'
import { TerminalButton } from '@obsidians/substrate-project'

import pjs from './pjs.svg'

export default function SubstrateBottomBar (props) {
  return (
    <React.Fragment>
      <PolkadotJsButton>
        <ToolbarButton
          id='polkadot-js'
          tooltip='polkadot{.js}'
        >
          <img className='d-flex' style={{ height: 21 }} src={pjs} />
        </ToolbarButton>
      </PolkadotJsButton>
      <div className='flex-1' />
      <CacheRoute
        path={`/(guest|network)/:id`}
        render={() => {
          if (!props.projectValid) {
            return null
          }
          return (
            <RustWithWasmSelector
              selected={props.compilerVersion}
              onSelected={compilerVersion => props.onSelectCompiler(compilerVersion)}
            />
          )
        }}
      />
      <CacheRoute
        path={`/guest/:project`}
        component={TerminalButton}
      />
    </React.Fragment>
  )
}
