<?php
	$inData = getRequestInfo();
	
    //variables 
    $Id = $inData["ID"]; //mandatory to update a contact
    $fname = $inData["FirstName"];
    $lname = $inData["LastName"];
    $phone = $inData["Phone"];
	$email = $inData["Email"];
    //$userId = $inData["UserID"];


    $conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        //--- We can Update FirstName, LastName, Phone, Email, and UserID
        //currently updates all columns of the database simultaniously
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("sssss", $fname, $lname, $phone, $email, $Id);
        //---
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

    //---
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>