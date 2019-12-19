// This JavaScript file (script.js) contains all of the API calls.
$(document).ready(function()
{
  // Work out what elements to show
  if(isSignedIn() == false)
  {
    showLoginForm();
    updateNavBar("loggedOut");
  }
  else
  {
    loadCalendar(getCurrentMonthAsText(), getCurrentYear());
    updateNavBar("loggedIn");
  }
});

function login()
{
  // Get data from login form
  var loginData = {
    username: document.getElementById("username_login_form").value,
    password: document.getElementById("password_login_form").value
  };

  // Make calls
  $.ajax({
    url: 'http://appdev.brandonflude.xyz/api/login',
    data: JSON.stringify(loginData),
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    success: function(response)
    {
      // Get User ID that was returned
      if(response["type"] == "success")
      {
        user_api_key = response["user_api_key"];
        var username = document.getElementById("username_login_form").value;
        setCookie("user_api_key", user_api_key, 365);
        setCookie("username", username, 365);
        updateNavBar("loggedIn");
        $("#showData").html("");
        loadCalendar(getCurrentMonthAsText(), getCurrentYear());
      }
      // Print message from the server
      showAlert(response["type"], response["message"]);

      // Clear the password field
      document.getElementById("password_login_form").value = "";
    },
    error: function(response)
    {
      showAlert("danger", "An unknown error occured. Please refresh and try again.");
    }
  });
}

function register()
{
  // Get data from register form
  var registerData = {
    username: document.getElementById("username_register_form").value,
    password: document.getElementById("password_register_form").value,
    confirm_password: document.getElementById("password_confirm_register_form").value
  };

  // Clear the divs
  $("#showData").html("");
  $("#notification").html("");

  // Make calls
  $.ajax({
    url: 'http://appdev.brandonflude.xyz/api/register',
    data: JSON.stringify(registerData),
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    success: function(response)
    {
      if(response["type"] == "success")
      {
        // Show login form
        showLoginForm();
      }
      else
      {
        // Show register form again
        showRegisterForm();
      }
      // Show response from the server
      showAlert(response["type"], response["message"]);
    },
    error: function(response)
    {
      showAlert("danger", "An unknown error occured. Please refresh and try again.");
    }
  });
}

function getListOfDates(date_dt)
{
  user_api_key = getCookie("user_api_key");
  var listOfDays = "";

  if(isSignedIn() == true)
  {
    $.ajax({
      async: false,
      url: 'http://appdev.brandonflude.xyz/api/events-by-month/' + user_api_key + '/' + date_dt,
      type: 'GET',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      success: function(response)
      {
        if(response["type"] == "success")
        {
          listOfDays = response["days"];
        }
        else
        {
          return listOfDays;
        }
      }
    });
    return listOfDays;
  }
}

function editEvent(event_id)
{
  user_api_key = getCookie("user_api_key");

  // Hide any open divs
  $("#notification").html("");
  $("#showData").html("");

  if(isSignedIn() == true)
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events/' + user_api_key + '/' + event_id,
      type: 'GET',
      cache: false,
      dataType: 'json',
      contentType: "application/json",
      success: function(response)
      {
        var idOfEvent = response["event_id"];
        var ownerOfEvent = response["user_id"];
        var eventDetails = response["event_detail"];
        var year = response["year"];
        var monthAsWord = response["monthAsWord"];
        var monthAsNum = response["monthAsNum"];
        var day = response["day"];
        var hour = response["hour"];
        var minute = response["minute"];
        var rotation = response["rotation"];
        var type = response["type"];

        if(type == "success")
        {
          $("#showData").slideUp();
          // No error, populate a form with the data from the GET.
          // Used a minifier here to not have to have an inifnite amount of lines.
          var strResult = '<div class="panel panel-default"> <div class="panel-heading"><div class="btn-group pull-right"> <a class="btn btn-danger btn-xs" onclick="cancelEventTask();">Close</a> </div>Update Your Event</div><form role="form"> <div class="panel-body"> <div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="event_name_addon">Event Name</span> <input type="text" class="form-control" placeholder="Event Name" aria-describedby="event_name_addon" id="event_detail" value="' + eventDetails + '"> </div></div><div class="row"> <div class="form-group"> <div class="col-md-4"> <select name="day" id="day" class="form-control"> <option value="' + day + '">' + day + '</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> <option value="13">13</option> <option value="14">14</option> <option value="15">15</option> <option value="16">16</option> <option value="17">17</option> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> </select> </div><div class="col-md-4"> <select name="month" id="month" class="form-control"> <option value="' + monthAsNum + '">' + monthAsWord + '</option> <option value="01">Janaury</option> <option value="02">February</option> <option value="03">March</option> <option value="04">April</option> <option value="05">May</option> <option value="06">June</option> <option value="07">July</option> <option value="08">August</option> <option value="09">September</option> <option value="10">October</option> <option value="11">November</option> <option value="12">December</option> </select> </div><div class="col-md-4"> <select name="year" id="year" class="form-control"><option value="' + year + '">' + year + '</option> <option value="2017">2017</option> <option value="2018">2018</option> <option value="2019">2019</option> </select> </div></div></div><br><div class="row"> <div class="form-group"> <div class="col-md-4"> <select name="hour" id="hour" class="form-control"> <option value="' + hour + '">' + hour + '</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> </select> </div><div class="col-md-4"> <select name="minute" id="minute" class="form-control"> <option value="' + minute + '">' + minute + '</option> <option value="00">00</option> <option value="15">15</option> <option value="30">30</option> <option value="45">45</option> </select> </div><div class="col-md-4"> <select name="ampm" id="ampm" class="form-control"> <option value="' + rotation + '">' + rotation + '</option> <option value="am">AM</option> <option value="pm">PM</option> </select> </div></div></div></div><div class="panel-footer"> <div class="row"> <div class="form-group"> <div class="col-md-6 col-xs-6"> <input type="button" value="Update Event" class="btn btn-block btn-success" onclick="updateEvent(' + idOfEvent + ');"/> </div><div class="col-md-6 col-xs-6"> <input type="button" value="Cancel" class="btn btn-block btn-danger" onclick="cancelEventTask();"/> </div></div></div></div></div></form>';
          $("#showData").html(strResult);
          $("#showData").slideDown();
        }
        else
        {
          // Print message from the server
          showAlert(response["type"], response["message"]);
        }
      },
      error: function(response)
      {
        // Unknown error
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
  }
}

