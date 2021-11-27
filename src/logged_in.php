<?php
ini_set("session.cookie_httponly", 1);
session_start();
$user_id = $_SESSION['user_id'];
if ($user_id != null) {
    echo json_encode(array(
		"success" => true
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