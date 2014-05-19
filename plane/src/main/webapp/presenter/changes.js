var historyManager=new CfgHistory();
$( window ).load(function() {
	
	//$('#myModal').modal();
	$('#cfgSave').on('click',function(){
		var inputs=$('.modal-body input');
		var cfg={};
		for(var i=0;i<inputs.length;i++){
			cfg[inputs[i].id]=inputs[i].value;
		}
		cfg.date=new Date();
		historyManager.add(cfg);
		initPlaneParameters(cfg);
		$('#myModal').modal('hide');
		startAnimation();
	});
	$('#startBtn').on('click',function(){
		startAnimation();
	});
	$('#stopBtn').on('click',function(){
		stopAnim();
	});
	$('#historyCmb').on('focus',function(){
		historyManager.loadCombo($('#historyCmb'));
	});
	$('#allHistoryCmb').on('focus',function(){
		historyManager.loadAll($('#allHistoryCmb'));
	});
	$('#allHistoryCmb').on('change',onCfgSelect);
});
function onCfgSelect(e){
	var data=$(e.target).find(':selected').data('json');
	for(var i in data){
		if(data.hasOwnProperty(i)){
			var el=$(e.target).parents('.modal-body').find('#'+i);
			if(!$.isEmptyObject(el)){
				el.val(data[i]);
			}
		}
	}
};
var cameraTranslation={
	x:0.0,
	y:0.0,
	z:0.0
};
defaultView();
function translateCamera(camera){
	camera.position.set(plane.pos.x - cameraTranslation.x, plane.pos.y +cameraTranslation.y, plane.pos.z+cameraTranslation.z);
};
function sateliteView(){
	cameraTranslation={
			x:0.0,
			y:+5000.0,
			z:0.0
		};
}
function defaultView(){
	cameraTranslation={
		x:-4000.0,
		y:-200.0,
		z:0.0
	};
}

function initPlaneParameters(cfg){
	if(!$.isEmptyObject(cfg.velX)){
		plane.vel.x=parseFloat(cfg.velX);
	}
}
function initPlanPosition(pos){
	
}
var stopAnimation=true;
function stopAnim(){
	stopAnimation=true;
	smoothie.stop();
}
function startAnimation(){
	stopAnimation=false;
	smoothie.start();
}