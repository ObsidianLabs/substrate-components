import compiler from '@obsidians/substrate-compiler'
import { dockerChannel } from '@obsidians/docker'

export default async function checkDependencies () {
  try {
    const results = await Promise.all([
      dockerChannel.check(),
      compiler.channel.installed(),
    ])
    return results.every(x => !!x)
  } catch (e) {
    return false
  }
}