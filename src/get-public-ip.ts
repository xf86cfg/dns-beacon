import axios from 'axios'
export const providers = [
  'https://api.ipify.org?format=json',
  'https://ip.seeip.org/jsonip?',
]

export async function getPublicIp() {
  let i = 0
  while (i < providers.length) {
    const provider = providers[i]
    try {
      const response = await axios.get<{ ip?: string }>(provider)
      const ip = response.data?.ip
      if (!ip || typeof ip !== 'string') {
        throw new Error(`Invalid response from provider ${provider}`)
      }
      return ip
    } catch (ex) {
      console.error(
        `Failed to get IP details from provider ${provider}, error:`,
        JSON.stringify(ex)
      )
    } finally {
      i++
    }
  }
  throw new Error('Failed to get IP details from all providers')
}
