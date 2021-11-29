<?php
ini_set("session.cookie_httponly", 1);
session_start();
$wins = $_SESSION['wins'];
if ($wins != null) {
    echo json_encode(array(
        "success" => true,
		"wins" => $wins,
	));
	exit;
}
else {
    echo json_encode(array(
		"success" => false
	));
	exit;
}
?>