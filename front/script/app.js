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
  document.querySelector('.js-login').innerHTML = 'Hold the tag in front of your cube'
  socketio.emit('F2B_read_tag', { id: jsonObject['CubeId'] })
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
  } else if (document.querySelector('.js-home')) { }
};

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
  socketio.on('B2F_login_succes', function (jsonObject) {
    console.info(jsonObject)
    window.location.href = `index.html?userid=${jsonObject['cubeid']}`
  })
  socketio.on('B2F_login_failed', function (jsonObject) {
    document.querySelector('.js-login').innerHTML = `<form>
    <label class="c-login_username" for="username">Username:</label>
    <input class="js-loginveld" type="text" name="username" id="username" placeholder="Your Username...">
</form>
<div class="js-loginfout c-login__foutmelding">${jsonObject['error']}</div>
<button class="js-login-btn c-login__btn u-butten-reset">NEXT</button>`
    listenToUI()
  })
};

const init = function () {
  console.info('DOM geladen');
  listenToUI();
  listenToSocket();
  if(document.querySelector('.js-home')){
    const urlparams = new URLSearchParams(window.location.search);
    if(urlparams == 0){
      window.location.href = 'inlog.html'
    }
  }
};

document.addEventListener('DOMContentLoaded', init);
