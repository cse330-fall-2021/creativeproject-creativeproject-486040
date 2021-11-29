<?php
        // login_ajax.php
        header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

        //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
        $json_str = file_get_contents('php://input');
        //This will store the data into an associative array
        $json_obj = json_decode($json_str, true);

        //Variables can be accessed as such:
        $new_user = $json_obj['username'];
        $pwd = $json_obj['password'];
        $wins=0;
                
        //load database
        require './database.php';

        $pwd_hash = password_hash($pwd, PASSWORD_DEFAULT);
        $stmt = $mysqli->prepare("INSERT into users (username, password, wins) values (?, ?, ?)");
        if(!$stmt){
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
        }
        $stmt->bind_param('ssi', $new_user, $pwd_hash, $wins);
        $stmt->execute();
        $stmt->close();
        echo json_encode(array(
                "success" => true,
                "user" => $new_user, 
                "password" => $pwd_hash
        ));
        exit;

?>
