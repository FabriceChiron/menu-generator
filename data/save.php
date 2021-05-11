<?php
   $json = $_POST['json'];
   $info = json_encode($json);
   $info_decode = json_decode($info);
   $filename = $info_decode->fileName;
   $file = fopen($filename,'w+');
   fwrite($file, $info_decode);
   fclose($file);
?>