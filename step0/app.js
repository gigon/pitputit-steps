var messagesArray = [];  // The messages

var userName = "Guest"; // The current user name
var userIconUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"; // the current user icon url

function displayMessages() {
    var messagesHtml = "";

    for (var i=0; i < messagesArray.length; i++) {
        messagesHtml += buildMessageHtml(messagesArray[i]);
    }

	divChatBox.innerHTML = messagesHtml;
}

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

function sendNewMessage(newMessage, onFinished) {
    messagesArray.unshift(newMessage);

    onFinished();
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
    var imageUrl = textImageUrl.value.trim();

    if (!messageText && !imageUrl) {
        alert("Please select an image and/or fill text");
        textUserMsg.focus();
        return false;
    }

    var newMessage = { userName: userName, messageText: messageText, imageUrl: imageUrl };
    sendNewMessage(newMessage, cleanNewMessageInputs);

    displayMessages();
    
    return false;
}

function cleanNewMessageInputs() {
    textUserMsg.value = "";
    textImageUrl.value = "";
}

// Shortcuts to DOM Elements.
var buttonSubmitMsg = document.getElementById("buttonSubmitMsg");
var textUserMsg = document.getElementById("textUserMsg");
var textImageUrl = document.getElementById("textImageUrl");
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

updateCurrentUser();

displayMessages();
