<?php

    #Takes data in via HTTP request
    $inData = getRequestInfo();
    
    #Initialize variables
    $id = 0;
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $username = $inData["username"];
    $password = $inData["password"];
    
    #Initializing the database connection
    $conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");

    #Case for connection fail
    if( $conn->connect_error )
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        #Check if username already exists
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->fetch_assoc())
        {
            returnWithError("Username already taken");
        }
        else
        {
            #Insert new user into db
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Phone, Login, Password) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $firstName, $lastName, $email, $phone, $username, $password);
            
            if($stmt->execute())
            {
                #Return response
                $id = $conn->insert_id; #Get the last inserted ID
                returnWithInfo($firstName, $lastName, $id);
            }
            else
            {
                returnWithError("Failed to register user");
            }
        }
        
        #Closes gracefully
        $stmt->close();
        $conn->close();
    }


    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    
    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    
    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
