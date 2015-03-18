$(".add-btn-hotels").click(function(e) {
	var selected = $("#select-hotel option:selected").text();

	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	console.log(selected, result);
	$("#hotels").append(result);

});

$(".add-btn-restaurants").click(function(e) {
	var selected = $("#select-restaurant option:selected").text();
	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	$("#restaurants").append(result);

});

$(".add-btn-things").click(function(e) {
	var selected = $("#select-thing option:selected").text();
	var result = '<div class="itinerary-item"><span class="title">' + selected + '</span><span class="remove"><button class="btn btn-danger btn-xs btn-circle pull-right btn-remove">x</button></span></div>';
	console.log($("#things").append(result));
});

$("#things, #hotels, #restaurants").on('click', '.btn-remove', function(e) {
	$(this).closest(".itinerary-item").remove();
});



$("#add-day").on('click', function(e) {
	var amount = $(this).siblings().length + 1;
	$(this).before('<a class="btn btn-circle day-btn" role="presentation" href="day-'+ amount +'" role="tab" data-toggle="pill">' + amount + '</a>');

	$("#days").append('
		<div role="tabpanel" class="tab-pane" id="day-' + amount +'">
			<div>
				<h4>My Hotels</h4>
				<ul class="list-group" id="hotels">
					
				</ul>
			</div>
			<div>
				<h4>My Restaurants</h4>
				<ul class="list-group" id="restaurants">
					
				</ul>
			</div>
			<div>
				<h4>My Things To Do</h4>
				<ul class="list-group" id="things">
					
				</ul>
			</div>
		</div>');
});

$('.day-buttons a').click(function (e) {
	e.preventDefault();
 	$(this).tab('show');
});

