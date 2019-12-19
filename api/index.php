<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'slim/vendor/autoload.php';
require 'functions.php';

$app = new \Slim\App;

// Get a specific event for a user
$app->get('/events/{user_api_key}/{event_id}', function (Request $request, Response $response)
{
  // Fetch the enetered event ID
  $user_api_key = $request->getAttribute('user_api_key');
  $event_id = $request->getAttribute('event_id');

  // Echo it out
  echo json_encode(getEventByEventID($user_api_key, $event_id));
});

// Get an event by user ID
$app->get('/events-by-user/{user_api_key}', function (Request $request, Response $response)
{
  // Fetch the entered event ID
  $user_api_key = $request->getAttribute('user_api_key');

  // Echo it out
  echo json_encode(getEventsByUserID($user_api_key));
});

// Get all events on a given date
$app->get('/events-by-date/{user_api_key}/{event_dt}', function (Request $request, Response $response)
{
  // Fetch the entered event date
  $user_api_key = $request->getAttribute('user_api_key');
  $event_dt = $request->getAttribute('event_dt');

  // Echo it out
  echo json_encode(getEventsByDate($user_api_key, $event_dt));
});

// Get Events in a month
$app->get('/events-by-month/{user_api_key}/{date_dt}', function (Request $request, Response $response)
{
  // Fetch the entered event date
  $user_api_key = $request->getAttribute('user_api_key');
  $date_dt = $request->getAttribute('date_dt');

  // Echo it out
  echo json_encode(getEventsByMonth($user_api_key, $date_dt));
});

// Add Event
$app->post('/events', function(Request $request, Response $response)
{
  $user_api_key = $request->getParam('user_api_key');
  $event_detail = $request->getParam('event_detail');
  $event_day = $request->getParam('day');
  $event_month = $request->getParam('month');
  $event_year = $request->getParam('year');
  $hour = $request->getParam('hour');
  $minute = $request->getParam('minute');
  $rotation = $request->getParam('rotation');

  // Convert the date to YYYY-MM-DD HH:MM:SS
  $event_dt = formatDateForDatabase($event_day, $event_month, $event_year, $hour, $minute, $rotation);

  // Echo out result of the method
  echo json_encode(createNewEvent($user_api_key, $event_detail, $event_dt));
});

// Update event
$app->put('/events/{event_id}', function(Request $request, Response $response)
{
  $event_id = $request->getAttribute('event_id');
  $user_api_key = $request->getParam('user_api_key');
  $event_detail = $request->getParam('event_detail');
  $event_day = $request->getParam('day');
  $event_month = $request->getParam('month');
  $event_year = $request->getParam('year');
  $hour = $request->getParam('hour');
  $minute = $request->getParam('minute');
  $rotation = $request->getParam('rotation');

  // Convert the date to YYYY-MM-DD HH:MM:SS
  $event_dt = formatDateForDatabase($event_day, $event_month, $event_year, $hour, $minute, $rotation);

  // Echo out result of the method
  echo json_encode(updateEvent($event_id, $user_api_key, $event_detail, $event_dt));
});

$app->delete('/events/delete/{user_api_key}/{event_id}', function(Request $request, Response $response){
    $event_id = $request->getAttribute('event_id');
    $user_api_key = $request->getAttribute('user_api_key');

    echo json_encode(deleteEvent($event_id, $user_api_key));
});

// Log User In
$app->post('/login', function(Request $request, Response $response)
{
  $username = $request->getParam('username');
  $password = $request->getParam('password');

  // Encrypt posted password
  $password = encryptPassword($password);

  // Echo out result of the method
  echo json_encode(checkLogin($username, $password));
});

// Add user
$app->post('/register', function(Request $request, Response $response)
{
  $username = $request->getParam('username');
  $password = $request->getParam('password');
  $confirm_password = $request->getParam('confirm_password');

  // Encrypt posted passwords
  $password = encryptPassword($password);
  $confirm_password = encryptPassword($confirm_password);

  // Echo out result of the method
  echo json_encode(register($username, $password, $confirm_password));
});

// Run the app that is called
$app->run();
