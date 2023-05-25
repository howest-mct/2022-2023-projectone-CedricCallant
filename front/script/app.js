const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

const showRFID = function (jsonObject) {
  console.info(jsonObject)
  document.querySelector('.js-loginfout').innerHTML = ''
}

const showloginError = function (err) {
  console.error(err)
  document.querySelector('.js-loginveld').style.border = "2px solid #FF0000";
  document.querySelector('.js-loginfout').innerHTML = 'This name is not linked to a cube'
}

const listenToUI = function () {
  if (document.querySelector('.js-login')) {
    document.querySelector('.js-login-btn').addEventListener('click', function () {
      const loginveld = document.querySelector('.js-loginveld')
      if (loginveld.value == null | loginveld.value == "") {
        console.info(loginveld.style.border);
        loginveld.style.border = "2px solid #FF0000";
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in the field above'
      } else {
        loginveld.style.border = "2px solid #FFFFFF";
        const username = JSON.stringify({ username: loginveld.value });
        handleData(`http://192.168.168.169:5000/login/`, showRFID, showloginError, 'POST', username);
      }
    })
  } else if(document.querySelector('.js-home')){}
};

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
};

const init = function () {
  console.info('DOM geladen');
  listenToUI();
  listenToSocket();
};

document.addEventListener('DOMContentLoaded', init);
