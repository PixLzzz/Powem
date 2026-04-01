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

// Cloudinary SDK for file deletion
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret
});

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

// Cloudinary file deletion (requires authenticated user)
exports.cloudinaryDelete = functions.https.onRequest(async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { publicId } = req.body;
    if (!publicId) {
        return res.status(400).send({ error: 'publicId is required' });
    }

    try {
        // Try deleting as image first, then as video (for audio), then as raw
        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        if (result.result !== 'ok') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }
        if (result.result !== 'ok') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
        return res.status(200).send({ result: result.result });
    } catch (error) {
        return res.status(500).send({ error: 'Failed to delete file' });
    }
});

exports.sendContactMessage = functions.database.ref('/messages/{pushKey}').onWrite((change, context) =>{
    const snapshot = change.after.val();
  // Only send email for new messages.
    if (change.before.exists()) {
        return;
    }
    
    
    const mailOptions = {
      to: 'jlccazenave@gmail.com',
      subject: `Information Request from ${snapshot.name}`,
      html: snapshot.html
    };
    return mailTransport.sendMail(mailOptions);
  });