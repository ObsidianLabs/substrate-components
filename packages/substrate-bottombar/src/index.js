import React from 'react'

import { ToolbarButton } from '@obsidians/ui-components'

import CacheRoute from 'react-router-cache-route'

import { DockerImageSelector } from '@obsidians/docker'
import { PolkadotJsButton } from '@obsidians/substrate-keypair'
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
            <DockerImageSelector
              imageName='obsidians/rust-w-wasm'
              icon='fas fa-hammer'
              title='Rust with WASM'
              noneName='No Rust with WASM installed'
              modalTitle='Rust with WASM Versions'
              downloadingTitle='Downloading Rust with WASM'
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
