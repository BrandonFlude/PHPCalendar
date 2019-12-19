function viewEventsByUserID()
{
  user_id = getCookie("user_id");

  // Hide any open divs
  $("#notification").html("");

  if(user_id != "")
  {
    $.ajax({
      url: 'http://appdev.brandonflude.xyz/api/events-by-user/' + user_id,
      type: 'GET',
      cache: false,
      dataType: 'json',
      contentType: "application/json",
      success: function(response)
      {
        var type = response["type"];
        var message = response["message"];
        var count = response["count"];

        if(type == "success")
        {
          // Show all events
          var strResult = '<div class="panel panel-success"><div class="panel-heading">Your Events</div><div class="panel-body">';
          for(var i = 1; i <= count; i++)
          {
            var event_id = response["event_id" + i];
            var event_detail = response["event_detail" + i];
            var event_date = response["event_dt" + i];

            // Add each element to all data
            strResult += '<div class="panel panel-info"> <div class="panel-heading">' + event_detail + '</div><div class="panel-body"> ' + event_date + ' </div><div class="panel-footer"> <div class="row"> <div class="form-group"> <div class="col-md-12"> <input type="button" value="Update Event" class="btn btn-block btn-success" onclick="editEventFromAllEvents(' + event_id + ');"/> </div></div></div></div></div>';
          }
          strResult += '</div></div>';
          $("#showData").html(strResult);
        }
        else
        {
          // Print message from the server
          showAlert(type, message);
          $("#showData").html('');
        }
      },
      error: function(response)
      {
        // Unknown error
        showAlert("danger", "An unknown error occured. Please refresh and try again.");
        $("#showData").html('');
      }
    });
  }
  else
  {
    showAlert("danger", "You are not logged in, please login.");
  }
}
