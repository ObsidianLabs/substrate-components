const { IpcChannel } = require('@obsidians/ipc')
const { DockerImageChannel } = require('@obsidians/docker')

class SubstrateCompilerManager extends IpcChannel {
  constructor () {
    super('substrate-compiler')
    this.channel = new DockerImageChannel('obsidians/rust-w-wasm')
  }

  resize ({ cols, rows }) {
    this.pty.resize({ cols, rows })
  }

  kill () {
    this.pty.kill()
  }
}

module.exports = SubstrateCompilerManager