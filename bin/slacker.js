#!/usr/bin/env node
var Slacker = require('../');
var path = require('path');

var oauthToken = process.env.SLACK_API_TOKEN;
var postChannel = process.env.SLACK_CHANNEL;
var contentFile = process.argv[2] || path.join(process.env.HOME, 'standup.txt');
var backupFile = process.argv[3] || path.join(process.env.HOME, 'standup-prev.txt');

function dieWithError(err) {
  console.error(err);
  process.exit(1);
}

if (!oauthToken) {
  dieWithError('Missing Oauth Token. Set it with the SLACK_API_TOKEN environment variable.');
}

if (!postChannel) {
  dieWithError('Missing SLACK_CHANNEL in environment.');
}

new Slacker({token: oauthToken, file: contentFile, backup: backupFile, channel: postChannel})
  .postStandup()
  .catch(dieWithError);
