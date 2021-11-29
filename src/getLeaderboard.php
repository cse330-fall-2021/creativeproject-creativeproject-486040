<?php

    header("Content-Type: application/json"); 
    session_start();


    require './database.php';

    //add match user
    $stmt = $mysqli->prepare("SELECT username, wins FROM users ORDER by wins desc");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->execute();
    $stmt->bind_result($username, $wins);

    while($stmt->fetch()) {
        $usernames[] = htmlentities($username); 
        $winss[] = htmlentities($wins); 
    }

    $stmt->close();
        
    echo json_encode(array(
        "success" => true,
        "usernames" => $usernames,
        "winss" => $winss,
    ));
    exit;

?>