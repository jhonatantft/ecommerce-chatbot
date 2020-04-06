var visb = {
  hide: function hide (el) {
    if (el instanceof HTMLElement) {
      el.style.display = 'none';
    }
  },
  show: function show (el) {
    if (el instanceof HTMLElement) {
      el.style.display = 'block';
    }
  }
};

function hideLoadingDiv () {
  setTimeout(function hideEl () {
    var loadingDiv = document.querySelector('.loading');
    loadingDiv.classList.add('hide');
    setTimeout(function removeEl () {
      visb.hide(loadingDiv);
    }, 1000);
  }, 2000);
}

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

function createsUser () {
  var form = document.querySelector('form');
  var firstname = form.querySelector('input[name="firstname"]').value;
  var lastname = form.querySelector('input[name="lastname"]').value;
  var username = form.querySelector('input[name="username"]').value;
  var email = form.querySelector('input[name="email"]').value;
  var password_ = form.querySelector('input[name="password"]').value;
  var json = {
    firstname,
    lastname,
    username,
    email,
    password_
  }
  fetch('/users', {
    method: 'POST',
    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
    body: JSON.stringify(json)
  });
}

function login () {
  var form = document.querySelector('form#login');
  var username = form.querySelector('input[name="username"]').value;
  var password_ = form.querySelector('input[name="password"]').value;
  var json = {
    username,
    password_
  }
  fetch(`/users/username/${username}`, {
    method: 'GET',
    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
  })
  .then(response => response.json())
  .then(json => {
    var dbPassword = json && json[0] && json[0].password_;
    if (dbPassword === password_){
      setCookie('ebot-user', JSON.stringify(json[0]))
    } else {
      eraseCookie('ebot-user')
    }
  });
}

async function fetchProducts () {
  return fetch(`/products`, {
    method: 'GET',
    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
  })
  .then(response => response.json())
  .then(json => {
    return json
  });
}

