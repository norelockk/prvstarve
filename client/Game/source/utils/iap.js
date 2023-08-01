var iapProducts = {
  server: [
    { name: 'Server for 3 Days', id: '3_server', price: 3.99 },
    { name: 'Server for 7 Days', id: '3_server', price: 5.99 },
    { name: 'Server for 30 Days', id: '3_server', price: 14.99 },
    { name: 'Server for 90 Days', id: '3_server', price: 39.99 }
  ],
  bread: [
    { name: '300 Golden Bread', id: '300_bread', price: 0.99 },
    { name: '600 Golden Bread', id: '600_bread', price: 1.99 },
    { name: '2600 Golden Bread', id: '2600_bread', price: 7.99 },
    { name: '7000 Golden Bread', id: '7000_bread', price: 15.99 },
    { name: '20000 Golden Bread', id: '20000_bread', price: 34.99 }
  ]
};

var isWrapper = false;
var purchaseCompleteCallback;
var purchaseErrorCallback;
var isAndroid = false;

window.startWrappedApp = function (_isAndroid) {
  isWrapper = true;
  isAndroid = JSON.parse(_isAndroid);
};

window.loginInfo = function (loginType, token, id) {
  switch (loginType) {
    case 1:
      googleLogin(true, id, token);
      break;
    case 2:
      fbLogin(true, id, token);
      break;
    default:
      console.info('no login');
  }
}

var purchase = function (productId, callback, errorCallback) {
  if (isAndroid) {
    BlockHandler.purchase(productId);
  } else {
    callToNativeIOS('purchase|' + productId);
  }
  purchaseCompleteCallback = callback;
  if (errorCallback) {
    purchaseErrorCallback = errorCallback;
  }
};

var nativeLoginGoogle = function () {
  if (isAndroid) {
    BlockHandler.loginGoogle();
  } else {
    callToNativeIOS('loginGoogle');
  }
}

var appLoaded = function () {
  if (isAndroid) {
    BlockHandler.appLoaded();
  } else {
    callToNativeIOS('appLoaded');
  }
}

var nativeLoginFacebook = function () {
  if (isAndroid) {
    BlockHandler.loginFB();
  } else {
    callToNativeIOS('loginFB');
  }
}

var nativeLogout = function () {
  if (isAndroid) {
    BlockHandler.logout();
  } else {
    callToNativeIOS('logout');
  }
}

var purchaseError = function (_error) {
  var errorText = _error || 'Problem. Please try again.'
  if (purchaseErrorCallback) {
    purchaseErrorCallback(error);
    client.new_alert(error.toString());
  }
};

window.fbLogin = function (success, fbid, accessToken) {
  loginSuccess(fbid, accessToken, __FACEBOOK_LOGIN__)
}

window.googleLogin = function (success, gid, accessToken) {
  loginSuccess(gid, accessToken, __GOOGLE_LOGIN__)
}

var callToNativeIOS = function (message) {
  try {
    // eslint-disable-next-line no-undef
    webkit.messageHandlers.callbackHandler.postMessage(message);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("The native context does not exist yet");
  }
}

var purchaseComplete = function (productId, purchaseToken, orderId, success) {
  if (purchaseCompleteCallback) {
    purchaseCompleteCallback.apply(null, arguments)
    if (window && window.location && window.location.reload) window.location.reload();
  }
};

var callTriggerAd = function () {
  if (isAndroid) {
    triggerAd()
  } else {
    callToNativeIOS('triggerAd');
  }
}
