<?php
    header("Content-Type: application/json");
    session_start();

    //Set variables
    $wins = $_SESSION['wins'];
    $user_id = $_SESSION["user_id"]; 
    $newWins = $wins + 1;
    $_SESSION['wins'] = $newWins;
                
    //load database
    require './database.php';
    session_start();

    $stmt = $mysqli->prepare("UPDATE users set wins=? where user_id=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ss', $newWins, $user_id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(array(
        "success" => true,
    ));
    exit;

?>