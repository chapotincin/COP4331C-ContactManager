<?php
	//get incoming json package
	$inData = getRequestInfo();
	
	//variables
	$searchResults = "";
	$searchCount = 0;

    //connection -> fail/pass
	$conn = new mysqli("localhost", "TheApiGuy", "Awes0mePassw0rd!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//search matching first and last name, phone, and email
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (firstName like ? OR lastName like ? OR phone like ? OR email like ? OR UserID)");
		//formats the name to be searched
		//SELECT * FROM Contacts WHERE (firstName/lastName LIKE '%R%') AND ID = 123;
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $search, $search, $search, $search, $inData["UserID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;

            //array of json objects FirstName, LastName, Phone, Email, UserId, Maybe jsonencode?
            $searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "ID" : "' . $row["ID"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	//copied from the example
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>