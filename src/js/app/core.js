// init vars
var Timer = require('./js/app/model/timer');
var Datastore = require('nedb'),
 	db = new Datastore({ filename: __dirname+'/db/gamecenter_db.db', autoload: true }),
 	moment = require('moment'),
	time = new Date(),
	secondsRemaining = (60 - time.getSeconds()) *1000;


// Load all timers from database 
// Main function
$(document).ready(function(){
	db.find({}, function(err, items){
		items.map(function(item){
			if (moment(item.addedAt).isSame(time, 'day') &&  moment(item.addedAt).isSame(time, 'month')  &&
				moment(item.addedAt).isSame(time, 'year') ){
				if (moment(item.end, 'HH:mm').isAfter(moment(new Date()))){
					$('#list'+item.hallId).append('<button class = "list-group-item" id="item'+item._id+'">'+item.start+'-'+item.end+'</button>');
				}
			}
		});
	});
});


// Create timer modal
$('#addTimeModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); 
	var hall = button.data('hall'); 
	var hallId = button.data('hallid');

	$("#hallName").val(hall);
	$("#hallId").val(hallId);
	
	var now = new Date();

	$('#startTime').datetimepicker({
		minDate: now,
		format: 'HH:mm'
	});
	$('#endTime').datetimepicker({
		minDate: new Date(now.getTime() + 5*60000),
		format: 'HH:mm'
	});
});

// Add timer to database
$("#addBtn").click(function(){
	var id = $('#hallId').val();
	var startTime = $('#startTimeValue').val();
	var endTime = $('#endTimeValue').val(); 
	db.insert(
	{
		hall: $('#hallName').val(),
		hallId: id,
		start: startTime,
		end: endTime,
		addedAt: new Date()
	}, function(error, inserted){
		console.log('inserted successfully: '+inserted);
		$('#list'+id).append('<button class = "list-group-item" id="item'+inserted._id+'">'+startTime+'-'+endTime+'</button>');
		$('#addTimeModal').modal('toggle');
	});
});



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

setTimeout(function(){
	console.log('worked');
	var proccess = setInterval(function(){
		var now = new Date();
		console.log('start');
		timeNow = addZero(now.getHours())+":"+addZero(now.getMinutes());
		
		db.find({end: timeNow }, function(err, items){
			items.map(function(item){
				$('#item'+item._id).remove();
			})
		});

		db.find({ start: {$lte: timeNow}, end: {$gt : timeNow}}, function(err, items){
			items.map(function(item){
				var start = moment(new Date());
				
				if (moment(item.addedAt).isSame(start, 'day') &&  moment(item.addedAt).isSame(start, 'month')  &&
					moment(item.addedAt).isSame(start, 'year') ){
						var end = moment(item.end, 'HH:mm');
						console.log("   ----- ");
						
						var id = item.hallId;
						var itemId = item._id;
						$('#item'+itemId).addClass('list-group-item-success');
						var duration = parseInt((end.diff(start)) /1000);
						console.log('duration: '+duration)

						// if(typeof timer1 === 'object'){
						// 	timerInstance.stop();
						//  }
						var timerInstance = new Timer(duration, "timertable"+id);
						timerInstance.run();
				}
			})
		});

	}, 60000);
}, secondsRemaining);




$("#startBtn").click(function(){
	if(typeof timer1 === 'object'){
		timer1.stop();
	 }
	var duration = parseInt($("#hourField").val()) * 3600 + parseInt($("#minuteField").val()) * 60;
	timer1 = new Timer(duration, "timerTable1");
	timer1.run();
});
