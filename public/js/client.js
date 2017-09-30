
var userCollection = new Array();
var activeUsersPage = 1;
var pageSize = 10;

function editUserProfile(){	
	$("#userProfileForm").removeAttr('disabled');
	$("#EditUserSaveButton").removeAttr('disabled');
	$("#EditButtons").show();
	$("#NoEditButtons").hide();
	
}

function login(){	
	$('#loginModal').modal('show');
	$('#loginErrorAlert').hide();
	return false;
}

function forgot(){	
	$('#loginModal').modal("hide");
    $('#forgotErrorAlert').hide();
    $('.form-group').removeClass('has-success').removeClass('has-error'); //clean previous variation messages
	$('#forgotModal').modal('show');
	return false;
}

function cancelEditUserProfile()
{	
	$("#userProfileForm").attr('disabled',' ' );
	$("#NoEditButtons").show();
	$("#EditButtons").hide();
}

$(document).ready(function(){ 
	
	$("#EditButtons").hide();
	
	$("#loginForm").validate({
		rules: {
			password: {
				required: true
			},
			username: {
				required: true
			}
		},
		messages: {
			password: {
				required: "Please provide a password"
			},
			username: {
				required: "Please provide an username"
			}
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/login",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					var contents = new EJS({url: 'templates/message.ejs'}).render(res);
					if (res.result == 'error'){
						$('#loginErrorAlert').show();
						$("#loginButton").removeAttr('disabled');
					}else{		
						$('#modalMessageBody').html(contents);
						$('#loginModal').modal('hide');
						$('#messageModal').modal('show');
						$("#loginButton").removeAttr('disabled');
						//window.location.replace("/");
						location.reload();
					}
				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#loginButton').attr('disabled','disabled');
			$('#loginErrorAlert').hide();
			//form.reset();
			return false;
		},
		
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});
	
	$("#editUserForm").validate({
	rules: {
			username: {
				required: true,
				minlength: 2
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			username: {
				required: "Please enter a username",
				minlength: jQuery.format("Your username must be at least {0} characters long")
			},
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
		
			$.ajax({
				type: "POST",
                url: "/changeUser",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					var contents = new EJS({url: 'templates/message.ejs'}).render(res);
					$('#modalMessageBody').html(contents);
					$('#messageModal').modal('show');
					$("#EditUserSaveButton").removeAttr('disabled');
				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#EditUserSaveButton').attr('disabled','disabled');
			cancelEditUserProfile();
			form.reset();
			return false;
		},
		
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});
	
	$("#changePasswordForm").validate({
	rules: {
			password: {
				required: true,
				minlength: 5
			},
			confirm_password: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			}
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long")
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long"),
				equalTo: "Please enter the same password as above"
			}
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/changePassword",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					var contents = new EJS({url: 'templates/message.ejs'}).render(res);
					$('#modalMessageBody').html(contents);
					$('#changePasswordModal').modal('hide');
					$('#messageModal').modal('show');
					$("#ChangePasswordSaveButton").removeAttr('disabled');
				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#ChangePasswordSaveButton').attr('disabled','disabled');
			form.reset();
			return false;
		},
		
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});

    //reset password - new pass form
    $("#resetPasswordForm").validate({
	rules: {
			password: {
				required: true,
				minlength: 5
			},
			confirm_password: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			}
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long")
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long"),
				equalTo: "Please enter the same password as above"
			}
		},/*
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/resetPassword", //FALTA o TOKEN
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					var contents = new EJS({url: 'templates/message.ejs'}).render(res);
					$('#modalMessageBody').html(contents);
					$('#changePasswordModal').modal('hide');
					$('#messageModal').modal('show');
					$("#ChangePasswordSaveButton").removeAttr('disabled');
				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#ChangePasswordSaveButton').attr('disabled','disabled');
			form.reset();
			return false;
		},*/
		
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});

    
    
    $("#signupForm").validate({
		rules: {
			username: {
				required: true,
				minlength: 2
			},
			password: {
				required: true,
				minlength: 5
			},
			confirm_password: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			},
			email: {
				required: true,
				email: true
			}, 
			image: {
				required: false,
				accept: "image/*",
				extension: "png|jpe?g"
			}
		},
		messages: {
			username: {
				required: "Please enter a username",
				minlength: jQuery.format("Your username must be at least {0} characters long")
			},
			password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long")
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: jQuery.format("Your password must be at least {0} characters long"),
				equalTo: "Please enter the same password as above"
			},
			image: {
				accept: jQuery.format("Your file must be an image"),
				extension: jQuery.format("Your file must be a jpeg or png")
			},
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/signup",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					$("#userRegisterButton").removeAttr('disabled');
					
					if (res.result == 'error'){
						var contents = new EJS({url: 'templates/message.ejs'}).render(res);
						$('#modalMessageBody').html(contents);
						$('#messageModal').modal('show');
					}else{		
						$("#userRegisterButton").removeAttr('disabled');
						window.location.replace("/");
						//location.reload();
					}

				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#userRegisterButton').attr('disabled','disabled');
			form.reset();
		},
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});
    
    //Validade forgot password form input 
	$("#forgotForm").validate({
		rules: {		
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
                url: "/forgot",
				data: $(form).serialize(),
				success: function(res){
					console.log("res=",JSON.stringify(res));
					$("forgotButton").removeAttr('disabled');
					
					if (res.result == 'error'){
						var contents = new EJS({url: 'templates/message.ejs'}).render(res);
						$('#modalMessageBody').html(contents);
						$('#messageModal').modal('show');
					}else{		
						$('#forgotModal').modal('hide');
                        var contents = new EJS({url: 'templates/message.ejs'}).render(res);
						$('#modalMessageBody').html(contents);
						$('#messageModal').modal('show');
                        form.reset();
					}

				}
			});
			
			$('.form-group').removeClass('has-success').removeClass('has-error');
			$('#forgotButton').attr('disabled','disabled');
			form.reset();
		},
		 highlight: function(element) {
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
		},
		success: function(element) {
			element.addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
		}
	});
});


