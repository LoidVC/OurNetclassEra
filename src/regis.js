var regis_app = new Vue({
	el: '#regis_app',
	data: {
		is_username_error: false,
		username_error: '',
		username_input: '',
		is_password_error: false,
		password_error: '',
		password_input: '',
		is_email_error: false,
		email_input: '',
		is_code_error: false,
		code_input: '',
		code_message: '',
		re_check_email: /.+@qq\.com/,	
		ok: false
	},
	methods: {
		clear_username_error: function(event) {
			this.is_username_error = false;
		},
		clear_password_error: function(event) {
			this.is_password_error = false;
		},
		clear_email_error: function(event) {
			this.is_email_error = false;
		},
		clear_code_error: function(event) {
			this.is_code_error = false;
		},
		send_email: function(event) {
			if(!this.re_check_email.test(this.email_input))
				this.is_email_error = true;
			else {
				$.ajax({
					async: false,
					type: 'post',
					url: '/server/sendmail.php',
					data: {
						'address': this.email_input
					},
					success: function(res) {
						if(res['code'] == 0)
							mdui.alert('邮件已发送！', '提示');
						else mdui.alert(res['msg'], '出错！');
					}
				});
				this.code_message = '请输入收到的验证码';
			}
		},
		check_username: function(username) {
			for(var i = 0; i != username.length; ++ i) {
				var ok = false;
				if('a' <= username[i] && username[i] <= 'z')
					ok = true;
				if('A' <= username[i] && username[i] <= 'Z')
					ok = true;
				if('0' <= username[i] && username[i] <= '9')
					ok = true;
				if(username[i] == '_') ok = true;
				if(!ok) return false;
			} return true;
		},
		check: function(event) {
			this.ok = true;
			if(this.username_input.length < 4) {
				this.username_error = '用户名长度不能小于 4 位';
				this.is_username_error = true;
				this.ok = false;
			} else if(this.username_input.length > 15) {
				this.username_error = '用户名长度不能大于 15 位';
				this.is_username_error = true;
				this.ok = false;
			} else if(!this.check_username(this.username_input)) {
				this.username_error = '用户名包含非法字符';
				this.is_username_error = true;
				this.ok = false;
			} if(this.password_input.length < 6) {
				this.password_error = '密码长度不能小于 6 位';
				this.is_password_error = true;
				this.ok = false;
			} else if(this.password_input.length > 20) {
				this.password_error = '密码长度不能大于 20 位';
				this.is_password_error = true;
				this.ok = false;
			} if(this.code_input == '') {
				this.is_code_error = true;
				this.ok = false;
			} if(this.ok) {
				$.ajax({
					type: 'post',
					url: '/server/regis.php',
					data: {
						'userid': this.username_input,
						'password': this.password_input,
						'email': this.email_input,
						'code': this.code_input
					},
					success: function(res) {
						if(res['code'] == 0) {
							mdui.alert('账号注册成功！\n三秒后跳转至登录页面。', '成功！');
							setTimeout(function() {
								location = '/login.html';
							}, 3000);
						} else mdui.alert(res['msg'], '出错！');
					}
				});
			}
		}
	}
});