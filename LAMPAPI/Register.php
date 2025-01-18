<?php

    #Takes data in via HTTP request
    $inData = getRequestInfo();
    
    #Initialize variables
    $fname = $inData["fname"];
    $lname = $inData["lname"];
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
            #Username already exists
            returnWithError("Username already taken");
        }
        else
        {
            #Insert new user into the database
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $fname, $lname, $username, $password);
            
            if($stmt->execute())
            {
                #Return success response with user info
                $id = $conn->insert_id; #Get the last inserted ID
                returnWithInfo($firstName, $lastName, $id);
            }
            else
            {
                #Case for query failure
                returnWithError("Failed to register user");
            }
        }
        
        #Closes out the database connection safely
        $stmt->close();
        $conn->close();
    }

    #Reads JSON data from request and decodes into PHP array
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    #Send JSON response with "Content-Type" and header set to application/json
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    #Returns a JSON object indicating error
    function returnWithError($err)
    {
        $retValue = '{"id":0,"fname":"","lname":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    #Return a JSON object with user information
    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"fname":"' . $firstName . '","lname":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
