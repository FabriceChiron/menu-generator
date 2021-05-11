<?php
   $json = $_POST['json'];
   $info = json_encode($json);
   $info_decode = json_decode($info);

   $file = fopen('menus-test.json','w+');
   fwrite($file, $info_decode);
   fclose($file);
?>