function initChatbot () {
  var sendForm = document.querySelector('#chatform'),
    textInput = document.querySelector('.chatbox'),
    chatList = document.querySelector('.chatlist'),
    userBubble = document.querySelectorAll('.userInput'),
    botBubble = document.querySelectorAll('.bot__output'),
    animateBotBubble = document.querySelectorAll('.bot__input--animation'),
    overview = document.querySelector('.chatbot__overview'),
    hasCorrectInput,
    imgLoader = false,
    animationCounter = 1,
    animationBubbleDelay = 600,
    input,
    previousInput,
    isReaction = false,
    unkwnCommReaction = "Acho que não entendi",
    chatbotButton = document.querySelector(".submit-button")

sendForm.onkeydown = function(e){
  if(e.keyCode == 13){
    e.preventDefault();

    //No mix ups with upper and lowercases
    var input = textInput.value.toLowerCase();

    //Empty textarea fix
    if(input.length > 0) {
      createBubble(input)
    }
  }
};

sendForm.addEventListener('submit', function(e) {
  //so form doesnt submit page (no page refresh)
  e.preventDefault();

  //No mix ups with upper and lowercases
  var input = textInput.value.toLowerCase();

  //Empty textarea fix
  if(input.length > 0) {
    createBubble(input)
  }
}) //end of eventlistener

var createBubble = function(input) {
  //create input bubble
  var chatBubble = document.createElement('li');
  chatBubble.classList.add('userInput');

  //adds input of textarea to chatbubble list item
  chatBubble.innerHTML = input;

  //adds chatBubble to chatlist
  chatList.appendChild(chatBubble)

  checkInput(input);
}

var checkInput = function(input) {
  hasCorrectInput = false;
  isReaction = false;
  //Checks all text values in possibleInput
  for(var textVal in possibleInput){
    //If user reacts with "yes" and the previous input was in textVal
    if(input.toLowerCase() === 'sim' || input == "yes" || input.indexOf("yes") >= 0){
      if(previousInput == textVal) {
        console.log("sausigheid");

        isReaction = true;
        hasCorrectInput = true;
        botResponse(textVal);
      }
    }
    if(input.toLowerCase() === 'não' || input.toLowerCase() === 'nao' || input == "no" && previousInput == textVal){
      unkwnCommReaction = "For a list of commands type: Commands";
      unknownCommand("I'm sorry to hear that :(")
      unknownCommand(unkwnCommReaction);
      hasCorrectInput = true;
    }
    //Is a word of the input also in possibleInput object?
    if(input == textVal || input.indexOf(textVal) >=0 && isReaction == false){
			console.log("succes");
      hasCorrectInput = true;
      botResponse(textVal);
		}
	}
  //When input is not in possibleInput
  if(hasCorrectInput == false){
    console.log("failed");
    unknownCommand(unkwnCommReaction);
    hasCorrectInput = true;
  }
}

// debugger;

function botResponse(textVal) {
  //sets previous input to that what was called
  // previousInput = input;

  //create response bubble
  var userBubble = document.createElement('li');
  userBubble.classList.add('bot__output');

  if(isReaction == true){
    if (typeof reactionInput[textVal] === "function") {
    //adds input of textarea to chatbubble list item
      userBubble.innerHTML = reactionInput[textVal]();
    } else {
      userBubble.innerHTML = reactionInput[textVal];
    }
  }

  if(isReaction == false){
    //Is the command a function?
    if (typeof possibleInput[textVal] === "function") {
      // console.log(possibleInput[textVal] +" is a function");
    //adds input of textarea to chatbubble list item
      userBubble.innerHTML = possibleInput[textVal]();
    } else {
      userBubble.innerHTML = possibleInput[textVal];
    }
  }
  //add list item to chatlist
  chatList.appendChild(userBubble) //adds chatBubble to chatlist

  // reset text area input
  textInput.value = "";
}

function unknownCommand(unkwnCommReaction) {
  // animationCounter = 1;

  //create response bubble
  var failedResponse = document.createElement('li');

  failedResponse.classList.add('bot__output');
  failedResponse.classList.add('bot__output--failed');

  //Add text to failedResponse
  failedResponse.innerHTML = unkwnCommReaction; //adds input of textarea to chatbubble list item

  //add list item to chatlist
  chatList.appendChild(failedResponse) //adds chatBubble to chatlist

  animateBotOutput();

  // reset text area input
  textInput.value = "";

  //Sets chatlist scroll to bottom
  chatList.scrollTop = chatList.scrollHeight;

  animationCounter = 1;
}

function responseText(e) {

  var response = document.createElement('li');

  response.classList.add('bot__output');

  //Adds whatever is given to responseText() to response bubble
  response.innerHTML = e;

  chatList.appendChild(response);

  animateBotOutput();

  console.log(response.clientHeight);

  //Sets chatlist scroll to bottom
  setTimeout(function(){
    chatList.scrollTop = chatList.scrollHeight;
    console.log(response.clientHeight);
  }, 0)
}

function responseImg(e) {
  var image = new Image();

  image.classList.add('bot__output');
  //Custom class for styling
  image.classList.add('bot__outputImage');
  //Gets the image
  image.src = "/images/"+e;
  chatList.appendChild(image);

  animateBotOutput()
  if(image.completed) {
    chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
  }
  else {
    image.addEventListener('load', function(){
      chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
    })
  }
}

//change to SCSS loop
function animateBotOutput() {
  chatList.lastElementChild.style.animationDelay= (animationCounter * animationBubbleDelay)+"ms";
  animationCounter++;
  chatList.lastElementChild.style.animationPlayState = "running";
}

function commandReset(e){
  animationCounter = 1;
  previousInput = Object.keys(possibleInput)[e];
}

function checkUserAuthentication (resetIndex) {
  var user;
  try {
    user = JSON.parse(decodeURIComponent(getCookie('ebot-user')))
  } catch (error) {
    console.error(error);
  }
  if (user && user.firstname) {
    responseText(`Você já está logado <span class="bot__command">${user.firstname}</span>, vamos às compras!`)
    commandReset(resetIndex);
    return true;
  } else {
    return false;
  }
}

var possibleInput = {
  'criar conta': async function () {
    var user;
    try {
      user = JSON.parse(decodeURIComponent(getCookie('ebot-user')))
    } catch (error) {
      console.error(error);
    }
  if (user && user.firstname) {
    responseText(`Você já tem uma conta e está logado nela <span class="bot__command">${user.firstname}</span>`)
    commandReset(2);
    return;
  } else {
    responseText(`
    <form action="/#" onsubmit="createsUser();return false">
      Nome:<br>
      <input type="text" name="firstname" required>
      <br><br>
      Sobrenome:<br>
      <input type="text" name="lastname" required>
      <br><br>
      Nome de usuário:<br>
      <input type="text" name="username" required>
      <br><br>
      Email:<br>
      <input type="email" name="email" required>
      <br><br>
      Senha:<br>
      <input type="password" name="password" required>
      <br><br>
      <input class="create-account" type="submit" value="Criar conta">
    </form>
    `)
    var checkUserCreationSuccess = setInterval(function () {
      var user;
      try {
        user = JSON.parse(decodeURIComponent(getCookie('ebot-user')))
      } catch (error) {
        console.error(error);
      }
      if (user && user.firstname) {
        clearInterval(checkUserCreationSuccess);
        responseText(`Seja bem vindo ao ebot <span class="bot__command">${user.firstname}</span>!`)
        commandReset(0);
        return;
      }
    }, 1000);
    commandReset(0);
    return;
  }
  },
  'login': async function () {
    if (!checkUserAuthentication(1)) {
      responseText(`
      <form id="login" action="/#" onsubmit="login();return false">
        Nome de usuário:<br>
        <input type="text" name="username" required>
        <br><br>
        Senha:<br>
        <input type="password" name="password" required>
        <br><br>
        <input class="create-account" type="submit" value="Logar">
      </form>
      `)
    }
  },
  'logout': function () {
    var user;
      try {
        user = JSON.parse(decodeURIComponent(getCookie('ebot-user')))
      } catch (error) {
        console.error(error);
      }
    if (!user) {
      responseText(`Você não está logado`)
      commandReset(2);
      return;
    } else {
      eraseCookie('ebot-user')
      responseText(`Você foi deslogado`)
      commandReset(2);
      return
    }
  },
  'ver produtos': async function () {
    responseText('Quer ver os melhores produtos? (Sim/Não)"')
    commandReset(3)
    window.ebot = {}
    window.ebot.products = await fetchProducts();
    return
  },
  "commands" : function(){
    responseText("Esta é a lista de comandos do ebot:")
    responseText("criar conta, login, logout, ver produtos");
    commandReset(8);
    return
  }
}

var reactionInput = {
  'ver produtos': function () {
    var fetchedProducts = window.ebot && window.ebot.products
    if (fetchedProducts) {
      var products = fetchedProducts.map(function (item) {
        var availability = item.availability ? 'Disponível' :  'Indisponível'
        return `
        <li>
          <div class="container page-wrapper">
            <div class="page-inner">
              <div class="row">
                <div class="el-wrapper">
                  <div class="box-up">
                    <img class="img" src="${item.image_url}" alt="">
                    <div class="img-info">
                      <div class="info-inner">
                        <span class="p-name">${item.product_name}</span>
                        <span class="p-company">${item.brand}</span>
                      </div>
                      <div class="a-size">${availability}</span></div>
                    </div>
                  </div>
          
                  <div class="box-down">
                    <div class="h-bg">
                      <div class="h-bg-inner"></div>
                    </div>
          
                    <a class="cart" href="${item.url}" target="_blank">
                      <span class="price">${item.price}</span>
                      <span class="add-to-cart">
                        <span class="txt">Ver produto</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        `
      });
      responseText(`<ul>${products.join('')}</ul>`)
      animationCounter = 1;
      return
    }
  }
  }
};

function init () {
  initChatbot();
};

init();