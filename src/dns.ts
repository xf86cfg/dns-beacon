import { Route53 } from 'aws-sdk'

export async function tryUpdateDnsRecord({
  ip,
  recordName,
  hostedZoneId,
  region,
}: {
  ip: string
  recordName: string
  hostedZoneId: string
  region: string
}) {
  const route53 = new Route53({ region })

  const res = await route53
    .testDNSAnswer({
      HostedZoneId: hostedZoneId,
      RecordName: recordName,
      RecordType: 'A',
    })
    .promise()

  const currentIp = res.RecordData?.[0]

  if (res.ResponseCode !== 'NOERROR' || !currentIp) {
    throw new Error(
      `Failed to test DNS record. Response: ${JSON.stringify(res)}`
    )
  }

  if (currentIp !== ip) {
    console.log(
      '::: IP Diff ::: currentIp: ',
      currentIp,
      'ip',
      ip,
      'updating the record'
    )
    const res = await route53
      .changeResourceRecordSets({
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: 'UPSERT',
              ResourceRecordSet: {
                Name: recordName,
                Type: 'A',
                TTL: 60,
                ResourceRecords: [
                  {
                    Value: ip,
                  },
                ],
              },
            },
          ],
        },
      })
      .promise()
    console.log('Requested update record:', JSON.stringify(res))
  }
}
