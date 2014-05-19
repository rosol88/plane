window.onload=function(){
	$('#loginBtn').on('click', function() {
		var pass=$('#raw_password').val();
		var md5=CryptoJS.MD5(pass);
		$('#password').val(md5);
		$('#raw_password').val('');
	    $('form').submit();
	});
};
