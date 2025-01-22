<?php
	$inData = getRequestInfo();
	
    //variables 
    $fname = $inData["FirstName"];
    $lname = $inData["LastName"];
    $phone = $inData["Phone"];
	$email = $inData["Email"];
    //$Id = $inData["ID"];
    //$userId = $inData["UserID"];

    $conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        //adjusted parameters
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $fname, $lname, $phone, $email);
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