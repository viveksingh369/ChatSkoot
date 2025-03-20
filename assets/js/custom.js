// Global variable declared (fixed typo)
var currentUser = '';
var chatKey = '';

document.addEventListener('keydown', function(key){
    if (key.which === 13) {
        sendTextMsg();
    }
});

// document.addEventListener('click', mobileSendBtn);

function mobileSendBtn(){
    sendTextMsg();
    // alert('gtr');
}

function loadMessage(chatKey, frndPhoto){
    var db = firebase.database().ref('chatMessage').child(chatKey);
    db.on('value', function(chats){
        var displayMessage = '';

        chats.forEach(function(data){
            
            var chatMsgs = data.val();
            var msg = '';

            if(chatMsgs.msgType === 'fileMsg' ){
                msg = `<img src="${chatMsgs.chatMsg}" class="img-fluid">`;
            } else if(chatMsgs.msgType === 'audioMsg' ){
                msg = `<audio class="mt-4" id="audio" controls>
                    <source src="${chatMsgs.chatMsg}" type="audio/webm" />
                </audio>`;
            }
            else{
                msg = chatMsgs.chatMsg;
            }

            if (chatMsgs.user_id !== currentUser) 
            {
                displayMessage += `<div class="row justify-content-end" id="recieve">
                                        <div class="col-6 col-sm-6 col-md-6">
                                            <p class="border bg-gradient float-end sentMsg">${msg}
                                                <span class="chatTime mt-3">${chatMsgs.timestamp} PM</span></p>
                                        </div>
                                        <div class="col-2 col-sm-1 col-md-1">
                                            <img src="${frndPhoto}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                        </div>
                                    </div>`;
            } 
            else 
            {
                displayMessage += `<div class="row" id="sent">
                                    <div class="col-2 col-sm-1 col-md-1">
                                        <img src="${firebase.auth().currentUser.photoURL}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                    </div>
                                    <div class="col-6 col-sm-6 col-md-6">
                                        <p class="border bg-gradient recieveMsg">${msg}
                                            <span class="chatTime float-end mt-3">${chatMsgs.timestamp} PM</span></p>
                                    </div>
                                </div>`;
            }
        });

        document.getElementById('msgBox').innerHTML = displayMessage;
        
        // Using scrollHeight instead of clientHeight for proper scrolling
        document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
    });
}

function startChat(frndKey, frndName, frndPhoto){
    var storeDb = firebase.database().ref('frndList');
    var frndDetails = {frndId:frndKey, userId:currentUser};
    var flag = false;
    
    storeDb.on('value', function(frndData){

        frndData.forEach(function(data){
            var usrs = data.val();

            if (usrs.frndId === frndDetails.frndId && usrs.userId === frndDetails.userId || (usrs.frndId === frndDetails.userId && usrs.userId === frndDetails.frndId)) {
                chatKey = data.key;
                flag = true;
            }
        });

        if (flag === false) {
            chatKey = storeDb.push(frndDetails);
            chatKey.getKey;
            document.getElementById('chatPanel').removeAttribute('style');
            document.getElementById('theme_card').setAttribute('style', 'display:none');

            hide_chat();
        }else{
            document.getElementById('chatPanel').removeAttribute('style');
            document.getElementById('theme_card').setAttribute('style', 'display:none');

            hide_chat();
        }

        document.getElementById('frndPhoto').src = frndPhoto;
        document.getElementById('frndName').innerHTML = frndName;
        // document.getElementById('frndLastSeen').innerHTML = '';
        
        document.getElementById('msgBox').innerHTML = '';
        
        // onKeyDown();
        document.getElementById('textMsg').value = '';
        document.getElementById('textMsg').focus();

        loadMessage(chatKey, frndPhoto);

    });
}

function show_chat(){
    document.getElementById('side-1').classList.remove('d-none', 'd-md-block');
    document.getElementById('side-2').classList.add('d-none');
    // loadMessage();
}

