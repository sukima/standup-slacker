var Promise = require('bluebird');
var request = require('request-promise');
var fs = Promise.promisifyAll(require('fs'));

var POST_MESSAGE_ENDPOINT = 'https://slack.com/api/chat.postMessage';

function NothingToDoError() {
  this.message = 'Nothing to do.';
}
NothingToDoError.prototype = Object.create(Error.prototype);

function throwMissingOption(prop) {
  var err = new ReferenceError('options.' + prop + ' is missing.');
  err.property = prop;
  throw err;
}

function checkForContent(message) {
  if (!message || message === '') {
    throw new NothingToDoError();
  }
  return message;
}

function checkSlackResponse(body) {
  if (!body.ok) {
    throw new Error(body.error || body);
  }
  return body;
}

function postToSlack(payload) {
  return request({
    method: 'POST',
    url: POST_MESSAGE_ENDPOINT,
    form: payload
  });
};

function Slacker(options) {
  options = options || {};
  this.contentFile = options.file || throwMissingOption('file');
  this.oauthToken = options.token || throwMissingOption('token');
  this.channel = options.channel || '#general';
}

Slacker.prototype.readContentFile = function () {
  return fs.readFileAsync(this.contentFile, 'utf8')
    .catch(function(err) {
      if (err.code === 'ENOENT') {
        throw new NothingToDoError();
      }
      throw err;
    });
};

Slacker.prototype.constructPayload = function (message) {
  return {
    as_user: true,
    token: this.oauthToken,
    channel: this.channel,
    text: message
  };
};

Slacker.prototype.cleanContentFile = function () {
  return fs.writeFileAsync(this.contentFile, '');
};

Slacker.prototype.postStandup = function () {
  return this.readContentFile()
    .call('trim')
    .then(checkForContent)
    .then(this.constructPayload.bind(this))
    .then(postToSlack)
    .then(JSON.parse)
    .then(checkSlackResponse)
    .then(this.cleanContentFile.bind(this))
    .catch(NothingToDoError, function(err) {
      console.log(err.message);
    });
};

module.exports = Slacker;
