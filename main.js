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
 
const publicVapidKey = 'BLhnOOnx7M5oQ6bi4lRQKeUMdgyNAcqjHXDPfRjgqynx4Ndtjtr-tsc5rRgYT_uFYn_sBhlqq1j1jv76HZwtoiA';

const triggerPush = document.querySelector('.trigger-push');
let isSubscribed = false;

async function triggerPushNotification() {
  if ('serviceWorker' in navigator) {
    
    const register = await navigator.serviceWorker.register('/push2/sw.js', {
      scope: '/'
    });

    console.log('waiting for acceptance'); 
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      
    });

    console.log(JSON.stringify(subscription));

    isSubscribed == true

    console.log('acceptance complete');

    /*await fetch('/subscribe', {
     method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });*/

  } else {
    console.error('Service workers are not supported in this browser');
  }
}

triggerPush.addEventListener('click', () => {
  triggerPushNotification().catch(error => console.error(error));
});

function initializeUI() {
  
  triggerPush.addEventListener('click', () => {
    triggerPushNotification().catch(error => console.error(error));
  });
   

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
    } else {
      console.log('User is NOT subscribed.');
    }
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('/push2/sw.js')
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
  triggerPush.textContent = 'Push Not Supported';
}
