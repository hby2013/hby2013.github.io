var loadnumbles = 1;
var commenttype;
var j;
var count;
var random_numble = 0;
var longitude=0,latitude=0; //用户所在经纬度 
function addphoto()//添加图片
{
	var helloWorld = document.getElementById('picture_type');
	var distangce = document.getElementById('dis');
	var url = "json/"+arguments[0]+".js";
	var comment_url;
	var bottom_div = document.getElementById("list"); 
	var oWin = document.getElementById("win"); 
	var oLay = document.getElementById("overlay"); 
	var commentpage1 = document.getElementById("commentpage1");
	var commentpage2 = document.getElementById("commentpage2");
	bottom_div.style.display = "none"; 
    $.getJSON(url,function(data)//加载图片
	{
		if(loadnumbles===3)
			return;
		$.each(data["image"], function(k, field)
		{
			var i = document.createElement('img');
			//alert(field["url"]);
			i.src = "images/"+field["url"];
			i.setAttribute('width','400px');
			i.setAttribute('height','250px');
			i.onclick = function(evt)//点击图片事件
			{
				var C = Math.sin(latitude*Math.PI/180)*Math.sin(field["latitude"]*Math.PI/180)*Math.cos((latitude-field["longitude"])*Math.PI/180) + Math.cos(latitude*Math.PI/180)*Math.cos(field["latitude"]*Math.PI/180);
				var diss = 6400*Math.acos(C);
				var dis = parseInt(diss);//用户与图片距离
				//alert(dis);
				var d = document.createElement('h3');
				d.innerHTML = "距离用户："+dis+"千米";
				distangce.appendChild(d);
				var cc = 0;
				var stay_time;
				var Meg = document.getElementById("originalPhoto"); 
				count = 0;
				Meg.src = i.src;
				Meg.setAttribute('width','800px');
				Meg.setAttribute('height','500px');
				Meg.style.margin = "0px 0px 0px 0px";
				oLay.style.display = "block"; 
				oWin.style.display = "block";
				distangce.style.display = "block";
				for(jj=1;jj<3;jj++)//评论页数迭代
				{
					commenttype = random_numble % 3 + 1;
					var comment_url = ("comments/"+commenttype)+(jj+".js");
					$.getJSON(comment_url,function(data)//加载评论
					{
						var n = 0;
						for(var mem in data){
                                n++;
                        }
						for(var tt=1;tt<=n;tt++)
						{
							var com = document.createElement('h6');
							com.innerHTML = data["comment"+tt];
							if(count<=3)
							{
								commentpage1.appendChild(com);
							}
							else
							{
								commentpage2.appendChild(com);
							}
							count++;
						}
						if(count<=4)//第一页评论
						{
							commentpage1.style.display = "block";
							var next = document.createElement('button');
							next.innerHTML = "下一页";
							commentpage1.appendChild(next);
							next.onclick = function(evt)
							{
								var bottom_div1 = document.getElementById("list1"); 
								if(cc===0)
								{
									cc++;
									stay_time = 1000;
									bottom_div1.style.display = "block"; 
								}
								else
									stay_time = 0;
								setTimeout(function() {commentpage1.style.display = "none";
								commentpage2.style.display = "block";bottom_div1.style.display = "none";}, stay_time);
							}
							count = 5;
						}
						else//第二页评论
						{
							var next = document.createElement('button');
							next.innerHTML = "上一页";
							commentpage2.appendChild(next);
							next.onclick = function(evt)
							{
								commentpage2.style.display = "none";
								commentpage1.style.display = "block";							
								var bottom_div1 = document.getElementById("list1"); 
								bottom_div1.style.display = "none"; 
							}
						}
					});
				}
				random_numble++;
			}
			helloWorld.appendChild(i);
		});
		loadnumbles++;
    });
};

window.onload= function()
{
	var bottom_div = document.getElementById("list"); 
	bottom_div.style.display = "none"; 
	var bottom_div1 = document.getElementById("list1"); 
	bottom_div1.style.display = "none"; 
	//addphoto();
	var oClose = document.getElementById("close"); 
	var oWin = document.getElementById("win"); 
	var oLay = document.getElementById("overlay"); 
	var commentpage1 = document.getElementById("commentpage1");
	var commentpage2 = document.getElementById("commentpage2");
	var distangce = document.getElementById('dis');
	oClose.onclick = function () //大图及评论关闭图标响应
	{ 
		oLay.style.display = "none"; 
		oWin.style.display = "none";
		commentpage1.style.display = "none";
		commentpage2.style.display = "none";
		distangce.style.display = "none";
		var oldh6=document.getElementsByTagName("h6");
		while(oldh6.length > 0)
		{
			if(oldh6[0].parentNode==commentpage1)
				document.getElementById("commentpage1").removeChild(oldh6[0]);
			else
				document.getElementById("commentpage2").removeChild(oldh6[0]);
		}
		var oldbutton = document.getElementsByTagName("button");
		while(oldbutton.length > 0)
		{
			if(oldbutton[0].parentNode==commentpage1)
				document.getElementById("commentpage1").removeChild(oldbutton[0]);
			else
				document.getElementById("commentpage2").removeChild(oldbutton[0]);
		}
		var olddis=document.getElementsByTagName("h3");
		document.getElementById("dis").removeChild(olddis[0]);
	};
	//getLocation();
	addphoto(1);
}

function getLocation()//获得用户地理位置
{
	if (navigator.geolocation)
    {
		navigator.geolocation.getCurrentPosition(showPosition);
    }
	else{x.innerHTML="Geolocation is not supported by this browser.";}
}
  
function showPosition(position)
{
  //经度    
    longitude = position.coords.longitude;
     //纬度
    latitude = position.coords.latitude;
	//alert(longitude);
 }



window.onscroll = function()
{
	
　　var scrollTop = $(this).scrollTop();
　　var scrollHeight = $(document).height();
　　var windowHeight = $(this).height();
　　if(scrollTop + windowHeight == scrollHeight&&loadnumbles<=2)//滚动条到达底部
	{
		var bottom_div = document.getElementById("list"); 
		bottom_div.style.display = "block"; 
　　　　setTimeout("addphoto(2)", 1500);
　　}
};

