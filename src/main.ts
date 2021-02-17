import { getPublicIp } from './get-public-ip'
import { tryUpdateDnsRecord } from './dns'
import { exit } from 'process'

const timeout = 60 * 1000

export async function main() {
  const recordName = process.env.RECORD_NAME,
    hostedZoneId = process.env.HOSTED_ZONE_ID,
    region = process.env.AWS_DEFAULT_REGION,
    accessKey = process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId = process.env.AWS_ACCESS_KEY_ID

  if (!(recordName && hostedZoneId && region && accessKey && accessKeyId)) {
    console.error('One or more environment variables are missing')
    exit(1)
  }

  try {
    const ip = await getPublicIp()
    await tryUpdateDnsRecord({
      ip,
      recordName,
      hostedZoneId,
      region,
    })
  } catch (ex) {
    console.log('Execution error', ex)
  }

  setTimeout(() => main(), timeout)
}
