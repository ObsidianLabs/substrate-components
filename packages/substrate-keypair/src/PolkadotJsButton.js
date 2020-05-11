import React, { PureComponent } from 'react'
import { web3Enable } from '@polkadot/extension-dapp'

export default class PolkadotJsButton extends PureComponent {
  extensionWindow = null
  opts = null

  componentDidMount () {
    window.postMessage({
      message: 'set-main-tab',
      origin: 'page',
    }, '*')

    window.addEventListener('message', ({ data }) => {
      if (data.origin === 'polkadot-js') {
        if (data.type === 'chrome.windows.create') {
          if (data.opts) {
            this.opts = data.opts
          }
          this.openExtension()
        } else if (data.type === 'chrome.windows.remove') {
          this.closeExtension()
        }
      }
    })
  }

  openExtension () {
    const opts = this.opts
    if (!opts) {
      return
    }
    this.closeExtension()
    const { BrowserWindow, getCurrentWindow } = window.require('electron').remote
    this.extensionWindow = new BrowserWindow({
      alwaysOnTop: true,
      fullscreenable: false,
      height: opts.height,
      parrent: getCurrentWindow(),
      resizable: false,
      width: opts.width
    })
    this.extensionWindow.loadURL(opts.url)
  }

  closeExtension () {
    if (!this.extensionWindow) {
      return
    }
    this.extensionWindow.destroy()
    this.extensionWindow = null
  }

  openKeypair = async () => {
    await web3Enable(`Substrate IDE`)
    this.openExtension()
  }

  render () {
    return (
      <div onClick={this.openKeypair}>{this.props.children}</div>
    )
  }
}