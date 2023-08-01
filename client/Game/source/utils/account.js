var DB = "https://token.starve.io/";

var __GOOGLE_LOGIN__ = 0;
var __FACEBOOK_LOGIN__ = 1;

var userLoginType = undefined;
var userToken = undefined;
var userId = undefined;
var userData = undefined;

var userAlreadyLoggedIn = 0;

window.onUserLogin = function () {

  userAlreadyLoggedIn = 1;
};


var ip = undefined;

function loginSuccess(id, token, loginType) {
  userLoginType = loginType;
  userToken = token;
  userId = id;
  window.onUserLogin(id);
}

//Google Login
var auth2 = undefined; // The Sign-In object.
var googleUser = undefined; // The current user.

/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
var appStart = function () {

  // window["gapi"]["load"]('auth2', initSigninV2);
};

/**
 * Initializes Signin v2 and sets up listeners.
 */
var initSigninV2 = function () {

  auth2 = window["gapi"]["auth2"]["init"]({
    "client_id": "604822901057-k3dp7j5qpl6pnfr86rvi4r2qp20nk1oh.apps.googleusercontent.com", //CHANGE TO YOUR CLIENT ID
    "scope": 'profile'
  });

  // Listen for sign-in state changes.
  auth2["isSignedIn"]["listen"](signinChanged);

  // Listen for changes to current user.
  auth2["currentUser"]["listen"](userChanged);

  // Sign in the user if they are currently signed in.
  if (auth2["isSignedIn"]["get"]() === true)
    auth2["signIn"]();

  // Start with the current live values.
  refreshValues();
};

/**
 * Listener method for sign-out live value.
 * @param {boolean} val the updated signed out state.
 */
var signinChanged = function (val) {
};

/**
 * Listener method for when the user changes.
 * @param {GoogleUser} user the updated user.
 */
var userChanged = function (user) {

  login();
  if (userToken === undefined && googleUser !== undefined) {

    userToken = googleUser["getAuthResponse"]()["id_token"];

    if (userToken !== undefined) {
      userLoginType = __GOOGLE_LOGIN__;
      window.onUserLogin(userId);
    }
  }

  if (user !== undefined && user["isSignedIn"]() === true)
    googleUser = user;
};

/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
var refreshValues = function () {

  if (auth2)
    googleUser = auth2["currentUser"]["get"]();
}

window.onload = function () {

  appStart();
};

function logout() {

  if (isWrapper) {
    nativeLogout()
  } else {
    if (userLoginType === __FACEBOOK_LOGIN__ && window["FB"]["getUserID"]())
      window["FB"]["logout"]();

    if (userLoginType === __GOOGLE_LOGIN__ && googleUser !== undefined) {
      window["gapi"]["auth2"]["getAuthInstance"]()["signOut"]();
      googleUser = undefined;
    }
  }

  // Reset account details
  userId = undefined;
  userToken = undefined;
  userLoginType = undefined;
  ui.kit = 0;
  ui.bread = 0;
  ui.score = 0;
  ui.unlock_cosmetics();

  onUserLogout();
}

function login() {

  // The user is already logged
  if (userId !== undefined) return;

  // Restore the user id if possible
  getUserId();

  // We can't restore any connection
  if (!userId) return
}

function getUserId() {

  try {
    if (window["FB"]) {
      if (window["FB"]["getUserID"]()) {

        userId = window["FB"]["getUserID"]();

        // Restore facebook token
        if (userToken === undefined) {
          window["FB"]["getLoginStatus"](function () {
            userLoginType = __FACEBOOK_LOGIN__;
            userToken = window["FB"]["getAuthResponse"]()["accessToken"];
            window.onUserLogin(userId);
          });
        }
      }
    }
  } catch (e) { }

  try {
    userId = googleUser["getBasicProfile"]()["getId"]();
  } catch (e) { }
}

// Open xsolla popup
function openXsolla(amount) {

  if (!userId) return

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'xsolla?userid=' + userId + '&item=' + amount);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      if (xhr.responseText !== '0') {

        xsolla_options["access_token"] = xhr.responseText;
        window["XPayStationWidget"]["init"](xsolla_options);
        window["XPayStationWidget"]["open"]();
      }
    }
  };

  xhr.send();
}

function buyBread(sku) {

  if (!userId) return

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'buyBread?userid=' + userId + '&token=' + userToken + '&sku=' + sku);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {
    userId = window["FB"]["getUserID"]();

    // Restore facebook token
    if (userToken === undefined) {
      window["FB"]["getLoginStatus"](function () {
        userLoginType = __FACEBOOK_LOGIN__;
        userToken = window["FB"]["getAuthResponse"]()["accessToken"];
        window.onUserLogin(userId);
      });
    }
    if (this.readyState == 4 && this.status == 200) {

      if (xhr.responseText !== '0') {
        console.info('added bread', xhr.responseText);
        window.location.reload();
      }
    }
  };

  xhr.send();
}

function buyServer(sku) {
  if (!userId) return

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'buyServer?userid=' + userId + '&token=' + userToken + '&sku=' + sku);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      if (xhr.responseText !== '0') {
        console.info('added server', xhr.responseText);
      }
    }
  };

  xhr.send();
}

// Restore user data (or alternatively create a new account)
function getUserDetails(_callback) {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'login?token=' + userToken + '&type=' + userLoginType);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState === 4 && this.status === 200) {

      if (xhr.responseText !== '0')
        _callback(JSON.parse(xhr.responseText));
      /* I think it's causing a bug
      else
        logout ();
      */
    }
  };

  xhr.send();
}

// Ask for server rebooting
function rebootServer() {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'rebootServer?token=' + userToken + '&userid=' + userId);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState === 4 && this.status === 200) {

      // Get next view
      if (xhr.responseText !== '0')
        location.href = document.getElementById("serverAddressInput").value;
    }
  };

  xhr.send();
};

// Claim user bread
function claimBread() {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', DB + 'claimBread?userid=' + userId);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      if (xhr.responseText !== '0') {

        var bread = Number(xhr.responseText);
        if (!isNaN(bread))
          ui.bread = bread;
      }
    }
  };

  xhr.send();
};

function sendCheat() {

  xhr.open('GET', DB + 'getScore?userid=' + userId);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      if (xhr.responseText !== '0')
        var data = JSON.parse(xhr.responseText);
    }
  };

  xhr.send();
};