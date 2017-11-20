# mixpanel-to-slack
Stream your Mixpanel events to Slack in real-time

## CLI

### Install

```
npm install mixpanel-to-slack --save
```

### Usage

Get your API_SECRET from the Mixpanel dashboard of your project. Get your SLACK_WEBHOOK_URI from Slack's apps dashboard

```js
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
```

The `filter` method controls which events should be sent to Slack. The following example only streams events that has `email` properties, and the browser is Chrome, and the `$current_url` has a substring of `/admin`. All 

The `map` method controls what will be sent. In this example we send the `$ts` which is the timestamp, `event` which is the event name, and `properties` which are the entire properties attached to the event.

The `interval` is set to every 5 seconds (5000ms)

the `channel` is the channel at Slack to send messages to. Leave empty for the default channel configured for the Slack webhook URI. Must be an existing channel.

## Frequently Asked Questions

### Is this affiliated or endorsed by Mixpanel?

No. This project is not affiliated or endorsed by Mixpanel.

### Is this affiliated or endorsed by Slack?

No. This project is not affiliated or endorsed by Slack.

### Who made this?

- Torii - https://toriihq.com
- Tal Bereznitskey. Find me on Twitter as @ketacode at https://twitter.com/ketacode
