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
  let input = e.target,
    val = input.value;
  val = val.replace(/\s+/g, '')
  list = input.getAttribute('list')
  options = document.getElementById(list).childNodes;

  for (var i = 0; i < options.length; i++) {
    option = options[i].innerText.replace(/\s+/g, '')
    if (option == val) {
      // An item was selected from the list!
      showChosenColor(options[i])
      break;
    }
  }
}

const showChosenColor = function (idk) {
  for (let c of colors) {
    if (c.objectId == idk.getAttribute('data-obid')) {
      document.querySelector('.js-dropdownNames').value = ''
      document.querySelector('.js-dropdownNames').placeholder = c.name
      document.querySelector('.js-dropdownHex').value = ''
      document.querySelector('.js-dropdownHex').placeholder = c.hexCode
      document.querySelector('.c-card-color__selector').style.backgroundColor = c.hexCode
      document.querySelector('.c-dropdown').style.backgroundColor = c.hexCode
      document.querySelector('.c-dropdown__small').style.backgroundColor = c.hexCode
      socketio.emit('F2B_change_color', { 'hexCode': c.hexCode })
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

const toggleIdle = function () {
  socketio.emit('F2B_toggle_idle', { 'state': this.innerHTML })
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
    document.querySelector('.js-idlebtn').addEventListener('click', toggleIdle)
    document.querySelector('.js-idlebtn').addEventListener('touchstart', toggleIdle)
  }
};

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
  if (document.querySelector('.js-login')) {
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
  } else if (document.querySelector('.js-home')) {
    socketio.on('B2F_curr_color', function (hexvalue) {
      for (let c of colors) {
        if (hexvalue['hex'] == c.hexCode) {
          document.querySelector('.js-dropdownNames').value = ''
          document.querySelector('.js-dropdownNames').placeholder = c.name
          document.querySelector('.js-dropdownHex').value = ''
          document.querySelector('.js-dropdownHex').placeholder = c.hexCode
          document.querySelector('.c-card-color__selector').style.backgroundColor = c.hexCode
          document.querySelector('.c-dropdown').style.backgroundColor = c.hexCode
          document.querySelector('.c-dropdown__small').style.backgroundColor = c.hexCode
        }
      }
    });
    socketio.on('B2F_toggled', function (jsonObject) {
      if (jsonObject['mode']) {
        document.querySelector('.js-idlestate').innerHTML = 'ON'
        document.querySelector('.js-idlebtn').innerHTML = 'Turn OFF'
      } else {
        document.querySelector('.js-idlestate').innerHTML = 'OFF'
        document.querySelector('.js-idlebtn').innerHTML = 'Turn ON'
      }
    })
  }
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
