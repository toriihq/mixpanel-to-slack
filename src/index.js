const mixpanelTail = require('mixpanel-tail')
const Slack = require('slack-node')
const mapSeries = require('promise-map-series')

const sendToSlack = (slack, channel) => ({ $ts, event, properties }) => {
  return new Promise((resolve, reject) => {
    const short = true
    const fields = Object
      .keys(properties)
      .map(title => {
        const value = properties[title]
        return { title, value, short }
      })

    const options = {
      channel,
      username: 'mixpanel-to-slack',
      text: `${event} (${new Date($ts)})`,
      attachments: [{ fields }]
    }
    console.log(`Sending event to Slack: ${$ts} ${event}`)
    slack.webhook(options, (err, response) => (err ? reject(err) : resolve(response)))
  })
}

const mixpanelToSlack = (options = {}) => {
  const {
    slackWebhookUri,
    mixpanelApiSecret,
    filter = event => true,
    map = event => event,
    interval = 5000,
    channel = null
  } = options

  if (!slackWebhookUri) {
    throw new Error('missing "slackWebhookUri"')
  }

  if (!mixpanelApiSecret) {
    throw new Error('missing "mixpanelApiSecret"')
  }

  slack = new Slack()
  slack.setWebhook(slackWebhookUri)

  mixpanelTail({
    apiSecret: mixpanelApiSecret,
    interval,
    verbose: false,
    startTime: Date.now(),
    handler: (events) => {
      const filtered = events
        .filter(filter)
        .map(map)
      mapSeries(filtered, sendToSlack(slack, channel))
        .then(() => {
          console.log(`${events.length} events, ${filtered.length} filtered events sent to slack`)
        })
    }
  })

  console.log(`Streaming live Mixpanel events (every ${interval}ms)`)
}

module.exports = mixpanelToSlack