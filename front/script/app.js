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
  if (err['status'] == 422) {
    document.querySelector('.js-loginfout').innerHTML = "Password incorrect, please try again"
    document.querySelector('.js-loginveld_password').style.border = "2px solid #FF0000"
  } else if (err['status'] == 404) {
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
  console.info(jsonObject)
  let htmlString = `    <tr class="c-card-history__row">
  <th>Time</th>
  <th>Description</th>
</tr>`
  for (let t of jsonObject) {
    htmlString += `
  <tr class="c-card-history__row">
    <td>${t.Time}</td>
    <td>${t.Description}</td>
  </tr>`
  }
  console.info(document.querySelector('.js-table'))
  document.querySelector('.js-table').innerHTML = htmlString
}

const showChatHistory = function(jsonObject){
  console.info(jsonObject)
  let htmlString = `<tr class="c-card-history__row">
  <th>Time</th>
  <th>Sender</th>
  <th>Receiver</th>
  <th>ColorCode</th>
  <th>Message</th>
</tr>`
  for(let c of jsonObject){
    console.info(c)
    htmlString += `<tr class="c-card-history__row">
    <td>${c.Tijdstip}</td>
    <td>${c.suser}</td>
    <td>${c.ruser}</td>
    <td>${c.Hexcode}</td>
    <td>${c.Message}</td>
  </tr>`
  }
  console.info(htmlString)
  document.querySelector('.js-table-chat').innerHTML = htmlString
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

const showGraph = function (jsonObject) {
  // console.info(jsonObject)
  let name_cube = jsonObject[0]['Username']
  let help_cube = jsonObject[0]['SenderCubeID']
  let name_cube2 = ''
  let help_cube2 = ''

  for(let m of jsonObject){
    if(m.IsMain){
      name_cube = m.Username
      help_cube = m.SenderCubeID
    }else{
      name_cube2 = m.Username
      help_cube2 = m.SenderCubeID
    }
  }

  // let converted_labels = []
  let last_time;
  let date_saved;
  let converted_labels = []
  let converted_data_cube1 = []
  let converted_data_cube2 = []
  for (const dag of jsonObject) {
    console.info(name_cube)
    if (help_cube == cubeid) {
      if (last_time != dag.Tijdstip.substring(0, 10)) {
        converted_labels.push(dag.Tijdstip.substring(0, 10))
        last_time = dag.Tijdstip.substring(0, 10)
        if (date_saved & dag.SenderCubeID == help_cube & converted_data_cube1.length != converted_data_cube2.length) {
          converted_data_cube2.push(0)
          date_saved = false
        }
        if (dag.SenderCubeID == help_cube) {
          converted_data_cube1.push(dag.totaal)
          date_saved = true
        } else {
          converted_data_cube1.push(0)
          converted_data_cube2.push(dag.totaal)
        }
      } else {
        converted_data_cube2.push(dag.totaal)
      }
    } else{
      if (last_time != dag.Tijdstip.substring(0, 10)) {
        converted_labels.push(dag.Tijdstip.substring(0, 10))
        last_time = dag.Tijdstip.substring(0, 10)
        if (date_saved & dag.SenderCubeID == help_cube & converted_data_cube1.length != converted_data_cube2.length) {
          converted_data_cube2.push(0)
          date_saved = false
        }
        if (dag.SenderCubeID == help_cube) {
          converted_data_cube1.push(dag.totaal)
          date_saved = true
        } else {
          converted_data_cube1.push(0)
          converted_data_cube2.push(dag.totaal)
        }
      } else {
        converted_data_cube2.push(dag.totaal)
      }
    }

  }
  console.info(converted_data_cube1)
  console.info(converted_data_cube2)
  console.info(converted_labels)
  drawchart(converted_data_cube1, converted_data_cube2, converted_labels, name_cube, name_cube2)
}

const drawchart = function (data_cube1, data_cube2, label, cube1, cube2) {

  var options = {
    series: [{
      name: cube1,
      data: data_cube1,
    }, {
      name: cube2,
      data: data_cube2
    }],
    labels: label,
    noData: {
      text: 'loading...'
    },
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      type: 'datetime',
      categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
        '01/05/2011 GMT', '01/06/2011 GMT'
      ],
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
  var chart = new ApexCharts(document.querySelector('.js-chart'), options);
  chart.render()
}

const toggleIdle = function () {
  socketio.emit('F2B_toggle_idle', { 'id': cubeid, 'state': this.innerHTML })
}

const listenToUI = function () {
  if (document.querySelector('.js-login')) {
    document.querySelector('.js-login-btn').addEventListener('click', function () {
      const username = document.querySelector('.js-loginveld_username')
      const password = document.querySelector('.js-loginveld_password')
      if ((username.value == null | username.value == "") & (password.value == null | password.value == "")) {
        username.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000"
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in the fields to continue'
      }
      else if (username.value == null | username.value == "") {
        username.style.border = "2px solid #FF0000";
        document.querySelector('.js-loginfout').innerHTML = 'Please fill in your username'
      } else if (password.value == null | password.value == "") {
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
    document.querySelector('.js-chatscard').addEventListener("click", function () {
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
            if (chosenColor != null) {
              socketio.emit('F2B_send_message', { 'id': cubeid, 'msg': text, 'color': chosenColor })
              chosenColor = ""
              msg = ""
              document.querySelector('.js-chatbar').value = ''
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
    socketio.on('B2F_recent_chats', function (jsonObject) {
      chats = jsonObject['chats']
      console.info(chats)
      htmlString = ''
      for (let c = 1; c >= 0; c--) {
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
  console.info(window.location.hostname);
  const urlparams = new URLSearchParams(window.location.search);
  if (document.querySelector('.js-home')) {
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else {
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/color/`, showColors, showError)
      handleData(`http://${window.location.hostname}:5000/graphinfo/`, showGraph, showError)
      document.querySelector('.js-navigation').innerHTML = `<a href="index.html?userid=${cubeid}">Home</a>
      <a href="chat.html?userid=${cubeid}">Chat</a>
      <a href="#">History</a>
      <a href="#">Settings</a>`
      document.querySelector('.js-navbar').innerHTML = `<li>
      <div class="c-nav__item c-nav__item--selected js-nav__home"><svg class="c-nav__svg c-nav__svg--selected o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 16 2.59375 L 15.28125 3.28125 L 2.28125 16.28125 L 3.71875 17.71875 L 5 16.4375 L 5 28 L 14 28 L 14 18 L 18 18 L 18 28 L 27 28 L 27 16.4375 L 28.28125 17.71875 L 29.71875 16.28125 L 16.71875 3.28125 Z M 16 5.4375 L 25 14.4375 L 25 26 L 20 26 L 20 16 L 12 16 L 12 26 L 7 26 L 7 14.4375 Z" />
        </svg><a class="c-nav__link c-nav__link--selected" href="index.html?userid=${cubeid}">Home</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__chat"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 3 5 L 3 23 L 8 23 L 8 28.078125 L 14.351563 23 L 29 23 L 29 5 Z M 5 7 L 27 7 L 27 21 L 13.648438 21 L 10 23.917969 L 10 21 L 5 21 Z" />
        </svg><a class="c-nav__link" href="chat.html?userid=${cubeid}">Chat</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__history"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 16 4 C 11.832031 4 8.152344 6.113281 6 9.34375 L 6 6 L 4 6 L 4 13 L 11 13 L 11 11 L 7.375 11 C 9.101563 8.019531 12.296875 6 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 L 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z" />
        </svg><a class="c-nav__link" href="#?userid=${cubeid}">History</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__settings"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path
            d="M 13.1875 3 L 13.03125 3.8125 L 12.4375 6.78125 C 11.484375 7.15625 10.625 7.683594 9.84375 8.3125 L 6.9375 7.3125 L 6.15625 7.0625 L 5.75 7.78125 L 3.75 11.21875 L 3.34375 11.9375 L 3.9375 12.46875 L 6.1875 14.4375 C 6.105469 14.949219 6 15.460938 6 16 C 6 16.539063 6.105469 17.050781 6.1875 17.5625 L 3.9375 19.53125 L 3.34375 20.0625 L 3.75 20.78125 L 5.75 24.21875 L 6.15625 24.9375 L 6.9375 24.6875 L 9.84375 23.6875 C 10.625 24.316406 11.484375 24.84375 12.4375 25.21875 L 13.03125 28.1875 L 13.1875 29 L 18.8125 29 L 18.96875 28.1875 L 19.5625 25.21875 C 20.515625 24.84375 21.375 24.316406 22.15625 23.6875 L 25.0625 24.6875 L 25.84375 24.9375 L 26.25 24.21875 L 28.25 20.78125 L 28.65625 20.0625 L 28.0625 19.53125 L 25.8125 17.5625 C 25.894531 17.050781 26 16.539063 26 16 C 26 15.460938 25.894531 14.949219 25.8125 14.4375 L 28.0625 12.46875 L 28.65625 11.9375 L 28.25 11.21875 L 26.25 7.78125 L 25.84375 7.0625 L 25.0625 7.3125 L 22.15625 8.3125 C 21.375 7.683594 20.515625 7.15625 19.5625 6.78125 L 18.96875 3.8125 L 18.8125 3 Z M 14.8125 5 L 17.1875 5 L 17.6875 7.59375 L 17.8125 8.1875 L 18.375 8.375 C 19.511719 8.730469 20.542969 9.332031 21.40625 10.125 L 21.84375 10.53125 L 22.40625 10.34375 L 24.9375 9.46875 L 26.125 11.5 L 24.125 13.28125 L 23.65625 13.65625 L 23.8125 14.25 C 23.941406 14.820313 24 15.402344 24 16 C 24 16.597656 23.941406 17.179688 23.8125 17.75 L 23.6875 18.34375 L 24.125 18.71875 L 26.125 20.5 L 24.9375 22.53125 L 22.40625 21.65625 L 21.84375 21.46875 L 21.40625 21.875 C 20.542969 22.667969 19.511719 23.269531 18.375 23.625 L 17.8125 23.8125 L 17.6875 24.40625 L 17.1875 27 L 14.8125 27 L 14.3125 24.40625 L 14.1875 23.8125 L 13.625 23.625 C 12.488281 23.269531 11.457031 22.667969 10.59375 21.875 L 10.15625 21.46875 L 9.59375 21.65625 L 7.0625 22.53125 L 5.875 20.5 L 7.875 18.71875 L 8.34375 18.34375 L 8.1875 17.75 C 8.058594 17.179688 8 16.597656 8 16 C 8 15.402344 8.058594 14.820313 8.1875 14.25 L 8.34375 13.65625 L 7.875 13.28125 L 5.875 11.5 L 7.0625 9.46875 L 9.59375 10.34375 L 10.15625 10.53125 L 10.59375 10.125 C 11.457031 9.332031 12.488281 8.730469 13.625 8.375 L 14.1875 8.1875 L 14.3125 7.59375 Z M 16 11 C 13.25 11 11 13.25 11 16 C 11 18.75 13.25 21 16 21 C 18.75 21 21 18.75 21 16 C 21 13.25 18.75 11 16 11 Z M 16 13 C 17.667969 13 19 14.332031 19 16 C 19 17.667969 17.667969 19 16 19 C 14.332031 19 13 17.667969 13 16 C 13 14.332031 14.332031 13 16 13 Z" />
        </svg><a class="c-nav__link" href="#?userid=${cubeid}">Settings</a></div>
    </li>`
    }
  } else if (document.querySelector('.js-chat')) {
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else {
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/color/`, saveColor, showError)
      handleData(`http://${window.location.hostname}:5000/chats/`, showChats, showError)
      document.querySelector('.js-navigation').innerHTML = `<a href="index.html?userid=${cubeid}">Home</a>
      <a href="chat.html?userid=${cubeid}">Chat</a>
      <a href="#">History</a>
      <a href="#">Settings</a>`
      document.querySelector('.js-navbar').innerHTML = `<li>
      <div class="c-nav__item c-nav__item--selected js-nav__home"><svg class="c-nav__svg c-nav__svg--selected o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 16 2.59375 L 15.28125 3.28125 L 2.28125 16.28125 L 3.71875 17.71875 L 5 16.4375 L 5 28 L 14 28 L 14 18 L 18 18 L 18 28 L 27 28 L 27 16.4375 L 28.28125 17.71875 L 29.71875 16.28125 L 16.71875 3.28125 Z M 16 5.4375 L 25 14.4375 L 25 26 L 20 26 L 20 16 L 12 16 L 12 26 L 7 26 L 7 14.4375 Z" />
        </svg><a class="c-nav__link c-nav__link--selected" href="index.html?userid=${cubeid}">Home</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__chat"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 3 5 L 3 23 L 8 23 L 8 28.078125 L 14.351563 23 L 29 23 L 29 5 Z M 5 7 L 27 7 L 27 21 L 13.648438 21 L 10 23.917969 L 10 21 L 5 21 Z" />
        </svg><a class="c-nav__link" href="chat.html?userid=${cubeid}">Chat</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__history"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 16 4 C 11.832031 4 8.152344 6.113281 6 9.34375 L 6 6 L 4 6 L 4 13 L 11 13 L 11 11 L 7.375 11 C 9.101563 8.019531 12.296875 6 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 L 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 15 8 L 15 17 L 22 17 L 22 15 L 17 15 L 17 8 Z" />
        </svg><a class="c-nav__link" href="#?userid=${cubeid}">History</a></div>
    </li>
    <li>
      <div class="c-nav__item js-nav__settings"><svg class="c-nav__svg o-basic-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path
            d="M 13.1875 3 L 13.03125 3.8125 L 12.4375 6.78125 C 11.484375 7.15625 10.625 7.683594 9.84375 8.3125 L 6.9375 7.3125 L 6.15625 7.0625 L 5.75 7.78125 L 3.75 11.21875 L 3.34375 11.9375 L 3.9375 12.46875 L 6.1875 14.4375 C 6.105469 14.949219 6 15.460938 6 16 C 6 16.539063 6.105469 17.050781 6.1875 17.5625 L 3.9375 19.53125 L 3.34375 20.0625 L 3.75 20.78125 L 5.75 24.21875 L 6.15625 24.9375 L 6.9375 24.6875 L 9.84375 23.6875 C 10.625 24.316406 11.484375 24.84375 12.4375 25.21875 L 13.03125 28.1875 L 13.1875 29 L 18.8125 29 L 18.96875 28.1875 L 19.5625 25.21875 C 20.515625 24.84375 21.375 24.316406 22.15625 23.6875 L 25.0625 24.6875 L 25.84375 24.9375 L 26.25 24.21875 L 28.25 20.78125 L 28.65625 20.0625 L 28.0625 19.53125 L 25.8125 17.5625 C 25.894531 17.050781 26 16.539063 26 16 C 26 15.460938 25.894531 14.949219 25.8125 14.4375 L 28.0625 12.46875 L 28.65625 11.9375 L 28.25 11.21875 L 26.25 7.78125 L 25.84375 7.0625 L 25.0625 7.3125 L 22.15625 8.3125 C 21.375 7.683594 20.515625 7.15625 19.5625 6.78125 L 18.96875 3.8125 L 18.8125 3 Z M 14.8125 5 L 17.1875 5 L 17.6875 7.59375 L 17.8125 8.1875 L 18.375 8.375 C 19.511719 8.730469 20.542969 9.332031 21.40625 10.125 L 21.84375 10.53125 L 22.40625 10.34375 L 24.9375 9.46875 L 26.125 11.5 L 24.125 13.28125 L 23.65625 13.65625 L 23.8125 14.25 C 23.941406 14.820313 24 15.402344 24 16 C 24 16.597656 23.941406 17.179688 23.8125 17.75 L 23.6875 18.34375 L 24.125 18.71875 L 26.125 20.5 L 24.9375 22.53125 L 22.40625 21.65625 L 21.84375 21.46875 L 21.40625 21.875 C 20.542969 22.667969 19.511719 23.269531 18.375 23.625 L 17.8125 23.8125 L 17.6875 24.40625 L 17.1875 27 L 14.8125 27 L 14.3125 24.40625 L 14.1875 23.8125 L 13.625 23.625 C 12.488281 23.269531 11.457031 22.667969 10.59375 21.875 L 10.15625 21.46875 L 9.59375 21.65625 L 7.0625 22.53125 L 5.875 20.5 L 7.875 18.71875 L 8.34375 18.34375 L 8.1875 17.75 C 8.058594 17.179688 8 16.597656 8 16 C 8 15.402344 8.058594 14.820313 8.1875 14.25 L 8.34375 13.65625 L 7.875 13.28125 L 5.875 11.5 L 7.0625 9.46875 L 9.59375 10.34375 L 10.15625 10.53125 L 10.59375 10.125 C 11.457031 9.332031 12.488281 8.730469 13.625 8.375 L 14.1875 8.1875 L 14.3125 7.59375 Z M 16 11 C 13.25 11 11 13.25 11 16 C 11 18.75 13.25 21 16 21 C 18.75 21 21 18.75 21 16 C 21 13.25 18.75 11 16 11 Z M 16 13 C 17.667969 13 19 14.332031 19 16 C 19 17.667969 17.667969 19 16 19 C 14.332031 19 13 17.667969 13 16 C 13 14.332031 14.332031 13 16 13 Z" />
        </svg><a class="c-nav__link" href="#?userid=${cubeid}">Settings</a></div>
    </li>`
    }
  } else if (document.querySelector('.js-history')){
    if (urlparams == 0) {
      window.location.href = 'inlog.html'
    } else{
      cubeid = urlparams.get('userid')
      handleData(`http://${window.location.hostname}:5000/history/${cubeid}/`, showHistory, showError)
      handleData(`http://${window.location.hostname}:5000/chathistory/`, showChatHistory, showError)
    }
  }
  listenToUI();
  listenToSocket();
};

document.addEventListener('DOMContentLoaded', init);
