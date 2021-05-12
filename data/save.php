<?php
  $rawPostData = file_get_contents("php://input");
  // var_dump($rawPostData);
  $data = json_decode($rawPostData, true);
  // var_dump($data);
  $fileName = $data['fileName'];
  // var_dump($fileName);

  // $json_encoded = json_encode($data);
  file_put_contents($fileName, $rawPostData);


  // $json = file_get_contents('php://input');
  // $info = json_encode($json);
  // $info_decode = json_decode($info);

  //  $filename = "storage.json";
  // $file = file_get_contents($filename);
  // $json_decoded = json_decode($file);

  // $json_decoded->heroes[0]->name = "CEO Steve Jobs";


  // $json_encoded = json_encode($json_decoded);
  // file_put_contents($filename, $json_encoded);
?>

<!--   $data = json_decode(file_get_contents('php://input'));
  print_r($data);
  echo $data["fileName"];
  // var_dump($rawPostData);
  /*$rawPostData = file_get_contents("php://input");
  $json_encode = json_encode($rawPostData, true);
  $data = json_decode($json_encode, true);
  var_dump($data);
  $fileName = $json_encode['fileName'];
  var_dump($data);
  $file = fopen($fileName,'w+');
  fwrite($file, $data);
  fclose($file);*/ -->