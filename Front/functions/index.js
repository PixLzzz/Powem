// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendContactMessage = functions.database.ref('/messages/{pushKey}').onWrite((change, context) =>{
    const snapshot = change.after.val();
    console.log(snapshot)
  // Only send email for new messages.
    if (change.before.exists()) {
        return;
    }
    
    
    const mailOptions = {
      to: 'jlccazenave@gmail.com',
      subject: `Information Request from ${snapshot.name}`,
      html: snapshot.html
    };
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Mail sent to: jlccazenave@gmail.com')
    });
  });