function deleteEvent(event_id)
{
  user_api_key = getCookie("user_api_key");

  // Clear any divs with content still in them
  $("#showData").html("");
  $("#notification").html("");

  if(isSignedIn() == true)
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events/delete/' + user_api_key + '/' + event_id,
      type: 'DELETE',
      dataType: "json",
      contentType: "application/json",
      success: function(response)
      {
        // Print message from the server
        showAlert(response["type"], response["message"]);

        $("#showData").slideUp();

        // Reload Calendar
        loadCalendar(getCurrentMonthAsText(), getCurrentYear());
      },
      error: function(response)
      {
        // Unknown error
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
    $("#showData").html("");
  }
}


function updateEvent(eventID)
{
  // Collect all the data from the form
  var day = document.getElementById("day");
  var month = document.getElementById("month");
  var year = document.getElementById("year");
  var hour = document.getElementById("hour");
  var minute = document.getElementById("minute");
  var ampm = document.getElementById("ampm");

  var eventData = {
    user_api_key: getCookie("user_api_key"),
    event_detail: document.getElementById("event_detail").value,
    day: day[day.selectedIndex].value,
    month: month[month.selectedIndex].value,
    year: year[year.selectedIndex].value,
    hour: hour[hour.selectedIndex].value,
    minute: minute[minute.selectedIndex].value,
    rotation: ampm[ampm.selectedIndex].value
  };

  if(isSignedIn() == true)
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events/' + eventID,
      data: JSON.stringify(eventData),
      type: 'PUT',
      dataType: "json",
      contentType: "application/json",
      success: function(response)
      {
        if(response["type"] == "success")
        {
          // Clear any divs with content still in them
          $("#showData").slideUp();
          $("#showData").html("");
          $("#notification").html("");

          // Reload calendar
          loadCalendar(getCurrentMonthAsText(), getCurrentYear());
        }
        // Print message from the server
        showAlert(response["type"], response["message"]);
      },
      error: function(response)
      {
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
  }
}

function addEvent()
{
  // Collect all the data from the form
  var day = document.getElementById("day");
  var month = document.getElementById("month");
  var year = document.getElementById("year");
  var hour = document.getElementById("hour");
  var minute = document.getElementById("minute");
  var ampm = document.getElementById("ampm");

  var eventData = {
    user_api_key: getCookie("user_api_key"),
    event_detail: document.getElementById("event_detail").value,
    day: day[day.selectedIndex].value,
    month: month[month.selectedIndex].value,
    year: year[year.selectedIndex].value,
    hour: hour[hour.selectedIndex].value,
    minute: minute[minute.selectedIndex].value,
    rotation: ampm[ampm.selectedIndex].value
  };

  if(isSignedIn() == true)
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events',
      data: JSON.stringify(eventData),
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      success: function(response)
      {
        if(response["type"] == "success")
        {
          // Clear any divs with content still in them
          $("#showData").slideUp();
          $("#showData").html("");
          $("#notification").html("");

          // Reload calendar
          loadCalendar(getCurrentMonthAsText(), getCurrentYear());
        }
        // Print message from the server
        showAlert(response["type"], response["message"]);
      },
      error: function(response)
      {
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
  }
}

