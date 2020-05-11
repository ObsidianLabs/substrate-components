import React, { PureComponent } from 'react'

import Workspace, { ProjectLoading, ProjectInvalid } from '@obsidians/workspace'
import fileOps from '@obsidians/file-ops'
import { useBuiltinCustomTabs, modelSessionManager, defaultModeDetector } from '@obsidians/code-editor'
import substrateCompiler, { SubstrateCompilerTerminal } from '@obsidians/substrate-compiler'

import substrateProjectManager from '../substrateProjectManager'
import SubstrateSettings from './SubstrateSettings'

import Toolbar from './Toolbar'
import SubstrateSettingsTab from './SubstrateSettingsTab'

useBuiltinCustomTabs(['markdown'])
modelSessionManager.registerCustomTab('settings', SubstrateSettingsTab, 'Project Settings')
modelSessionManager.registerModeDetector(filePath => {
  const { base } = fileOps.current.path.parse(filePath)
  if (base === '.substraterc') {
    return 'settings'
  } else if (filePath.endsWith('.rs')) {
    return 'rust'
  } else {
    return defaultModeDetector(filePath)
  }
})


export default class CkbProject extends PureComponent {
  constructor (props) {
    super(props)
    this.workspace = React.createRef()
    this.state = {
      loading: true,
      invalid: false,
      initialFile: undefined,
      terminal: false,
    }
  }

  async componentDidMount () {
    substrateProjectManager.substrateProject = this
    this.prepareProject(this.props.projectRoot)
  }

  async componentDidUpdate (prevProps, prevState) {
    if (this.state.terminal !== prevState.terminal) {
      window.dispatchEvent(new Event('resize'))
    }
    if (this.props.projectRoot !== prevProps.projectRoot) {
      this.prepareProject(this.props.projectRoot)
    }
  }

  async prepareProject (projectRoot) {
    this.setState({ loading: true, invalid: false })

    if (!await fileOps.current.isDirectory(projectRoot)) {
      this.setState({ loading: false, invalid: true })
      return
    }

    this.settings = new SubstrateSettings(projectRoot)

    try {
      await this.settings.readSettings()
    } catch (e) {
      this.setState({
        loading: false,
        initialFile: this.settings.configPath,
      })
      return
    }

    if (await this.settings.isMainValid()) {
      this.setState({
        loading: false,
        initialFile: this.settings.mainPath,
      })
      return
    }

    this.setState({
      loading: false,
      initialFile: this.settings.configPath,
    })
  }

  saveAll = async () => {
    return await this.workspace.current.saveAll()
  }

  toggleTerminal = terminal => {
    this.setState({ terminal })
    if (terminal) {
      substrateCompiler.focus()
    }
  }

  openProjectSettings = () => {
    this.workspace.current.openFile(this.settings.configPath)
  }

  render () {
    const {
      projectRoot,
      compilerVersion,
      InvalidProjectActions = null,
    } = this.props
    const { terminal } = this.state

    if (this.state.loading) {
      return <ProjectLoading projectRoot={projectRoot} />
    }

    if (this.state.invalid) {
      return (
        <ProjectInvalid projectRoot={projectRoot || '(undefined)'}>
          {InvalidProjectActions}
        </ProjectInvalid>
      )
    }

    return (
      <Workspace
        ref={this.workspace}
        theme={this.props.theme}
        projectRoot={projectRoot}
        initialFile={this.state.initialFile}
        terminal={terminal}
        defaultSize={272}
        Toolbar={(
          <Toolbar
            projectRoot={projectRoot}
            compilerVersion={compilerVersion}
          />
        )}
        onToggleTerminal={terminal => substrateProjectManager.toggleTerminal(terminal)}
        Terminal={<SubstrateCompilerTerminal active={terminal} cwd={projectRoot} />}
      />
    )
  }
}