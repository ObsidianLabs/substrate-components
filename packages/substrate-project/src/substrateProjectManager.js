import notification from '@obsidians/notification'
import substrateCompiler from '@obsidians/substrate-compiler'

class SubstrateProjectManager {
  constructor () {
    this.project = null
    this.modal = null
    this.button = null
  }
  
  set substrateProject (project) {
    this.project = project
  }
  get substrateProject () {
    return this.project
  }

  set terminalButton (button) {
    this.button = button
  }

  get projectRoot () {
    return this.project.props.projectRoot
  }

  get compilerVersion () {
    return this.project.props.compilerVersion
  }

  openProjectSettings () {
    if (this.project) {
      this.project.openProjectSettings()
    }
  }

  async checkSettings () {
    if (!this.project) {
      return
    }

    // notification.info('Not in Code Editor', 'Please switch to code editor and build.')
    // return

    const projectRoot = this.projectRoot
    if (!projectRoot) {
      notification.error('No Project', 'Please open a project first.')
      return
    }

    const settings = await this.project.settings.readSettings()
    return settings
  }

  async compile () {
    let settings
    try {
      settings = await this.checkSettings()
    } catch (e) {
      return false
    }

    if (settings.language !== 'javascript' && !this.compilerVersion) {
      notification.error('No CKB Compiler', 'Please install and select a CKB compiler.')
      return false
    }

    const main = settings.main
    if (!main) {
      notification.error('No Main File', 'Please specify a main file in project settings.')
      return false
    }

    await this.project.saveAll()
    this.toggleTerminal(true)

    try {
      await substrateCompiler.build(settings)
    } catch (e) {
      return false
    }

    return true
  }

  async startFrontend () {
    this.toggleTerminal(true)

    try {
      await substrateCompiler.startFrontend()
    } catch (e) {
      return false
    }
    return true
  }

  toggleTerminal (terminal) {
    if (this.button) {
      this.button.setState({ terminal })
    }
    if (this.project) {
      this.project.toggleTerminal(terminal)
    }
  }
}

export default new SubstrateProjectManager()