
<script src="presenter/MochiKit/MochiKit.js" type="text/javascript"></script>
<script src="presenter/Clipperz/Base.js" type="text/javascript"></script>
<script src="presenter/Clipperz/ByteArray.js" type="text/javascript"></script>
<script src="presenter/Clipperz/Crypto/BigInt.js" type="text/javascript"></script>
<script src="presenter/Clipperz/Crypto/SHA.js" type="text/javascript"></script>
<script src="presenter/Clipperz/Crypto/AES.js" type="text/javascript"></script>
<script src="presenter/Clipperz/Crypto/PRNG.js" type="text/javascript"></script>
<script type="text/javascript" src="presenter/jquery.js"></script>
<script type="text/javascript" src="presenter/bCrypt.js"></script>
<script type="text/javascript" src="presenter/login.js"></script>
<script type="text/javascript" src="presenter/md5.js"></script>

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

<c:url value="/login" var="loginUrl"/>


<form action="${loginUrl}" method="post" role="form">   

	<a href="/Documentation/documentation">Documentation</a><br>
	<a href="plane">Plane simulator</a>    <br>
	<a href="signup">Sign up</a>        <br>
    <c:if test="${param.error != null}">        
        <p>
            Invalid username and password.
        </p>
    </c:if>
    <c:if test="${param.logout != null}">       
        <p>
            You have been logged out.
        </p>
    </c:if>
   <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" name="username"/>	
    </div>
    <p>
        <label for="password">Password</label>
        <input type="password" class="form-control" id="raw_password" name="raw_password"/>	
    </p>
    <input type="text" id="password" hidden="true" name="password"/>	
    <input type="hidden"                        
        name="${_csrf.parameterName}"
        value="${_csrf.token}"/>
    <button type="button" class="btn" id="loginBtn">Log in</button>
</form>