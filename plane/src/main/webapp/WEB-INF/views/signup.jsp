<c:url value="/signup" var="signupUrl"/>
<form action="${signupUrl}" method="post">       

    <p>
        <label for="username">Username</label>
        <input type="text" id="username" name="userName"/>	
    </p>
     <p>
        <label for="username">First Name</label>
        <input type="text" id="firstname" name="firstName"/>	
    </p>
     <p>
        <label for="username">Last Name</label>
        <input type="text" id="username" name="lastName"/>	
    </p>
    <p>
        <label for="password">Password</label>
        <input type="password" id="password" name="password"/>	
    </p>
     <p>
        <label for="password">Confirm password</label>
        <input type="password" id="confirm_password" name="confirmPassword"/>	
    </p>
    <input type="hidden"                        
        name="${_csrf.parameterName}"
        value="${_csrf.token}"/>
    <button type="submit" class="btn">Sign up</button>
</form>