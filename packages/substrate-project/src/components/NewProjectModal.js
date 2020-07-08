import React, { Component } from 'react'

import {
  Modal,
  DebouncedFormGroup,
  FormGroup,
  Label,
  CustomInput,
} from '@obsidians/ui-components'

import fileOps from '@obsidians/file-ops'
import notification from '@obsidians/notification'
import Terminal from '@obsidians/terminal'

import actions from '../actions'

export default class NewProjectModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      terminal: false,
      name: '',
      version: 'v2.0.0-alpha.5',
      creating: false
    }

    this.modal = React.createRef()
    this.terminal = React.createRef()
    this.path = fileOps.current.path
    this.fs = fileOps.current.fs

    actions.newProjectModal = this
  }

  openModal () {
    this.setState({ terminal: true })
    this.modal.current.openModal()
    return new Promise(resolve => { this.onConfirm = resolve })
  }

  onCreateProject = async () => {
    this.setState({ creating: true })

    let created = await this.createProject()

    if (created) {
      this.onConfirm(created)
      this.setState({
        terminal: false,
        name: '',
        author: '',
        creating: false,
      }, () => this.modal.current.closeModal())
      return
    }
    this.setState({ creating: false })
  }

  onCancel = async () => {
    if (this.state.creating) {
      this.setState({ creating: false })
      await this.terminal.current.stop()
      return false
    }
    return true
  }

  createProject = async () => {
    const { name, version } = this.state
    const projectRoot = this.path.join(fileOps.current.homePath, 'Substrate IDE', name)
    await fileOps.current.ensureDirectory(projectRoot)

    const createNode = this.createNodeCmd({ version })
    try {
      const result = await this.terminal.current.exec(createNode, { cwd: projectRoot })
      if (result.code) {
        notification.error('Cannot Create the Project', result.logs)
        return false
      }
    } catch (e) {
      notification.error('Cannot Create the Project', e.message)
      return false
    }

    if (!this.state.creating) {
      return false
    }

    const createFrontend = this.createFrontendCmd({ version })
    try {
      const result = await this.terminal.current.exec(createFrontend, { cwd: projectRoot })
      if (result.code) {
        notification.error('Cannot Create the Project', result.logs)
        return false
      }
    } catch (e) {
      notification.error('Cannot Create the Project', e.message)
      return false
    }

    if (!this.state.creating) {
      return false
    }

    try {
      const result = await this.terminal.current.exec(`yarn`, { cwd: this.path.join(projectRoot, 'frontend') })
      if (result.code) {
        notification.error('Cannot Create the Project', result.logs)
        return false
      }
    } catch (e) {
      notification.error('Cannot Create the Project', e.message)
      return false
    }

    notification.success('Successful', `New project <b>${name}</b> is created.`)
    return { projectRoot, name }
  }

  createNodeCmd = ({ version }) => {
    return [
      'git clone',
      `-b ${version}`,
      `--depth 1`,
      `https://github.com/substrate-developer-hub/substrate-node-template`,
      'node',
    ].join(' ')
  }

  createFrontendCmd = ({ version }) => {
    return [
      'git clone',
      `-b ${version}`,
      `https://github.com/substrate-developer-hub/substrate-front-end-template`,
      'frontend',
    ].join(' ')
  }

  render () {
    const { name, creating } = this.state

    let projectPath = ''
    if (this.state.name) {
      projectPath = <span>Location: {this.path.join(fileOps.current.homePath, 'Substrate IDE', this.state.name)}</span>
    }

    return (
      <Modal
        ref={this.modal}
        title='Create a New Project'
        textConfirm='Create Project'
        onConfirm={this.onCreateProject}
        pending={creating && 'Creating...'}
        confirmDisabled={!name}
        onCancel={this.onCancel}
      >
        <DebouncedFormGroup
          label='Project name'
          maxLength='40'
          placeholder={'Can only contain lowercase alphanumeric characters or single hyphens'}
          onChange={name => this.setState({ name })}
          feedback={projectPath}
        />
        <FormGroup>
          <Label>Version</Label>
          <CustomInput
            type='select'
            id='substrate-new-project-version'
            value={this.state.version}
            onChange={event => this.setState({ version: event.target.value })}
          >
            <option value='v2.0.0-alpha.5'>v2.0.0-alpha.5</option>
          </CustomInput>
        </FormGroup>
        <div style={{ display: this.state.creating ? 'block' : 'none'}}>
          <Terminal
            ref={this.terminal}
            active={this.state.creating}
            height='200px'
            logId='substrate-project'
            className='rounded overflow-hidden'
          />
        </div>
      </Modal>
    )
  }
}
