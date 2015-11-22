var parcels = [];
var liked = [];
if(localStorage["liked"] && localStorage["liked"].length != 0)
	liked = JSON.parse(localStorage["liked"]);
counter = 0;
var myLatlng;
var marker;
var map;
	function initMap(myLatlng) {
	  	map = new google.maps.Map(document.getElementById('map'), {
	    center: myLatlng,
	    zoom: 10
	  });
}
$('.apiHits, .totalParcels').html("Fetching...");
$(document).ready(function() {
	$('.rightPane').hide();
	var counter = 0;
	$.ajax({
		url: 'https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel',
		type: 'GET',
		dataType: 'json',
		success : function(data) {
			$.each(data.parcels, function(index, val) {
				 console.log(val.name);
				 var price = "";
				if(val.price.indexOf(",") == -1){
				 	price = formatIndianCurrency(val.price);
				}else{
				 	price = val.price;
				}
				 var obj = {
				    name: val.name,
				    image: val.image,
				    date: val.date,
				    type: val.type,
				    weight: val.weight,
				    phone: val.phone,
				    price: price,
				    quantity: val.quantity,
				    color: val.color,
				    link: val.link,
				    live_location : {
				    	latitude : val.live_location.latitude,
				    	longitude : val.live_location.longitude
				    }
				}
				parcels.push(obj);
				var holder = '<li class="list-group-item" id="'+ index +'"><p class="pull-left">'+ val.name +'</p><p class="pull-right"><i class="fa fa-inr"></i>' + price +'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p></li>';
				$('ol').append(holder);
			});
			//console.log(parcels);
			$('.totalParcels').html(parcels.length);
		}
	});

	$.ajax({
		url: 'https://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits',
		type: 'GET',
		dataType: 'json',
		success: function (msg) {
			console.log(msg.api_hits);
			$('.apiHits').html(msg.api_hits);
		}
	});
	

	$('ol').on("click", "li.list-group-item", function (argument) {
		var id = $(this).attr('id');
		// if(counter == 0)
		$('.rightPane').fadeIn();
		counter =1;
		myLatlng = new google.maps.LatLng(parcels[id].live_location.latitude,parcels[id].live_location.longitude);
		initMap(myLatlng);
		marker = new google.maps.Marker({
		    position: myLatlng,
		    animation: google.maps.Animation.DROP,
		    title: parcels[id].name
		});
		marker.setMap(map);
		// marker.setPosition(myLatlng);
		$(this).siblings().css({'background-color': 'white'});
		$(this).css({'background-color': '#efefef'});
		$('h2.productName').html(parcels[id].name);
		$('img.productImage').attr("src", parcels[id].image);
		var date = new Date(parcels[id].date*1000);
		$('p.eta').html("<strong>ETA: </strong>" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear());
		console.log(parcels[id].date);
		$('div.list1 > ul').empty();
		$('div.list2 > ul').empty();
		$('div.list1 > ul').append('<li><i class="fa fa-shopping-cart fa-2x"></i><span>' + parcels[id].type + '</span></li>');
		$('div.list1 > ul').append('<li><i class="fa fa-arrow-down fa-2x"></i><span>' + parcels[id].weight + '</span></li>');
		$('div.list1 > ul').append('<li><i class="fa fa-phone fa-2x"></i><span>' + parcels[id].phone + '</span></li>');
		var price = "";
		if(parcels[id].price.indexOf(",") == -1){
		 	price = formatIndianCurrency(parcels[id].price);
		}else{
		 	price = parcels[id].price;
		}
		$('div.list2 > ul').append('<li><i class="fa fa-money fa-2x"></i><span>' + price + '</span></li>');
		$('div.list2 > ul').append('<li><i class="fa fa-cart-plus fa-2x"></i><span>' + parcels[id].quantity + '</span></li>');
		$('div.list2 > ul').append('<li><i class="fa fa-circle fa-2x" style="color:' + parcels[id].color +';" ></i><span>Color</span></li>');
		
		if(liked.indexOf($('h2.productName').html()) == -1)
			$('.like-btn').html('<i class="fa fa-thumbs-o-up"></i>Like');
		else
			$('.like-btn').html('<i class="fa fa-thumbs-up"></i>Liked');
	});

	$('ol').on("hover", "li.list-group-item", function (argument) {
		var id = $(this).attr('id');
		// $(this).siblings().css({'background-color': 'white'});
		$(this).css({'background-color': 'red'});
	});

	$('.like-btn').click(function(event) {
		if($(this).text() == "Like")
			$(this).html('<i class="fa fa-thumbs-up"></i>Liked');
		else
			$(this).html('<i class="fa fa-thumbs-o-up"></i>Like');
		console.log($('h2.productName').html());
		if($.inArray($('h2.productName').html(), liked) == -1)
			liked.push($('h2.productName').html());
		else
			liked.splice(liked.indexOf($('h2.productName').html()), 1);
		
		localStorage["liked"] = JSON.stringify(liked);
	});

	$('button.sort').click(function(event) {
		/* Act on the event */
		console.log($(this).attr('id'));
		$(this).siblings('button').removeClass('btn-success');
		$(this).addClass('btn-success');

		if($(this).attr('id') == "name"){
			parcels.sort(function(a,b){
			  var alc = a.name.toLowerCase(), blc = b.name.toLowerCase();
			  return alc > blc ? 1 : alc < blc ? -1 : 0;
 			});
		}else if($(this).attr('id') == "value"){
			parcels.sort(function(a,b){
			  var alc = a.price, blc = b.price;
			  c = alc.replace(/,/g, '');
			  d = blc.replace(/,/g, '');
			  var c = parseInt(c);
			  var d = parseInt(d);
			  // console.log("c = " + c + "; d = " + d);
			  return c < d ? 1 : c > d ? -1 : 0;
 			});
		}else if($(this).attr('id') == "weight"){
			parcels.sort(function(a,b){
			  var alc = a.weight, blc = b.weight;
			  c = alc.replace(/,/g, '');
			  d = blc.replace(/,/g, '');
			  var c = parseInt(c);
			  var d = parseInt(d);
			  // console.log("c = " + c + "; d = " + d);
			  return c < d ? 1 : c > d ? -1 : 0;
 			});
		}
		$('ol').empty();
		for (var i = 0; i < parcels.length; i++) {
			var holder = '<li class="list-group-item" id="'+ i +'"><p class="pull-left">'+ parcels[i].name +'</p><p class="pull-right"><i class="fa fa-inr"></i>' + parcels[i].price +'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p></li>';
			$('ol').append(holder);
		};

	});

	$('.update-btn').click(function(event) {
		/* Act on the event */
		$.ajax({
			url: 'https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel',
			type: 'GET',
			dataType: 'json',
			success: function(loc_data){
				$.each(loc_data.parcels, function(index, val) {
					 /* iterate through array or object */
					 if(val.name == $('h2.productName').html()){
					 	myLatlng = new google.maps.LatLng(val.live_location.latitude,val.live_location.longitude);
						initMap(myLatlng);
						marker = new google.maps.Marker({
						    position: myLatlng,
						    animation: google.maps.Animation.DROP,
						    title: val.name
						});
						marker.setMap(map);

					 }
				});
			}
		});
	});




	

	function formatIndianCurrency(x){
		x=x.toString();
  		var afterPoint = '';
		if(x.indexOf('.') > 0)
		   afterPoint = x.substring(x.indexOf('.'),x.length);
		x = Math.floor(x);
		x=x.toString();
		var lastThree = x.substring(x.length-3);
		var otherNumbers = x.substring(0,x.length-3);
		if(otherNumbers != '')
		    lastThree = ',' + lastThree;
		var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
		return res;
	}


	
});



	// google.maps.event.addDomListener(window, 'load', initMap);	