function hide_chat(){
    document.getElementById('side-1').classList.add('d-none', 'd-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}

// function sendTextMsg(){
//     var textMsg = document.getElementById('textMsg').value;
    
//     // Don't send empty messages
//     if(textMsg.trim() === '') {
//         return;
//     }
    
//     var timestamp = new Date().toLocaleDateString();
//     var msg = {
//         user_id: currentUser, 
//         chatMsg: textMsg, 
//         msgType: 'textMSg', 
//         timestamp: timestamp
//     };

//     sendDb = firebase.database().ref('chatMessage');

//     if (sendDb.child(chatKey).push(msg)) {
//         // Clear the text input after sending
//         document.getElementById('textMsg').value = "";
//         document.getElementById('textMsg').focus();
        
//         // Hide emoji panel after sending message
//         hideSmilyPanel();
        
//         // Update send button icon
//         changeSendIcon(document.getElementById('textMsg'));
        
//         // Scroll to bottom
//         document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
//     }
// }

function sendTextMsg() {
    var txtMsg = document.getElementById('textMsg').value.trim();
    
    if (txtMsg !== '') {
        // Get the current time for the timestamp
        var today = new Date();
        var time = today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Reference to the database
        var db = firebase.database().ref('chatMessage').child(chatKey);
        
        // Push the message to Firebase
        var msgId = db.push().key;
        var updates = {};
        var message = {
            user_id: currentUser,
            chatMsg: txtMsg,
            timestamp: time,
            msgType: 'textMsg'
        };
        
        updates[msgId] = message;
        db.update(updates);
        
        // Clear the input field
        document.getElementById('textMsg').value = '';
        
        // Reset the send/mic icon
        document.getElementById('send').setAttribute('style', 'display:none');
        document.getElementById('audioMic').removeAttribute('style');
        
        // Update the last message for the friend list
        updateLastMessage(chatKey, txtMsg);
    }
}

function updateLastMessage(chatKey, message) {
    // Reference to the chats database
    var db = firebase.database().ref('chats').child(chatKey);
    
    // Update the last message
    db.update({
        lastMsg: message,
        lastMsgTime: firebase.database.ServerValue.TIMESTAMP
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Make sure the send icon has the correct click handler
    var sendButton = document.getElementById('send');
    if (sendButton) {
        sendButton.onclick = sendTextMsg;
    }
    
    // The mobile send button function should simply call sendTextMsg
    window.mobileSendBtn = function() {
        sendTextMsg();
    };
});

function chooseImage() {
    document.getElementById('fileUpload').click();
}

function sendImage(event) {
    var file = event.files[0];

    if (!file.type.match('image.*')) {
        alert('Please select image file only');
    }else{
        var reader = new FileReader();

        reader.addEventListener('load', function() {
            var textMsg = reader.result;
            var timestamp = new Date().toLocaleString();
            
            var msg = {
                user_id: currentUser, 
                chatMsg: textMsg, 
                msgType: 'fileMsg', 
                timestamp: timestamp
            };
        
            sendDb = firebase.database().ref('chatMessage');
        
            if (sendDb.child(chatKey).push(msg)) {
                // Scrolling after image is added to DOM
                setTimeout(function() {
                    document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
                }, 200);
            }
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

function loadFrndList() {
    var loadDb = firebase.database().ref('frndList');
    var usrDb = firebase.database().ref('users');

    loadDb.on('value', function(listData){
    document.getElementById('loadFrndLists').innerHTML = 
                        `<li class="list-group-item" style="background-color: #f8f8f8;">
                            <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
                        </li>`;
        listData.forEach(function(data){
            frndLists = data.val();
            var frndKey = '';

            if (frndLists.frndId === currentUser) {
                frndKey = frndLists.userId;
            }else if(frndLists.userId === currentUser){
                frndKey = frndLists.frndId;
            }

            if (frndKey !== '') {
                usrDb.child(frndKey).on('value', function(data){
                    usrInf = data.val();
    
                    document.getElementById('loadFrndLists').innerHTML += 
                                        `<li class="list-group-item list-group-item-action" onclick="startChat('${data.key}', '${usrInf.name}', '${usrInf.photoURL}')">
                                        <div class="row">
                                            <div class="col-md-2">
                                                <img src="${usrInf.photoURL}" class="rounded-circle" alt="Users-Logo" height="50px" width="50px">
                                            </div>
                                            <div class="col-md-10">
                                                <div class="user-name">${usrInf.name}</div>
                                                <div class="user-text">Library Of Liberty | LOL</div>
                                            </div>
                                        </div>
                                    </li>`;
                });
            }
        });
    });
}

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);

    // loadFrndList();
}

function signOut() {
    firebase.auth().signOut();
    window.location.reload();
}

function fetchUserList() {
    document.getElementById('UrsList').innerHTML = 
                                        `<div class="text-center">
                                            <div class="spinner-border fs-5"></div>
                                            <p class="fw-bold">Loading...</p>
                                        </div>`;
    
    var firebaseFrndDb = firebase.database().ref('users');
    let counterDb = firebase.database().ref('notification');
    var list = '';
    var userData ='';

    firebaseFrndDb.on('value', function(userDetails){

        if (userDetails.hasChildren()) {
            list = `<li class="list-group-item" style="background-color: #f8f8f8;">
            <input type="text" name="#" class="form-control rounded" placeholder="Search or Start chat">
            </li>`;
            document.getElementById('UrsList').innerHTML = list;
        }

        userDetails.forEach(function(data){
            userData = data.val();
            if (userData.email !==firebase.auth().currentUser.email) {
                counterDb.orderByChild('sendTo').equalTo(data.key).on('value', function(notify){
                    if (notify.numChildren() > 0 && Object.values(notify.val())[0].sendFrom === currentUser) {
                        list = `<li class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                </div>
                                <div class="col-md-10">
                                    <div class="user-name">
                                    ${userData.name}
                                    <button class="btn btn-secondary btn-sm disabled float-end" onclick="sendRequest('${data.key}')"><i class="fa-solid fa-user-plus"></i> Sent </button>
                                    </div>
                                </div>
                            </div>
                        </li>`; 
                        document.getElementById('UrsList').innerHTML += list;
                    }else{
                        counterDb.orderByChild('sendFrom').equalTo(data.key).on('value', function(notify){
                            if (notify.numChildren() > 0 && Object.values(notify.val())[0].sendTo === currentUser) 
                            {
                                list = `<li class="list-group-item list-group-item-action">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                        </div>
                                        <div class="col-md-10">
                                            <div class="user-name">
                                            ${userData.name}
                                            <button class="btn btn-success btn-sm float-end" onclick="sendRequest('${data.key}')"> Friend </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>`; 
                                document.getElementById('UrsList').innerHTML += list;
                            }else{
                                list = `<li class="list-group-item list-group-item-action">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="${userData.photoURL}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                                        </div>
                                        <div class="col-md-10">
                                            <div class="user-name">
                                            ${userData.name}
                                            <button class="btn btn-primary btn-sm float-end" onclick="sendRequest('${data.key}')"><i class="fa-solid fa-user-plus"></i> Send Request </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>`; 
                                document.getElementById('UrsList').innerHTML += list;
                            }
                        });
                    }
                });
            }
        });
    });                                  
}

function sendRequest(key) {
    let notifications = {
        sendTo: key,
        sendFrom: currentUser,
        senderName: firebase.auth().currentUser.displayName,
        senderPhoto: firebase.auth().currentUser.photoURL,
        status: 'Pending',
        dateTime: new Date().toLocaleString(),
    }

    firebase.database().ref('notification').push(notifications, function(error){
        if (error) {
            alert(error);
        }else{
            fetchUserList();
        }
    })
}

function notificationCounter() {
    var counterDb = firebase.database().ref('notification');

    counterDb.orderByChild('sendTo').equalTo(currentUser).on('value', function(notify){
        if (notify && notify.val()) {
            var objsArry = Object.values(notify.val()).filter(n => n.status === 'Pending'); 
            document.getElementById('notiCounter').innerHTML = objsArry.length;  
        }
    });
}

function getAllNotification() {
    document.getElementById('notify').innerHTML = 
                            `<div class="text-center">
                                <div class="spinner-border fs-5"></div>
                                <p class="fw-bold">Loading...</p>
                            </div>`;
    
    let notiDB = firebase.database().ref('notification');
    var list = '';

    notiDB.orderByChild('sendTo').equalTo(currentUser).on('value', function(notifyy){
        // Reset list to empty before adding new notifications
        list = '';
        
        if (!notifyy.exists()) {
            document.getElementById('notify').innerHTML = '<div class="text-center">No notifications</div>';
            return;
        }
        
        notifyy.forEach(function(data){
            notifyData = data.val();
            if (notifyData.status === 'Pending') {
                list += `<li class="list-group-item list-group-item-action">
                        <div class="row">
                            <div class="col-md-2">
                                <img src="${notifyData.senderPhoto}" class="rounded-circle" alt="Users-Logo" height="30px" width="30px">
                            </div>
                            <div class="col-md-10">
                                <div class="user-name">${notifyData.senderName}
                                <button class="btn btn-danger btn-sm float-end ms-1" onclick="rejectReq('${data.key}')"><i class="fa-solid fa-user-times"></i> Reject </button>

                                <button class="btn btn-success btn-sm float-end" onclick="acceptReq('${data.key}')"><i class="fa-solid fa-user-plus"></i> Accept </button>
                                </div>
                            </div>
                        </div>
                    </li>`;
            }
        });

        if (list === '') {
            document.getElementById('notify').innerHTML = '<div class="text-center">No pending notifications</div>';
        } else {
            document.getElementById('notify').innerHTML = list;
        }
    });                                  
}

function rejectReq(key){
    let Db1 = firebase.database().ref('notification');
    Db1.child(key).once('value', function(notifydata){
        let obj = notifydata.val();
        obj.status = 'Reject';

        firebase.database().ref('notification').child(key).update(obj, function(error){
            if (error) {
                alert(error);
            }else{
                getAllNotification();
            }
        });
    });
}

function acceptReq(key){
    let Db2 = firebase.database().ref('notification');
    Db2.child(key).once('value', function(notifydata){
        var obj = notifydata.val();
        obj.status = 'Accept';

        firebase.database().ref('notification').child(key).update(obj, function(error){
            if (error) {
                alert(error);
            }else{
                let storeDb2 = firebase.database().ref('frndList');
                var frndDetails = {frndId:obj.sendFrom, userId:obj.sendTo};

                storeDb2.push(frndDetails, function(error){
                    if (error) {
                        alert(error);
                    }else{
                        loadFrndList();
                    }
                });
                getAllNotification();
            }
        });
    });
}

// Improved emoji handling functions
function openSmily() {
    const smileyBox = document.getElementById('smileyBox');
    
    // Toggle the display of the emoji panel
    if (smileyBox.style.display === 'none' || smileyBox.style.display === '') {
        smileyBox.style.display = 'block';
    } else {
        smileyBox.style.display = 'none';
    }
    
    // Make sure emojis are loaded
    loadAllEmoji();
}

function hideSmilyPanel() {
    document.getElementById('smileyBox').setAttribute('style', 'display:none');
}

function getEmoji(control) {
    const textMsgElement = document.getElementById('textMsg');
    const emojiChar = control.innerHTML;
    
    // Add the emoji to the current text
    textMsgElement.value += emojiChar;
    textMsgElement.focus();
    
    // Update send button after adding emoji
    changeSendIcon(textMsgElement);
}

function loadAllEmoji() {
    // Check if emojis are already loaded
    const pillsSmiley = document.getElementById('pills-smiley');
    if (pillsSmiley.childElementCount > 0) {
        return; // Emojis already loaded
    }
    
    let emoji = '';
    
    // Load smiley emojis
    for(let i=128512; i <= 128591; i++) {
        emoji += `<span style="cursor: pointer; font-size: 24px; padding: 5px; display: inline-block;" onclick="getEmoji(this)">&#${i};</span>`;
    }
    
    pillsSmiley.innerHTML = emoji;
    
    // Also load flag emojis
    let flagEmoji = '';
    for(let i=127462; i <= 127487; i += 2) {
        flagEmoji += `<span style="cursor: pointer; font-size: 24px; padding: 5px; display: inline-block;" onclick="getEmoji(this)">&#${i};&#${i+1};</span>`;
    }
    
    document.getElementById('pills-flag').innerHTML = flagEmoji;
}

document.addEventListener('DOMContentLoaded', function() {
    // Add CSS to make sure the emoji panel shows on top
    const style = document.createElement('style');
    style.textContent = `
        .emojiBox {
            position: absolute;
            bottom: 100%;
            left: 0;
            z-index: 1000;
            background-color: white;
            border-radius: 5px;
            overflow-y: auto;
            max-height: 200px;
            width: 300px;
        }
    `;
    document.head.appendChild(style);
    
    // Make sure the emoji panels are loaded
    loadAllEmoji();
});


function changeSendIcon(control) {
    if (control.value !== '') {
        document.getElementById('send').removeAttribute('style');
        document.getElementById('audioMic').setAttribute('style', 'display:none');
    }else{
        document.getElementById('send').setAttribute('style', 'display:none');
        document.getElementById('audioMic').removeAttribute('style');
    }
}

//Audio functionality
let chunk = [];
let recorder;
var timeout;

function recordStart(control) {
    let device = navigator.mediaDevices.getUserMedia({audio:true});
    device.then((stream)=> {
        if (recorder === undefined) {  
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = e => {
                chunk.push(e.data);
        
                if (recorder.state === 'inactive') {
                    let blob = new Blob(chunk, {type:'audio/webm'});
                    var reader = new FileReader();
        
                    reader.addEventListener('load', function() {
                        var textMsg = reader.result;
                        var timestamp = new Date().toLocaleString();
                        var msg = {
                            user_id: currentUser, 
                            chatMsg: textMsg, 
                            msgType: 'audioMsg', 
                            timestamp: timestamp
                        };
                    
                        sendDb = firebase.database().ref('chatMessage');
                    
                        if (sendDb.child(chatKey).push(msg)) {
                            document.getElementById('textMsg').value = '';
                            document.getElementById('textMsg').focus();               
                        }
                    }, false);
               
                    reader.readAsDataURL(blob);
                }
            }
            recorder.start();
            control.setAttribute('class', 'fa fa-circle-stop');
        }
    });

    if (recorder !== undefined)  {
        if (control.getAttribute('class').indexOf('circle-stop') !== -1) {
            recorder.stop();
            control.setAttribute('class', 'fa fa-microphone')
        }else{
            chunk = [];
            recorder.start();
            control.setAttribute('class', 'fa fa-circle-stop');
        }
    }
}

// Initialize emoji panels when page loads
loadAllEmoji();

// Example of how to structure a sent message

function createSentMessage(message, timestamp) {
    return `
        <div class="row justify-content-end" id="recieve">
            <div class="col-6 col-sm-6 col-md-6">
                <p class="border bg-gradient float-end sentMsg">${message}
                    <span class="chatTime mt-3">${timestamp}</span></p>
            </div>
            <div class="col-2 col-sm-1 col-md-1">
                <img src="${document.getElementById('frndPhoto').src}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
            </div>
        </div>
    `;
}

// Example of how to structure a received message
function createReceivedMessage(message, timestamp) {
    return `
        <div class="row" id="sent">
            <div class="col-2 col-sm-1 col-md-1">
                <img src="${firebase.auth().currentUser.photoURL}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
            </div>
            <div class="col-6 col-sm-6 col-md-6">
                <p class="border bg-gradient recieveMsg">${message}
                    <span class="chatTime float-end mt-3">${timestamp}</span></p>
            </div>
        </div>
    `;
}

// Usage example (assuming you have a function that adds messages to the chat)
function addMessageToChat(message, isFromMe) {
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (isFromMe) {
        document.getElementById('msgBox').innerHTML += createSentMessage(message, timestamp);
    } else {
        document.getElementById('msgBox').innerHTML += createReceivedMessage(message, timestamp);
    }
    
    // Scroll to bottom of chat
    document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
}

// Initialize when Firebase auth state changes
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        currentUser = user.uid;
        loadFrndList();
        notificationCounter();
    }
});



// Add this function to handle camera capture
function openCamera() {
    // Create video and canvas elements for camera capture
    const videoContainer = document.createElement('div');
    videoContainer.id = 'camera-container';
    videoContainer.style.position = 'fixed';
    videoContainer.style.top = '0';
    videoContainer.style.left = '0';
    videoContainer.style.width = '100%';
    videoContainer.style.height = '100%';
    videoContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    videoContainer.style.zIndex = '1000';
    videoContainer.style.display = 'flex';
    videoContainer.style.flexDirection = 'column';
    videoContainer.style.alignItems = 'center';
    videoContainer.style.justifyContent = 'center';
    
    const video = document.createElement('video');
    video.style.maxWidth = '100%';
    video.style.maxHeight = '70%';
    video.style.borderRadius = '8px';
    video.autoplay = true;
    
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '20px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    const captureBtn = document.createElement('button');
    captureBtn.className = 'btn btn-primary';
    captureBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Capture';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-danger';
    cancelBtn.innerHTML = '<i class="fa-solid fa-times"></i> Cancel';
    
    const sendBtn = document.createElement('button');
    sendBtn.className = 'btn btn-success';
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send';
    sendBtn.style.display = 'none';
    
    const retakeBtn = document.createElement('button');
    retakeBtn.className = 'btn btn-secondary';
    retakeBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Retake';
    retakeBtn.style.display = 'none';
    
    buttonContainer.appendChild(captureBtn);
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(sendBtn);
    buttonContainer.appendChild(retakeBtn);
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(canvas);
    videoContainer.appendChild(buttonContainer);
    
    document.body.appendChild(videoContainer);
    
    // Get camera stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            
            // Close camera function
            function closeCamera() {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                document.body.removeChild(videoContainer);
            }
            
            // Cancel button event
            cancelBtn.addEventListener('click', closeCamera);
            
            // Capture button event
            captureBtn.addEventListener('click', function() {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Show captured image
                video.style.display = 'none';
                canvas.style.display = 'block';
                canvas.style.maxWidth = '100%';
                canvas.style.maxHeight = '70%';
                canvas.style.borderRadius = '8px';
                
                // Show send and retake buttons, hide capture button
                captureBtn.style.display = 'none';
                sendBtn.style.display = 'inline-block';
                retakeBtn.style.display = 'inline-block';
            });
            
            // Retake button event
            retakeBtn.addEventListener('click', function() {
                // Show video, hide canvas
                video.style.display = 'block';
                canvas.style.display = 'none';
                
                // Show capture button, hide send and retake buttons
                captureBtn.style.display = 'inline-block';
                sendBtn.style.display = 'none';
                retakeBtn.style.display = 'none';
            });
            
            // Send button event
            sendBtn.addEventListener('click', function() {
                // Convert canvas to blob
                canvas.toBlob(function(blob) {
                    // Send the image
                    sendCameraImage(blob);
                    closeCamera();
                });
            });
        })
        .catch(function(error) {
            alert("Camera error: " + error.message);
            document.body.removeChild(videoContainer);
        });
}

