var expect = require('chai').expect;
const authorize = require('../services/googleApiAuthService');
const { listLabels, listMessages, sendEmail } = require('../services/gmailApiServices');
var authClient;

describe('Gmail API test suite', () => {
  before('Initialize all services', async () => {
    authClient = await authorize().then().catch(console.error);
  });

  it('To check the list of labels available currently', async () => {
    let labels = await listLabels(authClient).catch(console.error);
    expect(labels[0].name.replace('-', '')).to.equal('CHAT');
  });

  it('To verify email can be sent successfully', async () => {
    let message = 'TO: worthengineeringyt@gmail.com\n' +
      'Subject: Test Email\n' +
      'Content-Type: text/html; charset=utf-8\n\n' +
      'Hello World! from nodejs bhai';

    let emailData = await sendEmail(authClient, message).catch(console.error);
    console.log(emailData);
    expect(emailData.id).to.not.be.null;
  });

  it('To verify email content like subject', async () => {
    let messages = await listMessages(authClient).catch(console.error);
    console.log(messages + ' from test');
    expect(messages).to.not.be.null;
    expect(messages).to.equal('Hello World!');
  });
});