function viewEventsByDate(event_dt)
{
  user_api_key = getCookie("user_api_key");

  // Hide any open divs
  $("#showData").html("");
  $("#notification").html("");

  if(isSignedIn() == true)
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events-by-date/' + user_api_key + '/' + event_dt,
      type: 'GET',
      cache: false,
      dataType: 'json',
      contentType: "application/json",
      success: function(response)
      {
        var type = response["type"];
        var message = response["message"];
        var count = response["count"];
        var event_dt_parsed = response["event_dt_parsed"];

        if(type == "success")
        {
          // Show all events
          var strResult = '<div class="panel panel-success"><div class="panel-heading"><div class="btn-group pull-right"> <a class="btn btn-danger btn-xs" onclick="cancelEventTask();">Close</a> </div>Your Events for ' + event_dt_parsed + '</div><div class="panel-body">';
          for(var i = 1; i <= count; i++)
          {
            var event_id = response["event_id" + i];
            var event_detail = response["event_detail" + i];
            var event_date = response["event_dt" + i];
            var time_of_event = response["time_of_event" + i];

            // Add each element to all data
            strResult += '<div class="col-md-6"> <div class="panel panel-info"> <div class="panel-heading">' + event_detail + '</div><div class="panel-body"><h4>' + event_dt_parsed + '</h4><h5>' + time_of_event + '</h5></div><div class="panel-footer"> <div class="row"> <div class="form-group"> <div class="col-md-6 col-xs-6"> <input type="button" value="Update Event" class="btn btn-block btn-success" onclick="editEvent(' + event_id + ');"/> </div><div class="col-md-6 col-xs-6"> <input type="button" value="Delete Event" class="btn btn-block btn-danger" onclick="deleteEvent(' + event_id + ');"/> </div></div></div></div></div></div>';
          }
          strResult += '</div></div>';
          $("#showData").html(strResult);
          $("#showData").slideDown();
        }
        else
        {
          // Print message from the server
          showAlert(type, message);
        }
      },
      error: function(response)
      {
        // Unknown error
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
  }
}

function createNewEventForm()
{
  // Hide any open divs
  $("#notification").html("");
  $("#showData").html("");

  // Used a minifier here to not have to have an inifnite amount of lines.
  var strResult = '<div class="panel panel-default"> <div class="panel-heading"><div class="btn-group pull-right"> <a class="btn btn-danger btn-xs" onclick="cancelEventTask();">Close</a> </div>Add Event</div><form role="form"> <div class="panel-body"> <div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="event_name_addon">Event Name</span> <input type="text" class="form-control" placeholder="Event Name" aria-describedby="event_name_addon" id="event_detail"> </div></div><div class="row"> <div class="form-group"> <div class="col-md-4"> <select name="day" id="day" class="form-control"> <option value="null">Day</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> <option value="13">13</option> <option value="14">14</option> <option value="15">15</option> <option value="16">16</option> <option value="17">17</option> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> </select> </div><div class="col-md-4"> <select name="month" id="month" class="form-control"> <option value="null">Month</option> <option value="01">Janaury</option> <option value="02">February</option> <option value="03">March</option> <option value="04">April</option> <option value="05">May</option> <option value="06">June</option> <option value="07">July</option> <option value="08">August</option> <option value="09">September</option> <option value="10">October</option> <option value="11">November</option> <option value="12">December</option> </select> </div><div class="col-md-4"> <select name="year" id="year" class="form-control"> <option value="null">Year</option> <option value="2017">2017</option> <option value="2018">2018</option> <option value="2019">2019</option> </select> </div></div></div><br><div class="row"> <div class="form-group"> <div class="col-md-4"> <select name="hour" id="hour" class="form-control"> <option value="null">Hour</option> <option value="01">1</option> <option value="02">2</option> <option value="03">3</option> <option value="04">4</option> <option value="05">5</option> <option value="06">6</option> <option value="07">7</option> <option value="08">8</option> <option value="09">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> </select> </div><div class="col-md-4"> <select name="minute" id="minute" class="form-control"> <option value="null">Minute</option> <option value="00">00</option> <option value="15">15</option> <option value="30">30</option> <option value="45">45</option> </select> </div><div class="col-md-4"> <select name="ampm" id="ampm" class="form-control"> <option value="null">AM/PM</option> <option value="am">AM</option> <option value="pm">PM</option> </select> </div></div></div></div><div class="panel-footer"> <div class="row"> <div class="form-group"> <div class="col-md-6 col-xs-6"> <input type="button" value="Add Event" class="btn btn-block btn-success" onclick="addEvent();"/> </div><div class="col-md-6 col-xs-6"> <input type="button" value="Cancel" class="btn btn-block btn-danger" onclick="cancelEventTask();"/> </div></div></div></div></div></form>';
  $("#showData").html(strResult);
  $("#showData").slideDown();
}
