const mixpanelToSlack = require('mixpanel-to-slack')

const slackWebhookUri = 'SLACK_WEBHOOK_URI'
const mixpanelApiSecret = 'API_SECRET'
const interval = 5000

const filter = ({ $ts, event, properties }) => (
  properties['email'] &&
  properties['$browser'] === 'Chrome' &&
  properties['$current_url'].includes('/admin')
)

const map = ({ $ts, event, properties }) => ({
  $ts,
  event,
  properties
})

const channel = '#mixpanel-to-slack'

mixpanelToSlack({
  slackWebhookUri,
  mixpanelApiSecret,
  channel,
  interval,
  filter,
  map
})
