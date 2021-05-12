<?php
  $rawPostData = file_get_contents("php://input");
  var_dump($rawPostData);
  file_put_contents('users.json', $rawPostData);
?>
