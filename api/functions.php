<?php

// Include Database connections
require 'dbConfig.php';

function getEventsByMonth($user_api_key, $date_dt)
{
  if($user_api_key != "" && $date_dt != "")
  {
    // Begin query
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "SELECT * FROM events_tb WHERE user_id='$user_id' AND event_dt LIKE '$date_dt%'");
    $numrows = mysqli_num_rows($query);
    if($numrows > 0)
    {
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Got events";

      while($row = mysqli_fetch_assoc($query))
      {
        // Fetch whole date, then split it to retrieve the days
        $date_dt = explode(" ", $row['event_dt']);
        $date = explode("-", $date_dt[0]);
        $day = $date[2];

        // Quick fix to remove the leading 0 on days less than 10th.
        if($day < 10)
        {
          $day = substr($day, 1);
        }
        $listOfDays .= "$day, ";
      }
      // Trim the last comma and send it
      $toSendBack["days"] = substr($listOfDays, 0, -2);
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "You don't have any events this month, please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function getEventsByDate($user_api_key, $event_dt)
{
  if($user_api_key != "" && $event_dt != "")
  {
    // First split up the date, we only need the date part.
    $dateAndTime = explode(" ", $event_dt);
    $date = $dateAndTime[0];
    $time = $dateAndTime[1];
    $date = explode("-", $date);
    $year = $date[0];
    $month = $date[1];
    $day = $date[2];

    // Date string merge
    $dateString = "$year-$month-$day";

    // Begin query
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    // Begin to select all events on a given day by date and user_api_key
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "SELECT * FROM events_tb WHERE user_id='$user_id' AND event_dt LIKE '$dateString%' ORDER BY event_dt ASC");
    $numrows = mysqli_num_rows($query);
    if($numrows > 0)
    {
      $monthWord = convertMonthToWord($month);
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Got events";
      $toSendBack["count"] = $numrows;
      $toSendBack["event_dt_parsed"] = "$monthWord $day $year";

      $i = 1;
      while($row = mysqli_fetch_assoc($query))
      {
        // Split the date for easier reading
        $date_dt = $row['event_dt'];
        $date_dt = explode(" ", $date_dt);
        $time = $date_dt[1];
        $time = explode(":", $time);
        $hour = $time[0];
        $minute = $time[1];
        $second = $time[2];

        if($hour == 00)
        {
          $hour = 12;
          $rotation = "AM";
        }
        else if($hour >= 13)
        {
          $hour = $hour - 12;
          $rotation = "PM";
        }
        else
        {
          $rotation = "AM";
        }

        $toSendBack["event_id$i"] = $row['event_id'];
        $toSendBack["event_detail$i"] = $row['event_detail'];
        $toSendBack["event_dt$i"] = $row['event_dt'];
        $toSendBack["time_of_event$i"] = "$hour:$minute $rotation";
        $i++;
      }
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "You don't have any events on this day, please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function register($username, $password, $confirm_password)
{
  if($username != "" && $password != "" && $confirm_password != "")
  {
    // Check passwords match
    if($password == $confirm_password)
    {
      $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
      // Check if username is available
      $query = mysqli_query($con, "SELECT user_id FROM users_tb WHERE user_nm='$username'");
      $numrows = mysqli_num_rows($query);
      if($numrows == 0)
      {
        // Username is free

        // Create UserAPIKey
        $user_api_key = generateAPIKey();

        $query = mysqli_query($con, "INSERT INTO users_tb VALUES ('', '$username', '$password', '$user_api_key')");
        $affectedRows = mysqli_affected_rows($con);
        if($affectedRows == 1)
        {
          // Account created
          $toSendBack["type"] = "success";
          $toSendBack["message"] = "Your account has been created successfully. You can now login.";
        }
        else
        {
          $toSendBack["type"] = "warning";
          $toSendBack["message"] = "We could not update that event. Please try again.";
        }
      }
      else
      {
        // Username is taken
        $toSendBack["type"] = "danger";
        $toSendBack["message"] = "That username isn't available. Please try again.";
      }
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "Your passwords didn't match. Please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function encryptPassword($password)
{
  // Simply using md5 for this project, real life app would use salt and hash methods
  // I may change this if I have enough time at the end of the project.
  return md5($password);
}

function checkLogin($username, $password)
{
  if($username != "" && $password != "")
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $query = mysqli_query($con, "SELECT user_api_key FROM users_tb WHERE user_nm='$username' && user_pw='$password'");
    $affectedRows = mysqli_affected_rows($con);
    if($affectedRows > 0)
    {
      $row = mysqli_fetch_assoc($query);
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Successfully logged in. Welcome back!";
      $toSendBack["user_api_key"] = $row['user_api_key'];
    }
    else
    {
      $toSendBack["type"] = "danger";
      $toSendBack["message"] = "That account doesn't exist, why not sign up?";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}


function getEventsByUserAPIKey($user_api_key)
{
  if($user_api_key != "")
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $query = mysqli_query($con, "SELECT * FROM events_tb WHERE user_api_key='$user_api_key' ORDER BY event_dt ASC");

    $affectedRows = mysqli_affected_rows($con);
    if($affectedRows > 0)
    {
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Got events";
      $toSendBack["count"] = $affectedRows;

      $i = 1;
      while($row = mysqli_fetch_assoc($query))
      {
        $toSendBack["event_id$i"] = $row['event_id'];
        $toSendBack["event_detail$i"] = $row['event_detail'];
        $toSendBack["event_dt$i"] = $row['event_dt'];
        $i++;
      }
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "You don't have any events in the database currently. Try adding one!";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}


function deleteEvent($event_id, $user_api_key)
{
  if($event_id != "" && $user_api_key != "")
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "DELETE FROM events_tb WHERE event_id='$event_id' AND user_id='$user_id'");

    $affectedRows = mysqli_affected_rows($con);
    if($affectedRows > 0)
    {
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Your event was deleted successfully.";
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "You do not own that event, you cannot delete it.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function updateEvent($event_id, $user_api_key, $event_detail, $event_dt)
{
  if($event_id != "" && $user_api_key != "" && $event_detail != "" && isInString("null", $event_dt) == false)
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "UPDATE events_tb SET event_detail='$event_detail' WHERE event_id='$event_id' AND user_id='$user_id'");
    $query = mysqli_query($con, "UPDATE events_tb SET event_dt='$event_dt' WHERE event_id='$event_id' AND user_id='$user_id'");

    $affectedRows = mysqli_affected_rows($con);
    if($affectedRows > -1)
    {
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Your event was updated successfully.";
      $toSendBack["event_detail"] = $event_detail;
      $toSendBack["event_dt"] = $event_dt;
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "We could not update that event. Please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function createNewEvent($user_api_key, $event_detail, $event_dt)
{
  if($user_api_key != "" && $event_detail != "" && isInString("null", $event_dt) == false)
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "INSERT INTO events_tb VALUES ('', '$user_id', '$event_detail', '$event_dt')");
    $affectedRows = mysqli_affected_rows($con);

    if($affectedRows == 1)
    {
      $toSendBack["type"] = "success";
      $toSendBack["message"] = "Your event was created successfully.";
      $toSendBack["event_detail"] = $event_detail;
      $toSendBack["event_dt"] = $event_dt;
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "We could not update that event. Please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }
  mysqli_close($con);
  return $toSendBack;
}

function getEventByEventID($user_api_key, $event_id)
{

  if($user_api_key != "" && $event_id != "")
  {
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
    $user_id = getUserID($user_api_key);
    $query = mysqli_query($con, "SELECT * FROM events_tb WHERE event_id='$event_id' AND user_id='$user_id'");
    $numrows = mysqli_num_rows($query);
    $toSendBack = array();

    if($numrows > 0)
    {
      $row = mysqli_fetch_assoc($query);
      // Split the date so it's formatted for editting in a form client side
      $dateAndTimeFromDatabase = $row['event_dt'];

      $dateAndTime = explode(" ", $dateAndTimeFromDatabase);
      $date = $dateAndTime[0];
      $time = $dateAndTime[1];

      $date = explode("-", $date);
      $time = explode(":", $time);

      $year = $date[0];
      $month = $date[1];
      $day = $date[2];
      $hour = $time[0];
      $minute = $time[1];
      $seconds = $time[2];

      // Fix the hour
      if($hour == 00)
      {
        $hour = 12;
        $rotation = "AM";
      }
      else if($hour >= 13)
      {
        $hour = $hour - 12;
        $rotation = "PM";
      }
      else
      {
        $rotation = "AM";
      }

      // Send all these fields back in the response
      $toSendBack["event_id"] = $row["event_id"];
      $toSendBack["user_id"] = $row["user_id"];
      $toSendBack["event_detail"] = $row["event_detail"];
      $toSendBack["year"] = $year;
      $toSendBack["monthAsWord"] = convertMonthToWord($month);
      $toSendBack["monthAsNum"] = $month;
      $toSendBack["day"] = $day;
      $toSendBack["hour"] = $hour;
      $toSendBack["minute"] = $minute;
      $toSendBack["rotation"] = $rotation;
      $toSendBack["type"] = "success";
    }
    else
    {
      $toSendBack["type"] = "warning";
      $toSendBack["message"] = "We could not find that event, please try again.";
    }
  }
  else
  {
    $toSendBack["type"] = "danger";
    $toSendBack["message"] = "You did not fill out all of the fields correctly.";
  }

  mysqli_close($con);
  return $toSendBack;
}

function formatDateForDatabase($day, $month, $year, $hour, $minute, $rotation)
{
  // Fix the time to be 24 hour format
  if($rotation == "PM" || $rotation == "pm")
  {
    if($hour < 12)
    {
      $hour = $hour + 12;
    }
    else
    {
      $hour = 12;
    }
  }
  else
  {
    if($hour == 12)
    {
      $hour = "00";
    }
  }

  $month = convertMonthToNum($month);

  // Format it to the right string I need
  $event_dt = "$year-$month-$day $hour:$minute:00";

  return $event_dt;
}

function convertMonthToWord($month)
{
  // Convert month
  switch($month)
  {
    case "01":
      $month = "January";
      break;
    case "02":
      $month = "February";
      break;
    case "03":
      $month = "March";
      break;
    case "04":
      $month = "April";
      break;
    case "05":
      $month = "May";
      break;
    case "06":
      $month = "June";
      break;
    case "07":
      $month = "July";
      break;
    case "08":
      $month = "August";
      break;
    case "09":
      $month = "September";
      break;
    case "10":
      $month = "October";
      break;
    case "11":
      $month = "November";
      break;
    case "12":
      $month = "December";
      break;
    default:
      $month = $month;
      break;
  }
  return $month;
}

function convertMonthToNum($month)
{
  switch($month)
  {
    case "January":
      $month = "01";
      break;
    case "February":
      $month = "02";
      break;
    case "March":
      $month = "03";
      break;
    case "April":
      $month = "04";
      break;
    case "May":
      $month = "05";
      break;
    case "June":
      $month = "06";
      break;
    case "July":
      $month = "07";
      break;
    case "August":
      $month = "08";
      break;
    case "September":
      $month = "09";
      break;
    case "October":
      $month = "10";
      break;
    case "November":
      $month = "11";
      break;
    case "December":
      $month = "12";
      break;
    default:
      break;
  }
  return $month;
}

function getUserID($user_api_key)
{
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
  $query = mysqli_query($con, "SELECT * FROM users_tb WHERE user_api_key='$user_api_key'");
  $row = mysqli_fetch_assoc($query);
  return $row['user_id'];
}

function generateAPIKey()
{
  $api_key = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 30);
  return $api_key;
}

function isInString($word, $string)
{
  if(strpos($string, $word) !== false)
  {
    return true;
  }
  else
  {
    return false;
  }
}
?>
