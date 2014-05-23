window.onload=function(){
		drawChart(0);
		drawChart(1);
};
var smoothie=[];
function drawChart(i){
	smoothie[i]= new SmoothieChart(  {
				grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
						lineWidth: 1, millisPerLine: 250, verticalSections: 6 },
				labels: { fillStyle:'rgb(60, 0, 0)' }
	});
	;
	smoothie[i].options.interpolation='linear';
	smoothie[i].streamTo(document.getElementById("mycanvas"+i));
	
	// Data
	var line1 = new TimeSeries();
	var line2 = new TimeSeries();

	setInterval(function() {
	  if(stopAnimation==true)
		  return;
	  var currTime=new Date().getTime();
	  if(i==1){
		  line1.append(currTime, plane.vel.x);
	  	  line2.append(currTime, plane.vel.y);
	  }else{
		  line1.append(currTime, plane.accel.x);
	  	  line2.append(currTime, plane.accel.y);
	  }
	}, 1000);

	// Add to SmoothieChart
	smoothie[i].addTimeSeries(line1, { strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:3 });
	smoothie[i].addTimeSeries(line2, { strokeStyle:'rgb(255, 0, 255)', fillStyle:'rgba(255, 0, 255, 0.3)', lineWidth:3 });
	smoothie[i].stop();
}