// Function to send camera image
function sendCameraImage(blob) {
    const reader = new FileReader();
    
    reader.addEventListener('load', function() {
        const imageData = reader.result;
        const timestamp = new Date().toLocaleString();
        
        const msg = {
            user_id: currentUser,
            chatMsg: imageData,
            msgType: 'fileMsg',
            timestamp: timestamp
        };
        
        const sendDb = firebase.database().ref('chatMessage');
        
        if (sendDb.child(chatKey).push(msg)) {
            // Scroll to bottom after image is added
            setTimeout(function() {
                document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
            }, 200);
        }
    });
    
    reader.readAsDataURL(blob);
}

// Update the dropdown menu to add camera functionality
function updateCameraOption() {
    // Find the dropdown menu item for camera
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    
    // Loop through items to find the camera option
    dropdownItems.forEach(item => {
        if (item.textContent.trim() === 'Camera') {
            // Update with onclick event
            item.setAttribute('onclick', 'openCamera()');
        }
    });
}

// Call this function when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCameraOption();
});

// Also call it when Firebase auth changes to ensure it's applied
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        currentUser = user.uid;
        loadFrndList();
        notificationCounter();
        updateCameraOption();
    }
});

// Add this function to handle video file selection
function chooseVideo() {
    document.getElementById('videoUpload').click();
}

