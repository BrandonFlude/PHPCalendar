// This JavaScript file (extras.js) contains all of the extras functions to make the website run
function logOut()
{
  clearCookie("user_api_key");
  clearCookie("username");
}

function showLoginForm()
{
  // Clear any open divs
  $("#notification").html("");
  $("#showData").html("");

  // Create login form
  showForm("login");
}

function showRegisterForm()
{
  // Clear any open divs
  $("#notification").html("");
  $("#showData").html("");

  // Create register form
  showForm("register");
}

function isSignedIn()
{
  var user_api_key = getCookie("user_api_key");
  if(user_api_key != "")
  {
    return true;
  }
  else
  {
    return false;
  }
}

function getCurrentMonthAsText()
{
  return monthNames[new Date().getMonth()];
}

function getCurrentYear()
{
  return new Date().getFullYear();
}

function updateNavBar(type)
{
  if(type == "loggedIn")
  {
    $("#navbar-type").html('<ul class="nav navbar-nav navbar-right"><li><a class="page-scroll">' + getCookie("username") + '</a></li><li><a class="page-scroll fake-link" onclick="logOut()">Logout</a></li></ul>');
  }
  if(type == "loggedOut")
  {
    $("#navbar-type").html('<ul class="nav navbar-nav navbar-right"><li><a class="page-scroll fake-link" onclick="showLoginForm()">Login</a></li><li><a class="page-scroll fake-link" onclick="showRegisterForm()">Register</a></li></ul>');
  }
}

function clearCookie(cname)
{
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
}

function showForm(form)
{
  var strResult = "";
  if(form == "login")
  {
    strResult = '<div class="panel panel-default"> <div class="panel-heading">Login</div><div class="panel-body"> <div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="username_login_form_addon">Username</span> <input type="text" class="form-control" placeholder="Username" aria-describedby="username_login_form_addon" id="username_login_form"/> </div></div><div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="password_login_form_addon">Password</span> <input type="password" class="form-control" placeholder="Password" aria-describedby="password_login_form_addon" id="password_login_form"/> </div></div></div><div class="panel-footer"> <div class="row"> <div class="col-md-12"> <input type="button" class="btn btn-success btn-block" value="Login" onclick="login()"/> </div></div><center> <a class="fake-link" onclick="showRegisterForm()">Or Register</a> </center> </div></div>';
  }
  if(form == "register")
  {
    strResult = '<div class="panel panel-default"> <div class="panel-heading">Register</div><div class="panel-body"> <div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="username_register_form_addon">Username</span> <input type="text" class="form-control" placeholder="Username" aria-describedby="username_register_form_addon" id="username_register_form"/> </div></div><div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="password_register_form_addon">Password</span> <input type="password" class="form-control" placeholder="Password" aria-describedby="password_register_form_addon" id="password_register_form"/> </div></div><div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="password_confirm_register_form_addon">Confirm Password</span> <input type="password" class="form-control" placeholder="Confirm Password" aria-describedby="password_confirm_register_form_addon" id="password_confirm_register_form"/> </div></div></div><div class="panel-footer"> <div class="row"> <div class="col-md-12"> <input type="button" class="btn btn-success btn-block" value="Register" onclick="register()"/> </div></div><center> <a class="fake-link" onclick="showLoginForm()">Or Login</a> </center> </div></div>';
  }

  $("#showData").html(strResult);
}

function cancelEventTask()
{
  $("#showData").slideUp();
  $("#showData").html("");
}

function showAlert(type, message)
{
  // Print message from the server
  $("#notification").slideUp();
  $("#notification").html('<div class="alert alert-' + type + ' alert-dismissible" role="alert"><button type="button" class="close" onclick="dismissAlert()" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>');
  $("#notification").slideDown();
}

function dismissAlert()
{
  $("#notification").slideUp();
}

function setCookie(cname, cvalue, exdays)
{
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++)
  {
    var c = ca[i];
    while (c.charAt(0) == ' ')
    {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0)
    {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
