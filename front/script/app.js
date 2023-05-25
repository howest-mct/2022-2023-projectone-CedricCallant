const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

const showRFID = function(jsonObject){
  console.info(jsonObject)
}

const showError = function(err){
  console.error(err)
}

const listenToUI = function () {
  document.querySelector('.js-login-btn').addEventListener('click', function(){
    const loginveld = document.querySelector('.js-loginveld')
    if(loginveld.value == null | loginveld.value == ""){
      console.info(loginveld.style.border);
      loginveld.style.border = "2px solid #FF0000";
    } else{
      loginveld.style.border = "2px solid #FFFFFF";
      const username = JSON.stringify({username: loginveld.value});
      handleData(`http://192.168.168.169:5000/api/v1/login/`, showRFID, showError,'POST' ,username);
    }
  })
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
