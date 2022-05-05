#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

function reduceMessagesByErrorId(messages) {
  const messagesByIds = messages.reduce((messagesByIdsReduce, message) => {

    return {
      ...messagesByIdsReduce,
      [message.errorId]: [
        ...(messagesByIdsReduce[message.errorId] || []),
        message,
      ]
    }
  }, {});


  return Object.keys(messagesByIds)
    .sort()
    .reduce((acc, key) => ({
        ...acc, [key]: messagesByIds[key]
    }), {})
}

function writeFile(text) {
  fs.writeFileSync(path.resolve('bin', 'error-messages.txt'), text);
}

function messagesToNotion(messagesByErrorId) {


  let template = '';


  Object.keys(messagesByErrorId).forEach((errorId) => {

    template += `
**${errorId}**
`


    messagesByErrorId[errorId].forEach((messageEntry) => {

      template += `
- **${messageEntry.label}**
  - Legacy: ${messageEntry.errorMessage}
  - New:
`
    })

    template += `
---
    `
  })

  return template;
}


function convertMessagesToNotion() {


  const messagesJSON = fs.readFileSync(path.resolve('bin', 'error-messages.json'), 'utf-8');

  const messages = JSON.parse(messagesJSON);

  const messagesSortedByKey = reduceMessagesByErrorId(messages);

  const notionFile = messagesToNotion(messagesSortedByKey);

  writeFile(notionFile);
  // console.log(messagesSortedByKey);

}


convertMessagesToNotion();
