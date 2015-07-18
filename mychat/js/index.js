var Ref0 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room0/Message');
var Ref1 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room1/Message');
var Ref2 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room2/Message');
var userRef0 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room0/User');
var userRef1 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room1/User');
var userRef2 = new Firebase('https://ywfkhut8ix5.firebaseio-demo.com/room/room2/User');
var currentUser="";
var currentRoom=0;//默认初始房间为room0
var userArray0=[],userArray1=[],userArray2=[];
var userArrays = [userArray0,userArray1,userArray2];
var Refs = [Ref0,Ref1,Ref2];
var userRefs = [userRef0,userRef1,userRef2];
var Ref = Refs[0];
var userRef = userRefs[0];
window.onload=function(){
	$($("#Room_list").children()[0]).css('backgroundColor','white');//设置room0为初始房间
	
	var messageField = $('#messageInput');
	var messageList = $('#messages');
	
	// 监听消息输入事件
	messageField.keydown(function (e){
    if (e.keyCode == 13) {
	if(currentUser==="")//判断是否为已登录状态
		alert("您还未登录，请先登录！");
	else
	{
		var message = messageField.val();
		Ref.push({name:currentUser,text:message,messagetype:"text"});
	}
    messageField.val('');
    }
	});
	
	//初始化消息栏
	show_message();
	
	//初始化用户栏
	show_users();
}

//用户注册
function userSignup(){
	var nameField = $('#userInput');
	var userList = $('#User_list');
	var username = nameField.val();
	for(var i=0;i<userArrays[currentRoom].length;i++)
	{
		if(userArrays[currentRoom][i].name===username)//注册重名
		{
			alert("该用户已存在！");
			return;
		}
	}
	userRef.push({name:username});
	nameField.val("");
}

//用户登录
function userSignin(){
	var nameField = $('#userInput');
	var username = nameField.val();
	for(var i=0;i<userArrays[currentRoom].length;i++)
	{
		if(userArrays[currentRoom][i].name===username)//输入合法
		{
			currentUser = username;
			alert('登陆成功！');
			nameField.val("");
			var li = $("strong");
			for(var j=0;j<li.length;j++)
			{
				if(li[j].innerHTML===currentUser)
					li[j].style.color = "blue";
				else
					li[j].style.color = "black";
			}
			break;
		}
	}
	if(i===userArrays[currentRoom].length)//输入非法
	{
		alert('该用户不存在，请重新输入！');
		nameField.val("");
	}
}

//初始化并更新消息栏信息
function show_message()
{
	var messageList = $('#messages');
	Ref.limitToLast(15).on('child_added', function (snapshot) {
    //GET DATA
    var data = snapshot.val();
	var user = data.name;
	var messages = data.text;
	var type = data.messagetype;
    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var messageElement;
	if(currentUser!="")//用户消息处理
	{
		messageElement= $("<li align='right'></li>");
		var nameElement = $("<strong class='chat-username'></strong>");
		nameElement.text("    ");
		if(type==="text")//文本消息
			messageElement.text(messages).append(nameElement);
		else//表情消息
		{
			var imgElements = document.createElement('img');
			imgElements.src = messages; // 设置图片地址
			var imgElement = $(imgElements);
			messageElement.append(imgElement);
			//alert(1);
			messageElement.append(nameElement);
		}
	}
	else//他人消息处理
	{
		messageElement= $("<li>");
		var nameElement = $("<strong class='chat-username'></strong>");
		nameElement.text(user+"  ");
		if(type==="text")//文本消息
			messageElement.text(messages).prepend(nameElement);
		else//表情消息
		{			
			var imgElements = document.createElement('img');
			imgElements.src = messages; // 设置图片地址
			var imgElement = $(imgElements);
			messageElement.append(nameElement);
			messageElement.append(imgElement);
		}
	}
    //添加消息至消息栏
    messageList.append(messageElement);
    messageList[0].scrollTop = messageList[0].scrollHeight;
  }); 
}

//初始化并更新用户栏信息
function show_users()
{
	var userList = $('#User_list');
	userRef.limitToLast(15).on('child_added',function (snapshot) {
    //获取信息
	var userList = $('#User_list');
    var data = snapshot.val();
	var text = data.name || "anonymous";
    userArrays[currentRoom].push({name:text});
	var messageElement = $("<li>");
	var nameElement = $("<strong class='chat-username' style='color:black'></strong>");
    nameElement.text(text);
    messageElement.prepend(nameElement);
    //添加用户至用户栏
    userList.append(messageElement);
    userList[0].scrollTop = userList[0].scrollHeight;
  });  
}

//发送表情
function show_expression()
{
	if(currentUser==="")
		alert("您还未登录，请先登录！");
	else
	{
		Ref.push({name:currentUser,text:"images/"+arguments[0]+".jpg",messagetype:"image"});
	}
}

//选择聊天房间
function choose_room()
{
	$($("#Room_list").children()[currentRoom]).css('backgroundColor','#dfe3ea');
	currentRoom = arguments[0];
	$($("#Room_list").children()[currentRoom]).css('backgroundColor','white');//将聊天房间北京设为白色
	Ref = Refs[arguments[0]];
	userRef = userRefs[arguments[0]];
	currentUser = "";
	$('#User_list').empty();
	$('#messages').empty();
	show_message();
	show_users();
}
