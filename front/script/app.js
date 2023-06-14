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

const toHomepage = function (jsonObject) {
  console.info(jsonObject)
  window.location.href = `index.html?userid=${jsonObject['CubeId']}`
  cubeid = jsonObject['cubeid']
}

const hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const saveColor = function (jsonObject) {
  colors = jsonObject
}

const showloginError = function (err) {
  console.error(err)
  if(err['status'] == 422){
    document.querySelector('.js-loginfout').innerHTML = "Password incorrect, please try again"
    document.querySelector('.js-loginveld_password').style.border = "2px solid #FF0000"
  } else if(err['status'] == 404){
    document.querySelector('.js-loginfout').innerHTML = "Username not found, try a different name"
    document.querySelector('.js-loginveld_username').style.border = "2px solid #FF0000"
  }
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
  console.info(idk)
  for (let c of colors) {
    if (c.Hexcode == idk.getAttribute('data-obid')) {
      document.querySelector('.js-dropdownNames').value = ''
      document.querySelector('.js-dropdownNames').placeholder = c.Name
      document.querySelector('.js-dropdownHex').value = ''
      document.querySelector('.js-dropdownHex').placeholder = c.Hexcode
      document.querySelector('.c-card-color__selector').style.backgroundColor = c.Hexcode
      document.querySelector('.c-dropdown').style.backgroundColor = c.Hexcode
      document.querySelector('.c-dropdown__small').style.backgroundColor = c.Hexcode
      socketio.emit('F2B_change_color', { 'id': cubeid, 'hexCode': c.Hexcode })
    }
  }
  showColors2()
}

const showColors = function (jsonObject) {
  console.info(jsonObject)
  colors = jsonObject
  let hexString = ''
  let nameString = ''
  for (let c of colors) {
    hexString += `<option data-obid="${c.Hexcode}" value="${c.Hexcode}">${c.Hexcode}</option>`
    nameString += `<option data-obid="${c.Hexcode}" value="${c.Name} ">${c.Name}</option>`
  }
  document.querySelector('.js-ColorHex').innerHTML = hexString
  document.querySelector('.js-ColorNames').innerHTML = nameString
  listenToUI()
}

