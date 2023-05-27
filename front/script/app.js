const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

let colors;

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

const datalistevent = function (e) {
  console.info(e)
  let input = e.target,
    val = input.value;
  list = input.getAttribute('list')
  options = document.getElementById(list).childNodes;

  for (var i = 0; i < options.length; i++) {
    console.info(options[i].innerText, val)
    if (String(options[i].innerText) == String(val)) {
      console.info('ok')
      // An item was selected from the list!
      showChosenColor(options[i])
      break;
    }
  }
}

const showChosenColor = function (idk) {
  console.info(idk)
  for (let c of colors) {
    if (c.objectId == idk.getAttribute('data-obid')) {
      document.querySelector('.js-dropdownHex').value = c.hexCode
      document.querySelector('.js-dropdownNames').value = c.name
      document.querySelector('.c-card-color__selector').style.backgroundColor = c.hexCode
      document.querySelector('.c-dropdown').style.backgroundColor = c.hexCode
      document.querySelector('.c-dropdown__small').style.backgroundColor = c.hexCode
      break;
    }
  }
  showColors2()
}

const showColors = function (jsonObject) {
  colors = jsonObject['results']
  let hexString = ''
  let nameString = ''
  for (let c of colors) {
    hexString += `<option data-obid="${c.objectId}" value="${c.hexCode}">${c.hexCode}</option>`
    nameString += `<option data-obid="${c.objectId}" value="${c.name} ">${c.name}</option>`
  }
  document.querySelector('.js-ColorHex').innerHTML = hexString
  document.querySelector('.js-ColorNames').innerHTML = nameString
  listenToUI()
}

const showColors2 = function () {
  let hexString = ''
  let nameString = ''
  for (let c of colors) {
    hexString += `<option data-obid="${c.objectId}" value="${c.hexCode}">${c.hexCode}</option>`
    nameString += `<option data-obid="${c.objectId}" value="${c.name} ">${c.name}</option>`
  }
  document.querySelector('.js-ColorHex').innerHTML = hexString
  document.querySelector('.js-ColorNames').innerHTML = nameString
  listenToUI()
}

const showError = function (err) {
  console.error(err)
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
        handleData(`http://${window.location.hostname}:5000/login/`, showRFID, showloginError, 'POST', username);
      }
    })
  } else if (document.querySelector('.js-home')) {
    document.querySelector('.js-modes').addEventListener('change', function () {
      socketio.emit('F2B_change_idle_mode', { new_mode: this.value })
    })
    document.querySelector('.js-dropdownHex').addEventListener('input', datalistevent)
    document.querySelector('.js-dropdownNames').addEventListener('input', datalistevent)
  }
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
  if (document.querySelector('.js-home')) {
    const urlparams = new URLSearchParams(window.location.search);
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else {
      handleData(`http://${window.location.hostname}:5000/color/`, showColors, showError)
    }
  }
};

document.addEventListener('DOMContentLoaded', init);
