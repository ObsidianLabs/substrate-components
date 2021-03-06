import fileOps from '@obsidians/file-ops'
import actions from './actions'

const projectContextMenus = id => {
  if (id === 'new-project' || id === 'open-project') {
    return
  }

  return [
    {
      text: `Open Containing Folder`,
      onClick: project => fileOps.current.openItem(project.path),
    },
    {
      text: `Open in Terminal`,
      onClick: project => fileOps.current.openInTerminal(project.path),
    },
    null,
    {
      text: `Remove`,
      onClick: project => actions.removeProject(project),
    },
  ]
}

export default function navbarItemProject (projects, selected) {
  const projectDropdown = [
    {
      id: 'new-project',
      name: 'Create Project...',
      icon: 'fas fa-plus',
      onClick: () => actions.newProject(),
    },
    {
      id: 'open-project',
      name: 'Open Project...',
      icon: 'fas fa-folder-plus',
      onClick: () => actions.openProject(),
    },
    { divider: true },
    { header: 'projects' },
    ...(projects.length ? projects : [{ none: true }]),
  ]

  return {
    route: 'guest',
    title: 'Project',
    icon: 'fa-file-code',
    selected,
    dropdown: projectDropdown,
    contextMenu: projectContextMenus,
  }
}