import React, { PureComponent, useState } from 'react'

import {
  Tabs,
  TabContent,
  TabPane,
} from '@obsidians/ui-components'

import Terminal from '@obsidians/terminal'
import stripAnsi from 'strip-ansi'

import substrateNode from './substrateNode'

class LogParser {
  constructor (name) {
    this.name = name
    this.incompleteLine = ''

    this.blockNumberParser = /best:\s#(\d+)\s.*finalized\s#(\d+)\s/
    this.nodeIdentityParser = /Local node identity is:\s(\w*)/
  }

  onLogReceived (log) {
    const lines = (this.incompleteLine + log).split('\n')
    this.incompleteLine = lines.pop()
    lines.push('')
    return lines.map(line => this.parseLine(line)).join('\n')
  }

  parseLine (line) {
    const match = this.blockNumberParser.exec(stripAnsi(line))
    if (match && match.length > 2) {
      substrateNode.updateBlockNumber(this.name, { best: match[1], finalized: match[2] })
    }
    const nodeIdentityMatch = this.nodeIdentityParser.exec(stripAnsi(line))
    if (nodeIdentityMatch && nodeIdentityMatch[1]) {
      substrateNode.updateNodeIdentity(this.name, nodeIdentityMatch[1])
    }
    return line
  }
}

export default class SubstrateNodeTerminal extends PureComponent {
  constructor (props) {
    super(props)
    
    this.state = {
      activeTab: '',
      terminals: [],
    }
    this.tabs = React.createRef()
    this.terminalRefs = {}
    this.logParsers = {}
  }

  componentDidMount () {
    substrateNode.terminals = this
  }

  onTerminalRef = (name, ref) => {
    if (ref) {
      this.terminalRefs[name] = ref
    }
  }

  getLogParser (name) {
    if (!this.logParsers[name]) {
      this.logParsers[name] = new LogParser(name)
    }
    return this.logParsers[name]
  }

  openTerminalAndExec = (name, cmd, config) => {
    this.props.onOpenTerminal(true)
    if (this.state.terminals.indexOf(name) === -1) {
      const terminals = [...this.state.terminals, name]
      this.setState({ activeTab: name, terminals })
    }
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this.tabs.current.currentTab = { key: name, text: <span key={`terminal-${name}`}>{name}</span> }
        const result = await this.terminalRefs[name].exec(cmd, config)
        if (result.code) {
          reject()
        } else {
          resolve()
        }
      }, 100)
    })
  }

  stopAndCloseTerminal = async name => {
    this.tabs.current.currentTab = name
    if (this.terminalRefs[name]) {
      await this.terminalRefs[name].stop()
      this.logParsers[name] = undefined
    }
  }

  render () {
    const { active } = this.props
    const { activeTab, terminals } = this.state

    if (!terminals.length) {
      return null
    }

    return (
      <Tabs
        ref={this.tabs}
        headerClassName='nav-tabs-dark-active'
        noCloseTab
        initialSelected={terminals[0]}
        initialTabs={terminals}
        onSelectTab={tab => this.setState({ activeTab: tab.key })}
      >
        <TabContent className='h-100 w-100' activeTab={activeTab}>
        {
          terminals.map(name => (
            <TabPane key={`substrate-node-${name}`} className='h-100 w-100' tabId={name}>
              <Terminal
                ref={ref => this.onTerminalRef(name, ref)}
                logId={`substrate-node-${name}`}
                active={active && activeTab === name}
                onLogReceived={log => this.getLogParser(name).onLogReceived(log)}
              />
            </TabPane>
          ))
        }
        </TabContent>
      </Tabs>
    )
  }
}