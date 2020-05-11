import React from 'react'

import Terminal from '@obsidians/terminal'

import substrateCompiler from './substrateCompiler'

export default function (props) {
  return (
    <Terminal
      {...props}
      ref={ref => (substrateCompiler.terminal = ref)}
      logId='substrate-compiler'
      input
      onLogReceived={log => substrateCompiler.onLogReceived(log)}
    />
  )
}