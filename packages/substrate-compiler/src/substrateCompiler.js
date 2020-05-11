import stripAnsi from 'strip-ansi'

import fileOps from '@obsidians/file-ops'
import { IpcChannel } from '@obsidians/ipc'
import notification from '@obsidians/notification'

class SubstrateCompiler {
  constructor () {
    this.channel = new IpcChannel('substrate-compiler')
    this._terminal = null
    this._button = null
    this._frontendButton = null
    this.notification = null
  }

  async invoke (method, ...args) {
    return await this.channel.invoke(method, ...args)
  }

  set terminal (v) {
    this._terminal = v
  }
  set button (v) {
    this._button = v
  }
  set frontendButton (v) {
    this._frontendButton = v
  }

  get projectRoot () {
    if (!this._terminal) {
      throw new Error('SubstrateCompilerTerminal is not instantiated.')
    }
    return this._terminal.props.cwd
  }

  get compilerVersion () {
    if (!this._button) {
      throw new Error('SubstrateCompilerButton is not instantiated.')
    }
    return this._button.props.version
  }

  focus () {
    if (this._terminal) {
      this._terminal.focus()
    }
  }

  async build () {
    const version = this.compilerVersion
    const projectRoot = this.projectRoot

    this._button.setState({ building: true })
    this.notification = notification.info(`Building Substrate Project`, `Building...`, 0)

    const cmd = `cargo build --release`
    const dockerCmd = this.generateBuildCmd(cmd, {
      version,
      rootPath: fileOps.current.path.join(projectRoot, 'node'),
    })
    const result = await this._terminal.exec(dockerCmd)

    this._button.setState({ building: false })
    this.notification.dismiss()

    if (result.code === 137) {
      notification.info('Build Cancelled')
      return
    } else if (result.code) {
      notification.error('Build Failed', `Code has errors.`)
      throw new Error(result.logs)
    }
    notification.success('Build Successful', `CKB script is built.`)
  }

  async stop () {
    if (this._terminal) {
      await this._terminal.exec('docker stop -t 1 substrate-compiler')
    }
  }

  generateBuildCmd(cmd, { version, rootPath }) {
    return [
      'docker', 'run', '-t', '--rm', '--name', `substrate-compiler`,
      '-v', `"${rootPath}:/project"`,
      '-w', '/project',
      '-e', 'TERM=xterm-256color',
      `obsidians/rust-w-wasm:${version}`,
      '/bin/bash', '-c',
      `"${cmd}"`
    ].join(' ')
  }

  frontendWindow = null
  startingFrontend = false
  incompleteLine = ''
  onLogReceived (log) {
    if (!this.startingFrontend) {
      return log
    }
    const lines = (this.incompleteLine + log).split('\n')
    this.incompleteLine = lines.pop()
    lines.push('')
    return lines.map(line => this.parseLine(line)).join('\n')
  }

  parseLine (line) {
    const match = /You can now view (.*) in the browser/.exec(stripAnsi(line))
    if (match && match[0]) {
      this.startingFrontend = true
      this.frontendWindow = window.open('http://localhost:8000', match[0], 'width=1280')
      this.frontendWindow.eval(`window.require('electron').remote.getCurrentWindow().toggleDevTools()`)
    }
    return line
  }

  async startFrontend () {
    if (this._terminal) {
      this.startingFrontend = true
      this.incompleteLine = ''
      this._frontendButton.setState({ running: true })
      await this._terminal.exec(`cd frontend && BROWSER=none yarn start`)
    }
  }

  async stopFrontend () {
    if (this._terminal) {
      await this._terminal.stop()
      this._frontendButton.setState({ running: false })
      if (this.frontendWindow && !this.frontendWindow.closed) {
        this.frontendWindow.close()
      }
    }
  }
}

export default new SubstrateCompiler()
