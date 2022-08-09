const functions = require('firebase-functions');

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { response } = require('express');

admin.initializeApp(functions.config().firebase);
const db = getFirestore();

// https://github.com/abhidiwakar/firebasecloudmessaging_using_firebasefunctions/blob/master/functions/index.js

exports.sendNotificationToTopic = functions.firestore.document('TChatApplication/{uid}').onCreate(async(snap, context) => {
    var data= snap.val();
    let docID = data.id; //  get id new document
    let title = data.title;
    let content = data.content;
    var message = {
        notification: {
            title: title+docID,
            body: content,
        },
        topic: 'TChatApplication',
    };


    return admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.log('Error sending message:', error);
            });

   
});
exports.newMessage = functions.firestore.document('notifications/{uid}/messages/{idMessage}').onCreate(async (snapshot, context) => {
   
   const uid = snapshot.get('uid');// id người nhận thông báo
    const title = snapshot.get('title');
    const body = snapshot.get('body');

     var data_ = snapshot.get('data');
  //   console.log('data_:  '+data_);
    //const jsonData = JSON.stringify(data_);
    //var objectValue = JSON.parse(jsonData);
  //  console.log('jsonData:  '+jsonData);
  //  console.log(' log data content:  '+objectValue['content']);
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let deviceToken = userDoc.get('deviceToken');
    console.log('log deviceToken:  '+deviceToken);
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
        token: deviceToken,
    }
    return admin.messaging().send(message).then((response) => {
       // console.log('Successfully newMessage:', response);
        }).catch((error) => {
         //   console.log('Error newMessage:', error);
            });
    // let response = await admin.messaging().send(message);
    // console.log('messageTriggerNotify ::::::::::::  :  '+response);// 
}
);
exports.addFriend = functions.firestore.document('notifications/{uid}/add_friend/{idAddFriend}').onCreate(async(snap, context) => {
   // var data= snap.val();
    const uid = snap.get('uid');// id người nhận thông báo
    console.log('log uid requestAddFriend :  '+uid);
    const title = snap.get('title');
    const body = snap.get('body');
     var data_ = snap.get('data');
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let deviceToken = userDoc.get('deviceToken');
    console.log('log deviceToken:  '+deviceToken);
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
        token: deviceToken,
    }
    return admin.messaging().send(message).then((response) => {
        //console.log('Successfully requestAddFriend:', response);
        }).catch((error) => {
          //  console.log('Error requestAddFriend:', error);
            });
    // let response = await admin.messaging().send(message);
    // console.log('requestAddFriend ::::::::::::  :  '+response);// 
}
);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// firebase login
// firebase deploy --only functions