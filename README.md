Tired of rushing at the last minute to copy paste your stand-up updates into
slack?

Fear no more - with `standup-slacker` you can pre-populate a text file which
will be _auto-slacked_ at the moment standup starts.

This utility relys on your own scheduling system (like cron). It simply reads
in a file and sends it to slack then erases the file contents for the next run.
If there is nothing in the file then it is a no-op.

## Example

#### Launch script

For setting up the environment variables and handling UTC -> Local time in
crontab.

```bash
#!/bin/bash

export TZ=":US/Eastern"
export NODE_VERSION="5.10"
export SLACK_API_TOKEN="xoxp-REDACTED"
export SLACK_CHANNEL="#standup"

if [ "$(date +%z)" == "$1" ]; then
  $HOME/.nvm/nvm-exec $HOME/source/standup-slacker/bin/slacker.js
fi
```

#### crontab

```crontab
# 11:30 EDT Mon, Tues, Thurs, Fri
30 15 * * 1,2,4,5 $HOME/send-slack-update.sh -0400 >/dev/null
# 09:30 EDT Wed
30 13 * * 3       $HOME/send-slack-update.sh -0400 >/dev/null

# 11:30 EST Mon, Tues, Thurs, Fri
30 16 * * 1,2,4,5 $HOME/send-slack-update.sh -0500 >/dev/null
# 09:30 EST Wed
30 14 * * 3       $HOME/send-slack-update.sh -0500 >/dev/null
```
