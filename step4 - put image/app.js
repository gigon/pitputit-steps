
var userName = "Guest"; // The current user name
var userIconUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"; // the current user icon url

function buildMessageHtml(msg) {
    var messageHtml = "<div class='msgln'>";
    messageHtml += "<b>" + msg.userName + ":</b>";
    if (msg.imageUrl) {
        messageHtml += "<br /><img src='" + msg.imageUrl + "'><br />";
    }
    if (msg.messageText) {
        messageHtml += msg.messageText;
    }
    messageHtml += "</div>";
    return messageHtml;
}

function insertMessageHtml(msg) {
    divChatBox.innerHTML = buildMessageHtml(msg) + divChatBox.innerHTML;
}

function updateCurrentUser() {
    spanUserName.innerHTML = userName;
    userIcon.src = userIconUrl;

    if (isUserSignedIn()) {
        userIcon.style.display = "block";
        pLogout.style.display = "block";
        pLogin.style.display = "none";    
    } else {
        pLogin.style.display = "block";
        pLogout.style.display = "none";
        userIcon.style.display = "none";
    }
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return userName != "Guest";
}

// DOM event handlers

function onLoginClicked() {
    var newUserName = prompt("User name?");
    if (newUserName) {
        userName = newUserName;
        updateCurrentUser();
    }
    return false;
}

function onLogoutClicked() {
    userName = "Guest";
    updateCurrentUser();
    return false;
}

function onSubmitMessageClicked() {
    var messageText = textUserMsg.value.trim();
    var newMessage = { userName: userName, messageText: messageText };

    var imageFile;
    if (inputMediaCapture.files && inputMediaCapture.files.length) {
        imageFile = inputMediaCapture.files[0];
    }

    if (!messageText && !imageFile) {
        alert("Please select an image and/or fill text");
        textUserMsg.focus();
        return false;
    }

    sendNewMessage(newMessage, imageFile, cleanNewMessageInputs);

    return false;
}

function cleanNewMessageInputs() {
    textUserMsg.value = "";
    inputMediaCapture.value = null;
}

// Shortcuts to DOM Elements.
var buttonSubmitMsg = document.getElementById("buttonSubmitMsg");
var textUserMsg = document.getElementById("textUserMsg");
var inputMediaCapture = document.getElementById("inputMediaCapture");
var pLogin = document.getElementById("pLogin");
var pLogout = document.getElementById("pLogout");
var buttonLogin = document.getElementById("buttonLogin");
var buttonLogout = document.getElementById("buttonLogout");
var divChatBox = document.getElementById("divChatBox");
var spanUserName = document.getElementById("spanUserName");
var userIcon = document.getElementsByClassName("userIcon")[0];

buttonSubmitMsg.onclick = onSubmitMessageClicked;
buttonLogin.onclick = onLoginClicked;
buttonLogout.onclick = onLogoutClicked;

//------------------------------------------------------------------
// Firebase
//

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDTO5k3aS-mOZCSA2PJ1w8Eakn91xwtdg4",
    authDomain: "pitputit-6af13.firebaseapp.com",
    databaseURL: "https://pitputit-6af13.firebaseio.com",
    projectId: "pitputit-6af13",
    storageBucket: "pitputit-6af13.appspot.com",
    messagingSenderId: "849608190982"
};
firebase.initializeApp(config);

var messagesRef = firebase.database().ref('messages');

// Load existing messages and listen for new ones
var loadMessages = function() {
    messagesRef.on('child_added', function(snap) {
        console.log('child_added called with ' + (snap.val()));
        insertMessageHtml(snap.val()); // show the new message in the chat box
    })
};
  
function sendNewMessage(newMessage, imageFile, onFinished) {
    if (imageFile) {
        // try to upload the image to firebase storage at path 'messageImages/<image file name>'        
        var imageRef = firebase.storage().ref('messageImages/' + imageFile.name);        
        imageRef.put(imageFile).then(function onComplete(snapshot) {
            console.log("sendNewMessage: image upload done");
            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log("sendNewMessage: image downloadURL = " + downloadURL);
                newMessage.imageUrl = downloadURL;
                pushMessageToDb(newMessage, onFinished);                               
            });
        }).catch(function(err) {
            alert("sendNewMessage: image upload failed: " + err.message);
            onFinished(false);
        });
    } else {
        pushMessageToDb(newMessage, onFinished);
    }
}

function pushMessageToDb(newMessage, onFinished) {
    messagesRef.push(newMessage, function onComplete(err) {
        if (err) {
            alert("sendNewMessage: push failed with " + err);
            onFinished(false);
        } else {
            console.log("sendNewMessage: done");
            onFinished(true);
        }
    });
}

//
// Firebase
//------------------------------------------------------------------

updateCurrentUser();

loadMessages();
