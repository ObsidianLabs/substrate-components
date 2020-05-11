class SubstrateNode {
  constructor () {
    this._terminals = null
    this._buttons = {}
    this.mainNode = ''
    this.nJoins = 0
  }

  set terminals (v) {
    this._terminals = v
  }

  setStatusButton (name, ref) {
    this._buttons[name] = ref
  }

  get version () {
    return this._terminals.props.version
  }

  get projectRoot () {
    return this._terminals.props.cwd
  }

  async purgeChain (name) {
    if (this._terminals) {
      const cmd = `./target/release/node-template purge-chain -y --base-path "./tmp/${name}"`
      const projectRoot = this.projectRoot
      const version = this.version
      const dockerCmd = this.generateDockerCmd(cmd, { version, projectRoot, name: `purge-${name}` })
      await this._terminals.openTerminalAndExec(name, dockerCmd)
    }
  }

  async start (name) {
    this.mainNode = name
    if (this._terminals) {
      const cmd = this.generateStartCmd(name)
      const projectRoot = this.projectRoot
      const version = this.version
      const dockerCmd = this.generateDockerCmd(cmd, { version, projectRoot, name, index: 0 })
      await this._terminals.openTerminalAndExec(name, dockerCmd, { resolveOnLog: /Substrate Node/ })
    }
  }

  async join (name) {
    if (this._terminals) {
      const cmd = [
        this.generateStartCmd(name),
        `--bootnodes /ip4/127.0.0.1/tcp/30333/p2p/${this.nodeIdentity}`
      ].join(' ')
      const projectRoot = this.projectRoot
      const version = this.version
      const dockerCmd = this.generateDockerCmd(cmd, { version, projectRoot, name, index: this.nJoins + 1 })
      await this._terminals.openTerminalAndExec(name, dockerCmd, { resolveOnLog: /Substrate Node/ })
      this.nJoins++
    }
  }

  async unjoin (name) {
    if (this._terminals) {
      await this._terminals.stopAndCloseTerminal(name)
      this.nJoins--
    }
  }


  async stop (name) {
    if (this._terminals) {
      await this._terminals.stopAndCloseTerminal(name)
    }
  }

  generateStartCmd = name => {
    return [
      './target/release/node-template',
      `--base-path "./tmp/${name}"`,
      `--chain local`,
      `--${name}`,
      `--port 30333`,
      `--ws-port 9944`,
      `--rpc-port 9933`,
      `--rpc-cors all`,
      // `--telemetry-url ws://telemetry.polkadot.io:1024`,
      `--unsafe-rpc-external --unsafe-ws-external`,
      `--validator`,
    ].join(' ')
  }

  generateDockerCmd (cmd, { version, projectRoot, name, index = 0 }) {
    return [
      'docker run -t --rm',
      `--name substrate-node-${name}`,
      `-v "${projectRoot}:/project"`,
      `-w /project`,
      `-p ${30333+index}:30333`,
      `-p ${9944+index}:9944`,
      `-p ${9933+index}:9933`,
      `obsidians/rust-w-wasm:${version}`,
      `/bin/bash -c "${cmd}"`,
    ].join(' ')
  }

  updateBlockNumber (name, { best, finalized }) {
    if (this._buttons[name]) {
      this._buttons[name].setState({ best, finalized })
    }
  }

  updateNodeIdentity (name, nodeIdentity) {
    if (this._buttons[name]) {
      this._buttons[name].setState({ nodeIdentity })
    }
    if (name === this.mainNode) {
      this.nodeIdentity = nodeIdentity
    }
  }
}

export default new SubstrateNode()