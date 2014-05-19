window.onload=function(){
		drawChart();
};
var smoothie=null;
function drawChart(i){
	smoothie= new SmoothieChart(  {
				grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
						lineWidth: 1, millisPerLine: 250, verticalSections: 6 },
				labels: { fillStyle:'rgb(60, 0, 0)' }
	});
	;
	smoothie.options.interpolation='linear';
	console.log(smoothie.options);
	smoothie.streamTo(document.getElementById("mycanvas"));
	
	// Data
	var line1 = new TimeSeries();
	var line2 = new TimeSeries();

	setInterval(function() {
	  if(stopAnimation==true)
		  return;
	  var currTime=new Date().getTime();
	  line1.append(currTime, plane.vel.x);
	  line2.append(currTime, plane.vel.y);
	}, 1000);

	// Add to SmoothieChart
	smoothie.addTimeSeries(line1, { strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:3 });
	smoothie.addTimeSeries(line2, { strokeStyle:'rgb(255, 0, 255)', fillStyle:'rgba(255, 0, 255, 0.3)', lineWidth:3 });
	smoothie.stop();
}