<?php
	$inData = getRequestInfo();
	
    //variables 
    $fname = $inData["fname"];
    $lname = $inData["lname"];
    $phone = $inData["phone"];
    $Id = $inData["ID"];
    $userId = $inData["userId"];
    $email = $inData["Email"];

    $conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        //adjusted parameters
		$stmt = $conn->prepare("INSERT into Contacts (firstName, lastName, phone, ID, userId, email) VALUES (?, ?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssss", $fname, $lname, $phone, $Id, $userId, $email);
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