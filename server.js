const scheduler = require('node-schedule'),
    superagent = require('superagent'),
    logger = require('./logger.js'),
    infoUrl = 'https://rooms.wework.com/api/v4/rooms/info?encrypted_user_uuid=' + process.env.WEWORK_USER_UUID,
    slackWebhook = process.env.SLACK_WEBHOOK,
    creditsLeftThreshold = process.env.THRESHOLD || 20;

var lastCreditsUsed = 0;

function postToSlack(message) {
    superagent.post(slackWebhook, {
        text: message,
        username: 'WeWork Credits Bot',
        icon_url: 'http://thetechmap.com/uploads/Logo_46247.png'
    }, function (err) {
        if (err) {
            logger.error('Error posting to slack', err);
        }
    });
}

//every 15 mintues during work hours
scheduler.scheduleJob('*/15 7-18 * * 1-5', function () {
    superagent.get(infoUrl, function (err, res) {
        if (err) {
            logger.error('Error getting wework credits', err);
        }

        var creditsUsed = res.body.credits_used,
            creditsAllotted = res.body.credits_allotted;

        //only notify if something changed
        if (creditsUsed != lastCreditsUsed) {
            if (creditsUsed > creditsAllotted) {
                postToSlack("Warning, you've used " + (creditsUsed - creditsAllotted) + " credits over your " + creditsAllotted + " included credits!");
            } else if (creditsUsed > creditsAllotted - creditsLeftThreshold) {
                postToSlack("Just a heads up, you only have " + (creditsAllotted - creditsUsed) + " credits left.");
            }
            logger.info('Credits changed to ' + creditsUsed);
        }
        lastCreditsUsed = creditsUsed;
    });
});

logger.info('WeWork Credits Montior started 🤖');
