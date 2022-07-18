const functions = require('firebase-functions');

const admin = require('firebase-admin');
const { response } = require('express');
admin.initializeApp(functions.config().firebase);
// https://github.com/abhidiwakar/firebasecloudmessaging_using_firebasefunctions/blob/master/functions/index.js
exports.sendNotificationToTopic = functions.firestore.document('TChatApplication/{uid}').onWrite(async (event) => {
    let docID = event.after.id;// todo get id new document
    let title = event.after.get('title');
    let content = event.after.get('content');
    var message = {
        notification: {
            title: title+docID,
            body: content,
        },
        topic: 'TChatApplication',
    };

    let response = await admin.messaging().send(message);

    console.log('log Topic:  '+response);
});
exports.newMessage = functions.firestore.document("notifications/{uid}/messages/{idMessage}").onWrite(async (snapshot, context) => {
    const uid = snapshot.after.get('uid');// id người nhận thông báo
    //console.log('log uid:  '+uid);
    const title = snapshot.after.get('title');
    const body = snapshot.after.get('body');

     var data_ = snapshot.after.get('data');
    // console.log('data_:  '+data_);
    //const jsonData = JSON.stringify(data_);
    //var objectValue = JSON.parse(jsonData);
  //  console.log('jsonData:  '+jsonData);
  //  console.log(' log data content:  '+objectValue['content']);
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('pushToken');
    //console.log('log fcmToken:  '+fcmToken);
        var message = {
            notification: {
                title: title,
                body: body,
                
            },  
        data:{data:JSON.stringify(data_)},
        android:{
            notification: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                
            },  
        },
        //data:data_,
        token: fcmToken,
    }
    let response = await admin.messaging().send(message);
    console.log('messageTriggerNotify ::::::::::::  :  '+response);// 
}
);
exports.addFriend = functions.firestore.document("notifications/{uid}/add_friend/{idAddFriend}").onWrite(async (snapshot, context) => {
    const uid = snapshot.after.get('uid');// id người nhận thông báo
    console.log('log uid requestAddFriend :  '+uid);
    const title = snapshot.after.get('title');
    const body = snapshot.after.get('body');
     var data_ = snapshot.after.get('data');
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('pushToken');
    //console.log('log fcmToken:  '+fcmToken);
        var message = {
           
            notification: {
                title: title,
                body: body,
                
            },  
          //  click_action: 'FLUTTER_NOTIFICATION_CLICK',
        data:{data:JSON.stringify(data_)},
        android:{
            notification: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                
            },  
        },
        token: fcmToken,
    }
    let response = await admin.messaging().send(message);
    console.log('requestAddFriend ::::::::::::  :  '+response);// 
}
);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
