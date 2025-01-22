const urlBase = 'http://thecontactcircuit.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister()
{
	let fname = document.getElementById("firstName").value;
	let lname = document.getElementById("lastName").value;
	let username = document.getElementById("username").value;
	let pass = document.getElementById("password").value;
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {
		fname: fname,
		lname: lname,
		username: username,
		password: pass
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); 
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
	{
		
		if (this.readyState == 4 && this.status == 200)
		{
			let jsonObject = JSON.parse(xhr.responseText);

		//Check if there's an error
			if (jsonObject.error && jsonObject.error.length > 0)
			{
				document.getElementById("registerResult").innerHTML = jsonObject.error;
				return;
			}

			userId     = jsonObject.id;
			firstName  = jsonObject.fname;
			lastName   = jsonObject.lname;

			saveCookie();
			window.location.href = "../search/index.html";
		}
	};
	xhr.send(jsonPayload);
	}
	catch(err)
	{
	document.getElementById("registerResult").innerHTML = err.message;
	}
}


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login: login, password: password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if(userId < 1)
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "search/index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doAdd(){
	//let newContact = document.getElementById("createContact").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	let userId = document.getElementById("userId").value;
	document.getElementById("createContactResult").innerHTML = ""; //

	let tmp = {
		FirstName: firstName,
		LastName: lastName,
		Phone: phone,
		Email: email,
		UserID: userId
	};

	//let tmp = {color:newContact,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Add.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("createContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("createContactResult").innerHTML = err.message;
	}
}

function doDelete(){
	let databaseId = document.getElementById("deleteContact").value; //
	document.getElementById("deleteContactResult").innerHTML = ""; //

	let tmp = {ID: databaseId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteContactResult").innerHTML = err.message;
	}
}

function doEdit(){
	let databaseId = document.getElementById("databaseID").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	let userId = document.getElementById("userId").value;
	document.getElementById("modifyResult").innerHTML = ""; //


	let tmp = {
		ID: databaseId,
		FirstName: firstName,
		LastName: lastName,
		Phone: phone,
		Email: email,
		UserID: userId
	};

	//let tmp = {color:newContact,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Edit.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("modifyResult").innerHTML = "Contact has been changed";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("modifyResult").innerHTML = err.message;
	}
}

function doSearch(){
	let srch = document.getElementById("searchBar").value;
	document.getElementById("searchButton").innerHTML = ""; //
	
	let list = "";

	let tmp = {search:srch,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	//url to the php file (urlbase/Search.php)
	let url = urlBase + '/Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchButton").innerHTML = "Contact(s) has been retrieved"; //
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					list += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						list += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = list;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SearchResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
