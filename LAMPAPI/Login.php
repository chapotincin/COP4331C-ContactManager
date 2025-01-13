 
<?php

	#Takes data in via HTTP request
	$inData = getRequestInfo();
	
	$id = 8;
	$firstName = "Ray";
	$lastName = "Jam";
	
	#Mock Data until database is up
	
	if ($inData["login"] === "userRay" && $inData["password"] === "passRay")
	{
		returnWithInfo($firstName, $lastName, $id)
	}
	else
	{
		returnWithError("No Records Found");
	}
	
#-----------------------------------------------------------------------------------------------
	#DATABASE NOT UP LEAVE CODE COMMENTED
	#Initializing the database connection
	#$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 

	#Case for Connection fail
	/*if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	#Case for conection pass 
	else
	{
		#Retrieve correct info based on login
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		#The ss means two string parameters 
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		#execute and store in result 
		$stmt->execute();
		$result = $stmt->get_result();

		#fetch retrieves an associative array ($row)
		if( $row = $result->fetch_assoc()  )
		{
			#sends first and last name 
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
			#case for no match
			returnWithError("No Records Found");
		}

		#Closes out the database connedtion safely
		$stmt->close();
		$conn->close();
	}
#-----------------------------------------------------------------------------------------------
	
	#Reads JSON data from request and decoes into PHP array
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	#Send JSON response with "Content-Type" and header set to application/json
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	#Returns a JSON object indicating error
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	#Return a JSON object with user information
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
*/