const showColors2 = function () {
  let hexString = ''
  let nameString = ''
  for (let c of colors) {
    hexString += `<option data-obid="${c.Hexcode}" value="${c.Hexcode}">${c.Hexcode}</option>`
    nameString += `<option data-obid="${c.Hexcode}" value="${c.Name} ">${c.Name}</option>`
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
      const username = document.querySelector('.js-loginveld_username')
      const password = document.querySelector('.js-loginveld_password')
      if((username.value == null | username.value == "") & (password.value == null | password.value == "")){
        username.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000"
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in the fields to continue'
      }
      else if (username.value == null | username.value == "") {
        username.style.border = "2px solid #FF0000";
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in your username'
      }else if (password.value == null | password.value == ""){
        password.style.border = "2px solid #FF0000"
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in your password'
      } else {
        username.style.border = "2px solid #FFFFFF";
        password.style.border = "2px solid #FFFFFF";
        const loginInfo = JSON.stringify({ username: username.value, password: password.value });
        handleData(`http://${window.location.hostname}:5000/login/`, toHomepage, showloginError, 'POST', loginInfo);
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
    document.querySelector('.js-chatscard').addEventListener("click", function(){
      window.location.href = `chat.html?userid=${cubeid}`
    })
  } else if (document.querySelector('.js-chat')) {
    document.querySelector('.js-chatbar').addEventListener('input', function () {
      if (this.value.length > 32) {
        this.style.backgroundColor = '#FF0000'
        document.querySelector('.js-send_btn').disabled = true
      } else {
        this.style.backgroundColor = '#FFFFFF'
        document.querySelector('.js-send_btn').disabled = false
      }
    })
    document.querySelector('.js-send_btn').addEventListener('click', function () {
      let text = document.querySelector('.js-chatbar').value
      document.querySelector('.js-colorPicker').style.display = 'initial';
      document.querySelector('.js-colorPickerClose').addEventListener('click', function () {
        document.querySelector('.js-colorPicker').style.display = 'none'
      })
      for (let c of document.querySelectorAll('.js-colorbtn')) {
        c.addEventListener('click', function () {
          console.info(this)
          let searchCol = 'other';
          let htmlString = ''
          console.info(c.innerHTML)
          if (c.innerHTML == 'Happy') {
            searchCol = 'yellow'
          } else if (c.innerHTML == 'Sad') {
            searchCol = 'blue'
          } else if (c.innerHTML == 'Disgust') {
            searchCol = 'green'
          } else if (c.innerHTML == 'Anger') {
            searchCol = 'red'
          } else if (c.innerHTML == 'Fear') {
            searchCol = 'purple'
          }
          document.querySelector('.js-colorDecision').style.display = 'initial';
          if (searchCol != 'other') {
            for (let col of colors) {
              if (col['Name'].toLowerCase().includes(searchCol)) {
                htmlString += `<button class="js-colorDecision-color c-colorDecision__color o-button-reset" data-hexcode="${col.Hexcode}">${col.Name}</button>`
              }
            }
          } else {
            for (let col of colors) {
              if (!col['Name'].toLowerCase().includes('yellow') && !col['Name'].toLowerCase().includes('blue') && !col['Name'].toLowerCase().includes('red') && !col['Name'].toLowerCase().includes('green') && !col['Name'].toLowerCase().includes('purple')) {
                htmlString += `<button class="js-colorDecision-color c-colorDecision__color o-button-reset" data-hexcode="${col.Hexcode}">${col.Name}</button>`
              }
            }
          }
          document.querySelector('.js-color-colorname').innerHTML = htmlString;
          let chosenColor;
          for (let cd of document.querySelectorAll('.js-colorDecision-color')) {
            cd.style.backgroundColor = `${cd.getAttribute('data-hexcode')}`
            cd.addEventListener('click', function () {
              chosenColor = cd.getAttribute('data-hexcode')
              console.info(chosenColor)
              document.querySelector('.js-sendbtn').style.display = 'initial'
            })
          }
          document.querySelector('.js-sendbtn').addEventListener('click', function () {
            document.querySelector('.js-sendbtn').style.display = 'none'
            document.querySelector('.js-colorPicker').style.display = 'none'
            document.querySelector('.js-colorDecision').style.display = 'none'
            console.info(chosenColor)
            if (chosenColor != null) {
              socketio.emit('F2B_send_message', { 'id': cubeid, 'msg': text, 'color': chosenColor })
            }
          })
        })
      }
    })
    document.querySelector('.js-colorDecision__back').addEventListener('click', function () {
      document.querySelector('.js-colorDecision').style.display = 'none'
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
        if (hexvalue['hex'] == c.Hexcode) {
          document.querySelector('.js-dropdownNames').value = ''
          document.querySelector('.js-dropdownNames').placeholder = c.Name
          document.querySelector('.js-dropdownHex').value = ''
          document.querySelector('.js-dropdownHex').placeholder = c.Hexcode
          document.querySelector('.c-card-color__selector').style.backgroundColor = c.Hexcode
          document.querySelector('.c-dropdown').style.backgroundColor = c.Hexcode
          document.querySelector('.c-dropdown__small').style.backgroundColor = c.Hexcode
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
    socketio.on('B2F_recent_chats', function(jsonObject){
      chats = jsonObject['chats']
      console.info(chats)
      htmlString = ''
      for(let c = 1; c >= 0; c--){
        htmlString += `<div class="c-message ${checkSender(chats[c].SenderCubeId)}">
        <!-- <div class="c-message__sender">testuser</div> -->
        <div class="message_content">
          <div class="js-bubbles c-message__bubble" data-bcolor="${chats[c].Hexcode}">
            <p class="c-message_text u-mb-clear">${chats[c].Message}</p>
          </div>
          <div class="c-message__time">${chats[c].Tijdstip.substring(11, chats[c].Tijdstip.length - 3)}</div>
        </div>
      </div>`
      }
      document.querySelector('.js-messages').innerHTML = htmlString;
      for (let b of document.querySelectorAll('.js-bubbles')) {
        b.style.boxShadow = `0px 4px 8px rgba(${hexToRgb(b.getAttribute('data-bcolor'))['r']},${hexToRgb(b.getAttribute('data-bcolor'))['g']},${hexToRgb(b.getAttribute('data-bcolor'))['b']},0.5)`
      }
    })
  } else if (document.querySelector('.js-chat')) {
    socketio.on('B2F_new_message', function (jsonObject) {
      console.info(jsonObject['time'])
      chats = jsonObject['msg']
      htmlString = ''
      htmlString += `
    <div class="c-message ${checkSender(chats['id'])}">
    <!-- <div class="c-message__sender">testuser</div> -->
    <div class="message_content">
      <div class="js-bubbles c-message__bubble" data-bcolor="${chats.color}">
        <p class="c-message_text u-mb-clear">${chats.msg}</p>
      </div>
      <div class="c-message__time">${jsonObject['time'].substring(11, jsonObject['time'].length - 3)}</div>
    </div>
  </div>`
      document.querySelector('.js-messages').innerHTML += htmlString;
      for (let b of document.querySelectorAll('.js-bubbles')) {
        b.style.boxShadow = `0px 4px 8px rgba(${hexToRgb(b.getAttribute('data-bcolor'))['r']},${hexToRgb(b.getAttribute('data-bcolor'))['g']},${hexToRgb(b.getAttribute('data-bcolor'))['b']},0.5)`
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
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/color/`, showColors, showError)
    }
  } else if (document.querySelector('.js-chat')) {
    const urlparams = new URLSearchParams(window.location.search);
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else {
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/color/`, saveColor, showError)
      handleData(`http://${window.location.hostname}:5000/chats/`, showChats, showError)
    }
  }
};

document.addEventListener('DOMContentLoaded', init);
