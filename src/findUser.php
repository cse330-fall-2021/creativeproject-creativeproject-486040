<?php
    header("Content-Type: application/json");
    session_start();

    //Retrieve input and store in array
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);
    

    //Set Variables
    $user_username = $json_obj['username'];
                
    //load database
    require './database.php';
    session_start();

    $stmt = $mysqli->prepare("SELECT user_id from users where username=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $user_username);
    $stmt->execute();
    $stmt->bind_result($id);
    $stmt->fetch();
    $stmt->close();
    echo json_encode(array(
        "success" => true,
        "id" => $id
    ));
    exit;

?>