function admin(){			
	$.ajax({
		url: '/api/userList',
		type: 'GET',
		success: function(userList){
			userCollection = userList;
			console.log("Users Lidos="+userList.length);
			console.log("userList=",JSON.stringify(userList));
			
			//Setup Pagination
			var totalNumberOfPages = Math.ceil(userCollection.length/pageSize);
			
			console.log("NumberOfPages="+totalNumberOfPages);
	
			//Show first page
			endPage = pageSize;
			if(endPage > userCollection.length) endPage=userCollection.length;
			pageItems = userCollection.slice(0,endPage);
			
			var contents = new EJS({url: 'templates/userAdmin.ejs'}).render({title : "Lista de users" });
			$('#mainBody').html(contents);
			contents = new EJS({url: 'templates/usersTable.ejs'}).render({ users : pageItems });
			$('#userlist-table').html(contents);
			
			$('#userlist-pagination').bootpag({
				total: totalNumberOfPages,
				page: 1,
				maxVisible: 6
			}).on('page', function(event, num){
				activeUsersPage = num;
				startPage = (num-1)*pageSize;
				endPage = startPage+pageSize;
				if(endPage > userCollection.length) endPage=userCollection.length;
				pageItems = userCollection.slice(startPage,endPage);
		
				var contents = new EJS({url: 'templates/usersTable.ejs'}).render({ users : pageItems });
				$('#userlist-table').html(contents);
				console.log("Pagina="+ num +" inicio"+startPage+ "fim="+endPage);
			});
			
			
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("Error:"+xhr.status);
			if(xhr.status == 403){ 
				//window.location.replace("/login");
				login();	
			}else{
				var contents = new EJS({url: 'templates/error.ejs'}).render({error : xhr.status });
				$('#mainBody').html(contents);
			}
			
		}
	});
	
	
}

