function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

var b = document.createElement('button');
b.setAttribute('content', 'test content');
b.setAttribute('class', 'trigger-push');

const publicVapidKey = 'BLhnOOnx7M5oQ6bi4lRQKeUMdgyNAcqjHXDPfRjgqynx4Ndtjtr-tsc5rRgYT_uFYn_sBhlqq1j1jv76HZwtoiA';

const triggerPush = document.querySelector('.trigger-push');
let isSubscribed = false;
let wrapper;

wrapper = document.getElementById("divWrapper");
if(wrapper != null){
  wrapper.appendChild(b);
}


var classname = document.getElementsByClassName("trigger-push");
for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', () => {
    notifyMe()
    //triggerPushNotification().catch(error => console.error(error));
  });
}
 
function initializeUI() {
  
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);
    
    console.log(JSON.stringify(subscription));

    var para = document.createElement("P");
    para.innerHTML = JSON.stringify(subscription);
    document.getElementById("myDIV").appendChild(para);

    if (isSubscribed) {
      console.log('User IS subscribed.');
      b.innerHTML = 'User IS subscribed.';
      b.style.visibility = "hidden"; 
       
    } else {

    
      b.innerHTML = 'User is NOT subscribed.';

      wrapper = document.getElementById("divWrapper");
      if(wrapper != null){
        wrapper.appendChild(b);
      }

      console.log('User is NOT subscribed.');
    }
  });
}


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('/webpush2/sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg; 
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  //triggerPush.textContent = 'Push Not Supported';
}

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification

    subscribeUserToPush()
    var notification = new Notification("Hi there!...");
    
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification

    subscribeUserToPush()
      if (permission === "granted") { 
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

function subscribeUserToPush() {

  
  console.log('waiting for acceptance'); 

  return navigator.serviceWorker.register('/webpush2/sw.js')
  .then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    };   
    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    var para = document.createElement("P");
    para.innerHTML = JSON.stringify(pushSubscription);
    document.getElementById("myDIV").appendChild(para);
    b.style.visibility = "hidden"; 

    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}
