const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

let colors, cubeid;

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

const cleanupTime = function (time) {
  spsubstr = time.substring(15, 17)
  return time.substring(4, 25).replace(spsubstr, time.substring(15, 16) + '<br>' + time.substring(16, 17))
}

const cleanupValue = function (value) {
  if (value == null) {
    return ''
  } else {
    return value
  }
}

const checkSender = function (userid) {
  if (userid == cubeid) {
    return `c-message--own`
  } else {
    return ``
  }
}

const showRFID = function (jsonObject) {
  console.info(jsonObject)
  document.querySelector('.js-login').innerHTML = 'Hold the tag in front of your cube'
  socketio.emit('F2B_read_tag', { id: jsonObject['CubeId'] })
}

const hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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
      socketio.emit('F2B_change_color', { 'id': cubeid, 'hexCode': c.hexCode })
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
  handleData(`http://${window.location.hostname}:5000/history/small/${cubeid}/`, showHistory, showError)
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

const showHistory = function (jsonObject) {
  let htmlString = `<tr>
  <th class="c-table__head">Time</th>
  <th class="c-table__head">Type</th>
  <th class="c-table__head">Value</th>
  <th class="c-table__head">Description</th>
</tr>`
  for (let t of jsonObject) {
    htmlString += `
  <tr>
    <td class="c-table__values">${cleanupTime(t.Time)}</td>
    <td class="c-table__values">${t.Type}</td>
    <td class="c-table__values">${cleanupValue(t.Value)}</td>
    <td class="c-table__values">${t.Description}</td>
  </tr>`
  }
  document.querySelector('.js-table').innerHTML = htmlString
}

const showChats = function (jsonObject) {
  console.info(jsonObject)
  chats = jsonObject['chats']
  htmlString = ''
  for (let c of chats) {
    console.info(c.Hexcode)
    htmlString += `
    <div class="c-message ${checkSender(c.SenderCubeId)}">
    <!-- <div class="c-message__sender">testuser</div> -->
    <div class="message_content">
      <div class="js-bubbles c-message__bubble" data-bcolor="${c.Hexcode}">
        <p class="c-message_text u-mb-clear">${c.Message}</p>
      </div>
      <div class="c-message__time">${c.Tijdstip.substring(c.Tijdstip.length - 12, c.Tijdstip.length - 7)}</div>
    </div>
  </div>`
  }
  document.querySelector('.js-messages').innerHTML = htmlString;
  for (let b of document.querySelectorAll('.js-bubbles')) { 
    b.style.boxShadow = `0px 4px 8px rgba(${hexToRgb(b.getAttribute('data-bcolor'))['r']},${hexToRgb(b.getAttribute('data-bcolor'))['g']},${hexToRgb(b.getAttribute('data-bcolor'))['b']},0.5)`
  }

}

const toggleIdle = function () {
  socketio.emit('F2B_toggle_idle', { 'id': cubeid, 'state': this.innerHTML })
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
    document.querySelector('.js-modes').addEventListener('change', function (e) {
      if (e.handled !== true) {
        e.handled = true;
        return;
      }
      console.info('trigger')
      console.info(this.value)
      socketio.emit('F2B_change_idle_mode', { 'id': cubeid, 'new_mode': this.value })
    })
    document.querySelector('.js-dropdownHex').addEventListener('input', datalistevent)
    document.querySelector('.js-dropdownNames').addEventListener('input', datalistevent)
    document.querySelector('.js-idlebtn').addEventListener('click', toggleIdle)
    document.querySelector('.js-idlebtn').addEventListener('touchstart', toggleIdle)
  } else if (document.querySelector('.js-chat')) {
    
    document.querySelector('.js-chatbar').addEventListener('input', function () {
      if (this.value.length > 32) {
        this.style.backgroundColor = '#FF0000'
        this.setCustomValidity('The message needs to be under 32 characters')
      } else {
        this.style.backgroundColor = '#FFFFFF'
      }
    })
    document.querySelector('.js-send_btn').addEventListener('click',function(){

    })
  }
  if (!document.querySelector('.js-login')) {
    document.querySelector('.js-nav__home').addEventListener('click', function () {
      const urlparams = new URLSearchParams(window.location.search)
      cubeid = urlparams.get('userid')
      window.location.href = `index.html?userid=${cubeid}`;
    })
    document.querySelector('.js-nav__chat').addEventListener('click', function () {
      const urlparams = new URLSearchParams(window.location.search)
      cubeid = urlparams.get('userid')
      window.location.href = `chat.html?userid=${cubeid}`
    })
    document.querySelector('.js-nav__history').addEventListener('click', function () {
      const urlparams = new URLSearchParams(window.location.search)
      cubeid = urlparams.get('userid')
      window.location.href = `history.html?userid=${cubeid}`
    })
    document.querySelector('.js-nav__settings').addEventListener('click', function () {
      const urlparams = new URLSearchParams(window.location.search)
      cubeid = urlparams.get('userid')
      window.location.href = `settings.html?userid=${cubeid}`
    })
  }
};

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
    if (document.querySelector('.js-home')) {
      socketio.emit('F2B_get_loadout', { 'id': cubeid })
    }
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
    socketio.on('B2F_ack_change', function (jsonObject) {
      let htmlString = `<tr>
  <th class="c-table__head">Time</th>
  <th class="c-table__head">Type</th>
  <th class="c-table__head">Value</th>
  <th class="c-table__head">Description</th>
</tr>`
      for (let t of jsonObject) {
        htmlString += `
  <tr>
    <td class="c-table__values">${cleanupTime(t.Time)}</td>
    <td class="c-table__values">${t.Type}</td>
    <td class="c-table__values">${cleanupValue(t.Value)}</td>
    <td class="c-table__values">${t.Function}</td>
  </tr>`
      }
      document.querySelector('.js-table').innerHTML = htmlString
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
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/color/`, showColors, showError)
    }
  } else if (document.querySelector('.js-chat')) {
    const urlparams = new URLSearchParams(window.location.search);
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else {
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/chats/`, showChats, showError)
    }
  }
};

document.addEventListener('DOMContentLoaded', init);