function findUser(userId){
    return $.grep(users, function(n, i){
      return n.username == userId;
    });
};


 function refreshUsersList() {
	
	startOfPage = (activeUsersPage-1)*pageSize;
	endOfPage = startOfPage+pageSize;
	if(endOfPage > userCollection.length) endOfPage=userCollection.length;
	console.log("start="+startOfPage +"end="+endOfPage);
	
	pageItems = userCollection.slice(startOfPage,endOfPage);
	var contents = new EJS({url: 'templates/usersTable.ejs'}).render({users : pageItems });
	$('#userlist-table').html(contents);
	
	//$(".sort-button").removeClass("btn-primary");
 }
 
 function confirmRemoveUser(anUser) {
	console.log("confirm removal of user="+anUser);
	var contents = new EJS({url: 'templates/removeUserModal.ejs'}).render({username : anUser });
	$('#removeUser-modal-template').html(contents);
	$('#removeUserModal').modal();

 }
 
  function confirmCancelUser() {

	var contents = new EJS({url: 'templates/cancelUserModal.ejs'}).render();
	$('#modal-template').html(contents);
	$('#cancelUserModal').modal();

 }
 
  function removeUser(anUser) {
  
  destUrl = '/user/delete/'+anUser;
  console.log("remove user="+ destUrl);
  
  $.ajax({
		url: destUrl,
		type: 'GET',
		success: function(userList){
			userCollection = userList;
			console.log("Users Lidos="+userList.length);
			console.log("userList=",JSON.stringify(userList));
			
			//Setup Pagination
			var totalNumberOfPages = Math.ceil(userCollection.length/pageSize);
			console.log("NumberOfPages="+totalNumberOfPages);
	
			//Show first page
			startOfPage = (activeUsersPage-1)*pageSize;
			endPage = pageSize;
			if(endPage > userCollection.length) endPage=userCollection.length;
			pageItems = userCollection.slice(startOfPage,endPage);
			
			contents = new EJS({url: 'templates/usersTable.ejs'}).render({ users : pageItems });
			$('#userlist-table').html(contents);
			
			$('#userlist-pagination').bootpag({
				total: totalNumberOfPages,
				page: 1,
				maxVisible: 6
			}).on('page', function(event, num){
				activeUsersPage = num;
				startPage = (num-1)*pageSize;
				endPage = startPage+pageSize;
				if(endPage > userCollection.length) endPage=userCollection.length;
				pageItems = userCollection.slice(startPage,endPage);
		
				var contents = new EJS({url: 'templates/usersTable.ejs'}).render({ users : pageItems });
				$('#userlist-table').html(contents);
				console.log("Pagina="+ num +" inicio"+startPage+ "fim="+endPage);
			});
			
			
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("Error:"+xhr.status);
			if(xhr.status == 403){ 
				window.location.replace("/login");
			}else{
				var contents = new EJS({url: 'templates/error.ejs'}).render({error : xhr.status });
				$('#mainBody').html(contents);
			}
			
		}
	});
  }
  
  
function cancelUser() {
  

  console.log("cancel user account");
  
  $.ajax({
		url: '/user/cancel',
		type: 'GET',
		success: function(res){
			var contents = new EJS({url: 'templates/message.ejs'}).render(res);
			$('#modalMessageBody').html(contents);
			$('#messageModal').modal('show');
			$("#cancelUserButton").removeAttr('disabled')	
			window.location.replace("/logout");			
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("Error:"+xhr.status);
			var contents = new EJS({url: 'templates/message.ejs'}).render({ result: 'error', message: xhr.status });
			$('#modalMessageBody').html(contents);
			$('#messageModal').modal('show');
			$("#cancelUserButton").removeAttr('disabled')
		}
	});
	
	$('#cancelUserButton').attr('disabled','disabled');
  }
 
 function sortCollection(collection, prop, asc) {
    collection = collection.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });  
	return(collection);
}