// Add this function to send video files
function sendVideo(event) {
    var file = event.files[0];
    
    // Check if the file is a video
    if (!file.type.match('video.*')) {
        alert('Please select a video file only');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator('Uploading video...');
    
    // Check file size
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
        hideLoadingIndicator();
        alert('Video file is too large. Please select a file smaller than 50MB.');
        return;
    }
    
    var reader = new FileReader();
    
    reader.addEventListener('load', function() {
        var videoData = reader.result;
        var timestamp = new Date().toLocaleString();
        
        var msg = {
            user_id: currentUser, 
            chatMsg: videoData, 
            msgType: 'videoMsg', 
            timestamp: timestamp,
            fileName: file.name,
            fileSize: formatFileSize(file.size)
        };
        
        sendDb = firebase.database().ref('chatMessage');
        
        if (sendDb.child(chatKey).push(msg)) {
            // Hide loading indicator
            hideLoadingIndicator();
            
            // Scroll to new message
            setTimeout(function() {
                document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
            }, 200);
        }
    }, false);
    
    reader.addEventListener('error', function() {
        hideLoadingIndicator();
        alert('Error reading video file. Please try again.');
    });
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Add loading indicator functions
function showLoadingIndicator(message) {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '2000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.flexDirection = 'column';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner-border text-light';
        spinner.style.width = '3rem';
        spinner.style.height = '3rem';
        
        const messageElement = document.createElement('div');
        messageElement.id = 'loading-message';
        messageElement.style.color = 'white';
        messageElement.style.marginTop = '15px';
        messageElement.style.fontWeight = 'bold';
        
        overlay.appendChild(spinner);
        overlay.appendChild(messageElement);
        document.body.appendChild(overlay);
    }
    
    document.getElementById('loading-message').textContent = message || 'Loading...';
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoadingIndicator() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Update the loadMessage function to properly display videos
function updateLoadMessageFunction() {
    // Get the original function
    const originalLoadMessage = loadMessage;
    
    // Replace with enhanced version
    loadMessage = function(chatKey, frndPhoto) {
        var db = firebase.database().ref('chatMessage').child(chatKey);
        db.on('value', function(chats) {
            var displayMessage = '';
            
            chats.forEach(function(data) {
                var chatMsgs = data.val();
                var msg = '';
                
                if (chatMsgs.msgType === 'fileMsg') {
                    msg = `<img src="${chatMsgs.chatMsg}" class="img-fluid">`;
                } else if (chatMsgs.msgType === 'audioMsg') {
                    msg = `<audio class="mt-2" id="audio" controls>
                        <source src="${chatMsgs.chatMsg}" type="audio/webm" />
                    </audio>`;
                } else if (chatMsgs.msgType === 'videoMsg') {
                    msg = `<div class="video-container">
                        <video class="mt-2" controls preload="metadata" style="max-width: 100%;">
                            <source src="${chatMsgs.chatMsg}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="video-info text-muted">
                            <small>${chatMsgs.fileName || 'Video'} (${chatMsgs.fileSize || 'Unknown size'})</small>
                        </div>
                    </div>`;
                } else {
                    msg = chatMsgs.chatMsg;
                }
                
                if (chatMsgs.user_id !== currentUser) {
                    displayMessage += `<div class="row justify-content-end" id="recieve">
                                        <div class="col-6 col-sm-6 col-md-6">
                                            <p class="border bg-gradient float-end sentMsg">${msg}
                                                <span class="chatTime mt-3">${chatMsgs.timestamp} PM</span></p>
                                        </div>
                                        <div class="col-2 col-sm-1 col-md-1">
                                            <img src="${frndPhoto}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                        </div>
                                    </div>`;
                } else {
                    displayMessage += `<div class="row" id="sent">
                                    <div class="col-2 col-sm-1 col-md-1">
                                        <img src="${firebase.auth().currentUser.photoURL}" class="rounded-circle" alt="User-Logo" height="30px" width="30px">
                                    </div>
                                    <div class="col-6 col-sm-6 col-md-6">
                                        <p class="border bg-gradient recieveMsg">${msg}
                                            <span class="chatTime float-end mt-3">${chatMsgs.timestamp} PM</span></p>
                                    </div>
                                </div>`;
                }
            });
            
            document.getElementById('msgBox').innerHTML = displayMessage;
            document.getElementById('msgBox').scrollTop = document.getElementById('msgBox').scrollHeight;
        });
    };
}

// Call this when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateLoadMessageFunction();
});