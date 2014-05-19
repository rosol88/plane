
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
<c:url value="/login" var="loginUrl"/>
<form action="${loginUrl}" method="post">       
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
    <p>
        <label for="username">Username</label>
        <input type="text" id="username" name="username"/>	
    </p>
    <p>
        <label for="password">Password</label>
        <input type="password" id="raw_password" name="raw_password"/>	
    </p>
    <input type="text" id="password" name="password"/>	
    <input type="hidden"                        
        name="${_csrf.parameterName}"
        value="${_csrf.token}"/>
    <button type="button" class="btn" id="loginBtn">Log in</button>
</form>