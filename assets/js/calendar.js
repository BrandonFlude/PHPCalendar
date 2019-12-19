// This JavaScript file (calendar.js) contains the functions needed to generate the calendar
function loadCalendar(month, year)
{
  // Load up all of the variables I need to show the correct month.
  var date = new Date();
  var currentMonthName = monthNames[date.getMonth()];

  // Set the month to the one the user requested
  var monthInt = monthNames.indexOf(month);
  date.setMonth(monthInt);
  date.setFullYear(year);

  // Get the current day
  var dateString = date.toString().split(" ");
  var currentDay = dateString[2];

  // Get start of the month in view
  var startDay = new Date(date.getFullYear(), date.getMonth(), 1).toString().split(" ");
  startDay = startDay[0];

  // Check for end and start of a year
  if(monthInt == 0)
  {
    var nextMonthName = "February";
    var previousMonthName = "December";
  }
  else if(monthInt == 11)
  {
    var nextMonthName = "January";
    var previousMonthName = "November";
  }
  else
  {
    var previousMonthName = monthNames[monthInt - 1];
    var nextMonthName = monthNames[monthInt + 1];
  }

  year = parseInt(year);
  if(nextMonthName == "January")
  {
    var nextYear = year + 1;
    var previousYear = year;
  }
  else if(previousMonthName == "December")
  {
    var nextYear = year;
    var previousYear = year - 1;
  }
  else
  {
    var nextYear = year;
    var previousYear = year;
  }

  var inViewMonthName = monthNames[monthInt];

  daysInMonth = getDaysInMonth(monthInt, year);

  // Expand area to show a full width calendar
  document.getElementById("display-size").className = "col-md-12";

  var htmlToDisplay = "<div class='panel panel-default'> <div class='panel-heading'> <div class='btn-group pull-right'> <a class='btn btn-primary btn-xs' onclick='createNewEventForm();'>Add Event</a> <a class='btn btn-default btn-xs' onClick='loadCalendar(\"" + previousMonthName + "\", \"" + previousYear + "\")'>&#10094; Previous</a><a class='btn btn-default btn-xs' onClick='loadCalendar(\"" + nextMonthName + "\", \"" + nextYear + "\")'>Next &#10095;</a><a class='btn btn-info btn-xs' onClick='loadCalendar(\"" + getCurrentMonthAsText() + "\", \"" + getCurrentYear() + "\")'>Today</a> </div>" + inViewMonthName + " " + year + "</div>";

  // Add weekdays
  htmlToDisplay += '<ul class="weekdays"><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li><li>Sun</li></ul>';

  // Calculate the number of empty spaces we will need
  switch(startDay)
  {
    case "Mon":
      empty = 0;
      break;
    case "Tue":
      empty = 1;
      break;
    case "Wed":
      empty = 2;
      break;
    case "Thu":
      empty = 3;
      break;
    case "Fri":
      empty = 4;
      break;
    case "Sat":
      empty = 5;
      break;
    case "Sun":
      empty = 6;
      break;
    default:
      break;
  }
  htmlToDisplay += '<ul class="days">';
  // Print out empty spaces
  for(var i = 0; i < empty; i++)
  {
    htmlToDisplay += '<li>&nbsp;</li>';
  }

  // Format the date and then get a list of days with events on, and then split it into an array
  var date_dt = formatDateForDatabase(year, monthInt);
  var listOfDays = getListOfDates(date_dt).split(", ");

  // Display all days for the month
  for(var i = 1; i <= daysInMonth; i++)
  {
    if($.inArray(i.toString(), listOfDays) != -1)
    {
      var dateString = date_dt.toString();
      if(i < 10)
      {
        dateString += "0" + i.toString();
      }
      else
      {
        dateString += i.toString();
      }
      // Event(s) on this day!
      htmlToDisplay += '<li><span class="has-event fake-button" onclick="viewEventsByDate(\'' + dateString + '\')">' + i + '</span></li>';
    }
    else
    {
      if(i == currentDay && month == currentMonthName)
      {
        // Looped onto today, so make it bold
        htmlToDisplay += '<li><span class="active">' + i + '</span></li>';
      }
      else
      {
        // Just display it normally
        htmlToDisplay += '<li>' + i + '</li>';
      }
    }
  }

  htmlToDisplay += '</ul></div>';

  $("#calendarDisplay").html(htmlToDisplay);
}

function formatDateForDatabase(year, month)
{
  var year = year;
  var month = month + 1;
  month = ('0' + month).slice(-2);
  var day = ('0' + day).slice(-2);
  return year + "-" + month + "-";
}

function getDaysInMonth(month, year)
{
  return new Date(year, month + 1, 0).getDate();
}

function getCurrentMonth()
{
  return new Date().getMonth() + 1;
}

function getCurrentYear()
{
  return new Date().getFullYear();
}

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
