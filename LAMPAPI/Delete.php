<?php
	$inData = getRequestInfo();
	
    //variables 
    $Id = $inData["ID"];

    $conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        //adjusted parameters
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
		$stmt->bind_param("s", $Id);
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