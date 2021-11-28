<?php
ini_set("session.cookie_httponly", 1);
session_start();
$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];
$bio = $_SESSION['bio'];
$wins = $_SESSION['wins'];
if ($user_id != null) {
    echo json_encode(array(
		"success" => true,
		"username" => $username,
		"bio" => $bio,
		"wins" => $wins,
		"id" => $user_id
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