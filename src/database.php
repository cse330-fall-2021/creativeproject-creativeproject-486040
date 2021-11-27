<?php
// Content of database.php
$mysqli = new mysqli('localhost', 'root', 'Acined99', 'connect4');

if($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
}
?>