<?php

//var_dump($_POST);

$file = fopen('./concat.csv', 'w');
fwrite($file, $_POST['data']);
fclose($file);

http_response_code(200);