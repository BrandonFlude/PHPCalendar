<?php $pageTitle = "Calendar | Home"; ?>
<!DOCTYPE html>
<html lang="en">
<?php require($_SERVER['DOCUMENT_ROOT']."/assets/includes/head.php"); ?>
<body>
  <?php require($_SERVER['DOCUMENT_ROOT']."/assets/includes/navigation.php"); ?>
  <div class="container add-space">
    <div class="row">
      <div id="display-size" class="col-md-6 col-md-offset-3">
        <div id="notification">
        </div>
        <div id="showData">
        </div>
        <div id="calendarDisplay">
        </div>
      </div>
    </div>
  </div>
  <footer class="footer">
    <div class="container">
      <p class="align-vertical">Designed by Brandon Flude (100377798), using the <a href="https://www.slimframework.com" target="_blank">Slim Framework</a></p>
    </div>
  </footer>
</body>
</html>
