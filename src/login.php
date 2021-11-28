<?php

// login_ajax.php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];
// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

require './database.php';

$stmt = $mysqli->prepare("SELECT COUNT(*), username, password, user_id, wins, bio FROM users WHERE username=?");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $username, $pwd_hash, $user_id, $wins, $bio);
$stmt->fetch();
$stmt->close();

if ($cnt == 1 && password_verify($password, $pwd_hash)){
	
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['user_id'] = $user_id;
	$_SESSION['bio'] = $bio;
	$_SESSION['wins'] = $wins;

	echo json_encode(array(
		"success" => true,
		"id" => $user_id,
		"username" => $username,
		"wins" => $wins,
		"bio" => $bio
	));
	exit;
}
else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>


