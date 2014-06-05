var historyManager=new CfgHistory();
$( window ).load(function() {
	
	$('#myModal').modal();
	$('#cfgSave').on('click',function(){
		
		if(!$( "#cfgFrom" ).valid()){
			return;
		}
		var inputs=$('.modal-body input');
		var cfg={};
		for(var i=0;i<inputs.length;i++){
			cfg[inputs[i].id]=inputs[i].value;
		}
		cfg.date=new Date();
		historyManager.add(cfg);
		//resetSim();
		//initPlaneParameters(cfg);
		$('#myModal').modal('hide');
		startAnimation();
	});
	$('#startBtn').on('click',function(){
		startAnimation();
	});
	$('#stopBtn').on('click',function(){
		stopAnim();
	});
	$('#backViewBtn').on('click',function(){
		backView();
	});
	$('#satelliteViewBtn').on('click',function(){
		satelliteView();
	});
	$('#sideViewBtn').on('click',function(){
		sideView();
	});
	$('#documentationBtn').on('click',function(){
		window.location='/Documentation/documentation';
	});
	$('#historyCmb').on('focus',function(){
		historyManager.loadCombo($('#historyCmb'));
	});
	$('#allHistoryCmb').on('focus',function(){
		historyManager.loadAll($('#allHistoryCmb'));
	});
	$('#logoutBtn').on('click',function(){
		window.location='logout';
	});
	$('#cfgBtn').on('click',function(){
		window.location.reload();
	});
	$('#allHistoryCmb').on('change',onCfgSelect);
	$('#historyCmb').on('change',onCfgSelect);
		
//	$( "#cfgFrom" ).validate({
//	  rules: {
//
//	  }
//	});
	
});

function resetSim(){
	plane = new Plane();
	land = new Land(2245, 10000, 10000, 5);
	autopilot = new Autopilot();
	autopilot.setup(plane, land, new THREE.Vector3(100000, 0.0, -50000));

	height = land.getValue(plane.pos.x, plane.pos.z);
	plane.pos.y =1000.0;
}
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
backView();
function translateCamera(camera){
	camera.position.set(plane.pos.x - cameraTranslation.x, plane.pos.y +cameraTranslation.y, plane.pos.z+cameraTranslation.z);
};
function satelliteView(){
	cameraTranslation={
			x:0.0,
			y:+5000.0,
			z:0.0
		};
}
function backView(){
	cameraTranslation={
		x:-4000.0,
		y:-200.0,
		z:0.0
	};
}
function sideView(){
	cameraTranslation={
		x:0.0,
		y:-200.0,
		z:-3000.0
	};
}
function initPlaneParameters(cfg){
	if(!$.isEmptyObject(cfg.velX)){
		plane.vel.x=parseFloat(cfg.velX);
	}
	if(!$.isEmptyObject(cfg.velY)){
		plane.vel.y=parseFloat(cfg.velY);
	}
	if(!$.isEmptyObject(cfg.velZ)){
		plane.vel.z=parseFloat(cfg.velZ);
	}
	
	if(!$.isEmptyObject(cfg.posX)){
		plane.pos.x=parseFloat(cfg.posX);
	}
	if(!$.isEmptyObject(cfg.posY)){
		//plane.pos.y=parseFloat(cfg.posY);
	}
	if(!$.isEmptyObject(cfg.posZ)){
		plane.pos.z=parseFloat(cfg.posZ);
	}
}
var stopAnimation=true;
function stopAnim(){
	stopAnimation=true;
	for(var i=0;i<smoothie.length;i++)
		smoothie[i].stop();
}
function startAnimation(){
	stopAnimation=false;
	for(var i=0;i<smoothie.length;i++)
		smoothie[i].start();
}