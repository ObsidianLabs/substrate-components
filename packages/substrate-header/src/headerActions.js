export class HeaderActions {
  constructor() {
    this.redux = null
    this.history = null
    this.newProjectModal = null
  }

  selectContract (network, contract) {
    this.redux.dispatch('SELECT_CONTRACT', { network, contract })
  }

  selectAccount (network, account) {
    this.redux.dispatch('SELECT_ACCOUNT', { network, account })
  }

  removeFromStarred (network, account) {
    this.redux.dispatch('REMOVE_ACCOUNT', { network, account })
  }
}

export default new HeaderActions()
