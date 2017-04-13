function renderMatrix(eventsList=null, selectedTime = new Date(), lang='en') {
	var height = 23.5*(60/30);
	var matrixBody = document.getElementById("calendar-container");
	var timeLine = new moment().hour(0).minute(0);
	var currentTime = new moment(selectedTime).locale(lang);
	
	/* prepare days */
	var firstDayOfSelectedWeek = currentTime.startOf('isoweek');
	var daysRow = "";
	for (i=0; i<=6; i++) {
		var newDay = new moment(firstDayOfSelectedWeek).add(i, "days");
		daysRow += '<div class="day">'+newDay.format("dddd")+'<br />('+newDay.format('Do MMMM')+')</div>';
	}
	
	/* clear matrix */
	matrixBody.innerHTML = "";
	
	/* print header */
	matrixBody.insertAdjacentHTML('beforeend','<div class="row calendar-title"><div>'+firstDayOfSelectedWeek.format("Do MMMM")+' - '+new moment(firstDayOfSelectedWeek).add(6, "days").format("Do MMMM")+'</div>');
	matrixBody.insertAdjacentHTML('beforeend','<div class="row calendar-header"><div class="time"></div>'+daysRow+'</div>');
	
	/* print rows */
	for (var r=0;r<=height;r++) {
		if (r>0) {
			timeLine.add(30, 'minutes');
		}
		var rowData = '<div class="time">'+timeLine.format("HH:mm")+'</div>';
		/* print columns */
		for(var c = 0; c<=6; c++) {
			var newDay = new moment(firstDayOfSelectedWeek).add(c, 'days').hours(timeLine.hours()).minutes(timeLine.minutes());
			rowData += '<div class="day" id="'+newDay.format("DDMMYYYYHHmm")+'"></div>';				
		}
		matrixBody.insertAdjacentHTML('beforeend','<div class="row calendar-row">'+rowData+'</div>');
	}
	
	/* print today */
	var todayTimestamp = new moment();
	var todayColumns = document.querySelectorAll('div[id^="'+todayTimestamp.format("DDMMYYYY")+'"]');
	for(var k = 0, le = todayColumns.length; k < le; k++) {
		todayColumns[k].className += " today";
	}
	
	/* print events */
	for(var key in eventsList) {
		var event = eventsList[key];
		
		var start = new moment.unix(event.start).utcOffset(0);
		var roundStartMinutes = Math.round((start.minutes()/60)*2)/2;
		var roundedStart = new moment(start).minutes(roundStartMinutes*60).seconds(0);
		
		var end = new moment.unix(event.end).utcOffset(0);
		var roundEndMinutes = Math.round((end.minutes()/60)*2)/2;
		var roundedEnd = new moment(end).minutes(roundEndMinutes*60).seconds(0);
		
		var eventColumns = [];
		var start2 = new moment(roundedStart);
		
		while(start2.valueOf() < roundedEnd.valueOf()){
			eventColumns.push(moment(start2).format('DDMMYYYYHHmm'));
		   	var newDate = start2.add(30, 'minutes');
		   	start2 = new moment(newDate);  
		}
		
		for(m = 0, n = eventColumns.length; m < n; m++) {
			var element = document.getElementById(eventColumns[m]);
			if (element === undefined || element === null) {
				continue;
			}
			var emptyCell = element.innerHTML==="";
			event.width = 100;
			
			var content = (emptyCell ? "" : element.innerHTML)+"<div class='event"+(emptyCell ? "" : "2")+"'>";
			if(m==0) {
				content += event.title;
			}
			else {
				content += '';
			}
			element.innerHTML = content+'</div>';
		}
	}
}

function xmlOpen(url) {
	var dataToReturn = "Error";
	$.ajax({
	    url: 'xml/'+url,
	    type: "GET",
	    dataType: "xml",
		async: false,
	    success: function(xml) {
	    	dataToReturn = xml2array(xml);
	    },
	    error: function(data) {
	        console.log(data);
	        alert("Unable to load XML file! See the log.");
	    }
	});
	return dataToReturn;
}