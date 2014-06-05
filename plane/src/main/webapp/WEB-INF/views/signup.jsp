<script type="text/javascript" src="presenter/jquery.js"></script>
<script type="text/javascript" src="presenter/jquery.validate.min.js"></script>
<link rel="stylesheet" type="text/css"
	href="presenter/bootstrap/css/bootstrap.min.css">
<script type="text/javascript"
	src="presenter/bootstrap/js/bootstrap.min.js"></script>
	

<style>
.html,body{
	margin:20px;
}
.form-control {
    width:300px;
}
</style>

	<a href="login">Login</a>        <br><br><br>
<c:url value="/signup" var="signupUrl"/>
<form action="${signupUrl}" method="post" role="form" id="signForm">       

    <p>
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" name="userName"/>	
    </p>
     <p>
        <label for="username">First Name</label>
        <input type="text" class="form-control" id="firstname" name="firstName"/>	
    </p>
     <p>
        <label for="username">Last Name</label>
        <input type="text" class="form-control" id="username" name="lastName"/>	
    </p>
    <p>
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" name="password"/>	
    </p>
     <p>
        <label for="password">Confirm password</label>
        <input type="password" class="form-control" id="confirm_password" name="confirmPassword"/>	
    </p>
    <input type="hidden"                        
        name="${_csrf.parameterName}"
        value="${_csrf.token}"/>
    <button type="submit" class="btn">Sign up</button>
</form>

<script type="text/javascript">

$( "#signForm" ).validate({
	  rules: {
	    password: "required",
	    confirm_password: {
	      equalTo: "#password"
	    }
	  }
	});
</script>
