var itinerarySelections = [];
var currDay = 1;
itinerarySelections[currDay] = {
	hotels: [],
	restaurants: [],
	things: []
};
var markers = [];
var bounds = new google.maps.LatLngBounds();

$(".add-btn-hotels").click(function(e) {
	var selected = $("#select-hotel option:selected").text();
	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove hotel-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	$(".curr-hotels").append(result);
	addSelection(currDay, "hotels", selected);

	mapAndDraw("hotels", selected);
});

$(".add-btn-restaurants").click(function(e) {
	var selected = $("#select-restaurant option:selected").text();
	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove restaurant-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	$(".curr-restaurants").append(result);
	addSelection(currDay, "restaurants", selected);

	mapAndDraw("restaurants", selected);
});

$(".add-btn-things").click(function(e) {
	var selected = $("#select-thing option:selected").text();
	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove thing-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	$(".curr-things").append(result);
	addSelection(currDay, "things", selected);

	mapAndDraw("things", selected);
});

$(".curr-hotels, .curr-restaurants, .curr-things").on('click', '.btn-remove', function(e) {
	var selected = $(this).parent().siblings(".title").text();
	
	var parent = $(this).parent();
	var group;
	if (parent.hasClass("hotel-item"))
		group = "hotels";
	else if (parent.hasClass("restaurant-item"))
		group = "restaurants";
	else if (parent.hasClass("thing-item"))
		group = "things";

	$(this).closest(".itinerary-item").remove();
	var index = itinerarySelections[currDay][group].indexOf(selected);
	itinerarySelections[currDay][group].splice(index, 1);

	for (var i = 0, len = markers.length; i < len; i++) {
		if (markers[i].name === selected) {
			markers[i].setMap(null);
			markers.splice(i,1);
			break;
		}
	}

});

$(".day-buttons").on('click', '.day-instance', function(e) {

	currDay = parseInt($(this).text());
	$(".day-btn").removeClass("current-day");
	$(this).addClass("current-day");

	switchPanel();
	switchIcons();

});

$("#add-day").on('click', function(e) {
	var amount = $(this).siblings().length + 1;
	$(".day-btn").removeClass("current-day");
	$(this).before('<button class="btn btn-circle day-btn day-instance current-day">' + amount + '</button>');
	currDay = amount;
	
	itinerarySelections[currDay] = {
		hotels: [],
		restaurants: [],
		things: []
	};

	switchPanel();
	switchIcons();

	$("#remove-day").removeAttr('disabled');
	// $("#days .active").removeClass("active");
	// $("#days").append('<div role="tabpanel" class="tab-pane active" id="day-' + amount +'"><div><h4>My Hotels</h4><ul class="list-group" id="hotels"></ul></div><div><h4>My Restaurants</h4><ul class="list-group" id="restaurants"></ul></div><div><h4>My Things To Do</h4><ul class="list-group" id="things"></ul></div></div>');
});

$("#day-title").on('click', '#remove-day', function() {
	var day = parseInt($(this).prev().text().match(/\d+/));

	itinerarySelections.splice(day,1);

	$(".day-buttons").children(".day-instance").remove();

	itinerarySelections.forEach(function(elem, i) {
		$("#add-day").before('<button class="btn btn-circle day-btn day-instance">' + i + '</button>');
	});

	currDay = itinerarySelections.length - 1;
	$(".day-buttons").children(".day-instance:last").addClass("current-day");

	if ($(".day-buttons").children(".day-instance").length === 1)
		$("#remove-day").attr('disabled','disabled');

	switchPanel();
	switchIcons();
	
});

function addSelection(currDay, option, selected) {
	if (itinerarySelections[currDay] === undefined) {
		itinerarySelections[currDay] = {
			hotels: [],
			restaurants: [],
			things: []
		};
	}

	itinerarySelections[currDay][option].push(selected);
}

function switchPanel() {
	$(".panel-body").find(".itinerary-item").remove();

	itinerarySelections[currDay].hotels.forEach(function(element) {
		var result = '<div class="itinerary-item"><span class="title">' + element + '</span><span class="remove hotel-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
		$(".curr-hotels").append(result);
	});

	itinerarySelections[currDay].restaurants.forEach(function(element) {
		var result = '<div class="itinerary-item"><span class="title">' + element + '</span><span class="remove restaurant-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
		$(".curr-restaurants").append(result);
	});

	itinerarySelections[currDay].things.forEach(function(element) {
		var result = '<div class="itinerary-item"><span class="title">' + element + '</span><span class="remove thing-item"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
		$(".curr-things").append(result);
	});

	$("#day-title span").text("Day " + currDay);
}

function switchIcons() {

	for (var i = markers.length - 1; i >= 0; i--) {
		markers[i].setMap(null);
		markers.pop();
	}

	itinerarySelections[currDay].hotels.forEach(function(elem) {
		mapAndDraw("hotels", elem);
	});

	itinerarySelections[currDay].restaurants.forEach(function(elem) {
		mapAndDraw("restaurants", elem);
	});

	itinerarySelections[currDay].things.forEach(function(elem) {
		mapAndDraw("things", elem);
	});
}

function drawLocation (location, opts) {

    if (typeof opts !== 'object') {
        opts = {}
    }

    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    var marker = new google.maps.Marker(opts);
    markers.push(marker);
    bounds.extend(marker.position);
    map.fitBounds(bounds);

    var zoom = map.getZoom();
    map.setZoom(zoom > 17 ? 17 : zoom);

}

function mapAndDraw(arrayType, selected) {

	var collection, icon;

	if (arrayType === "hotels"){
		collection = all_hotels;
		icon = '/images/lodging_0star.png';
	} else if (arrayType === "restaurants") {
		collection = all_restaurants;
		icon = '/images/restaurant.png';
	} else if (arrayType === "things") {
		collection = all_things_to_do;
		icon = '/images/star-3.png';
	}

	for (var i = 0, len = collection.length; i < len; i++) {
		if (collection[i].name === selected) {
			drawLocation(collection[i]['place'][0]['location'], {
		        icon: icon,
            	name: collection[i].name,
            	day: currDay
		    });

		    break;
		}
	}
}
