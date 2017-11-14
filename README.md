# WeWork Credit Monitor
My company runs out of WeWork credits from time to time, especially when booking a ton of conference rooms for interviews. So I made a small node app to track our credit usage and post to Slack if we've only got a few left.

This does use an undocumented WeWork API call, so this could stop working at anytime.



#### Environment Variables
|Key                |Description                                                                                                                |
|:------------------|:--------------------------------------------------------------------------------------------------------------------------|
|WEWORK_USER_UUID   |Your WeWork user uuid. If you inspect the API calls the WeWork page makes when looking up room info, you'll find it there. |
|SLACK_WEBHOOK      |The webhook for low credit messages.                                                                                       |
|THRESHOLD          |The threshold for how many credits are left before it starts sending Slack reports. Defaults to 20.                        |
|LOGGING_WEBHOOK    |The webhook for debug logging messages. Optional.                                                                          |
