import { web3Enable, web3Accounts } from '@polkadot/extension-dapp'

class SubstrateKeypairManager {
  async loadAllKeypairs () {
    await web3Enable(`Substrate IDE`)
    const allAccounts = await web3Accounts();
    return allAccounts
  }
  
  async newKeypair () {
  }

  async saveKeypair(keypair) {
  }

  async deleteKeypair(keypair) {
  }

  async sign(address, message) {
  }
}

export default new SubstrateKeypairManager()