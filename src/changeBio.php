<?php
    header("Content-Type: application/json");
    session_start();

    //Retrieve input and store in array
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);
    

    //Set variables
    $newBio = $json_obj['bio'];
    $user_id = $json_obj["id"]; 
    $_SESSION['bio'] = $newBio;
                
    //load database
    require './database.php';
    session_start();

    $stmt = $mysqli->prepare("UPDATE users set bio=? where user_id=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ss', $newBio, $user_id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(array(
        "success" => true,
    ));
    exit;

?>