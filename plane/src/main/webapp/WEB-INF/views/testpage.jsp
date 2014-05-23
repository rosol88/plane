<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="Author" content="Radosław Ziembiński" />
<meta name="Copyright" content="Poznań Universtiy of Technolgy, 2014" />
<meta name="Description"
	content="Laboratories: Technologie programistyczne systemy internetowe - teaching materials" />

<title>Insert title here</title>
<link href="presenter/mainpage.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="presenter/jquery.js"></script>
<script type="text/javascript" src="presenter/jquery.validate.min.js"></script>
<script type="text/javascript" src="presenter/three/three.js"></script>
<script type="text/javascript" src="presenter/storage.js"></script>
<script type="text/javascript" src="presenter/changes.js"></script>

<script type="text/javascript" src="presenter/simulator.js"></script>
<script type="text/javascript" src="presenter/smoothie.js"></script>
<script type="text/javascript" src="presenter/chart.js"></script>


<link rel="stylesheet" type="text/css"
	href="presenter/bootstrap/css/bootstrap.min.css">
<script type="text/javascript"
	src="presenter/bootstrap/js/bootstrap.min.js"></script>

</head>
<body>
	<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Configuration</button>
	
	<button class="btn btn-primary btn-lg" id="startBtn">Start</button>
	<button class="btn btn-primary btn-lg" id="stopBtn">Stop</button>
	<button class="btn btn-primary btn-lg" id="backViewBtn">BackView</button>
	<button class="btn btn-primary btn-lg" id="satelliteViewBtn">SatelliteView</button>
	<button class="btn btn-primary btn-lg" id="sideViewBtn">SideView</button>
	<br><br>
	<div id="view3d"></div>
	<div id="chart">
		<canvas id="mycanvas0" width="600" height="198"></canvas>
		<canvas id="mycanvas1" width="600" height="198"></canvas>
	</div>
	<div style="clear: both"></div>
	<table class="results">
		<thead>
			<tr>
				<td>Dimension</td>
				<td>Velocity [m/s]</td>
				<td>Direction</td>
				<td>Forces [N]</td>
				<td>Position [m]</td>
				<td>Height [m]</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>X</td>
				<td><div id="vel1"></div></td>
				<td><div id="dir1"></div></td>
				<td><div id="for1"></div></td>
				<td><div id="pos1"></div></td>
				<td><div id="hoh1"></div></td>
			</tr>
			<tr>
				<td>Y(height)</td>
				<td><div id="vel2"></div></td>
				<td><div id="dir2"></div></td>
				<td><div id="for2"></div></td>
				<td><div id="pos2"></div></td>
				<td><div id="cra1"></div></td>
			</tr>
			<tr>
				<td>Z</td>
				<td><div id="vel3"></div></td>
				<td><div id="dir3"></div></td>
				<td><div id="for3"></div></td>
				<td><div id="pos3"></div></td>
			</tr>
		</tbody>
	</table>

	<table class="controls">
		<thead>
			<tr>
				<td>Roll</td>
				<td>Pitch</td>
				<td>Yaw</td>
				<td>Engine</td>
				<td>Autopilot</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><button id="rollA">+</button></td>
				<td><button id="pitchA">+</button></td>
				<td><button id="yawA">+</button></td>
				<td><button id="engineA">+</button></td>
				<td><button id="ap">Disabled</button></td>
			</tr>
			<tr>
				<td><button id="rollB">-</button></td>
				<td><button id="pitchB">-</button></td>
				<td><button id="yawB">-</button></td>
				<td><button id="engineB">-</button></td>
				<td></td>
			</tr>
			<tr>
				<td><div id="rollV"></div></td>
				<td><div id="pitchV"></div></td>
				<td><div id="yawV"></div></td>
				<td><div id="engineV"></div></td>
				<td></td>
			</tr>
		</tbody>
	</table>

	<script type="text/javascript">
		// XZ - horizontal plane, Y - height
		var plane = new Plane();
		var land = new Land(2245, 10000, 10000, 5);
		var autopilot = new Autopilot();
		autopilot.setup(plane, land, new THREE.Vector3(100000, 0.0, -50000));

		var height = land.getValue(plane.pos.x, plane.pos.z);
		plane.pos.y = height + 1000.0;
		var camera, scene, renderer, objects = {};

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 800 / 400, 1, 10000);

		var ambientLight = new THREE.AmbientLight(0x555555);
		scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);

		var manager = new THREE.LoadingManager();
		var loader = new THREE.JSONLoader(manager);
		loader.load('presenter/plane.js', function(geometry) {
			var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
			mesh.position.x = 0;
			mesh.position.y = 0;
			mesh.position.z = 0;
			mesh.scale.set(20, 20, 20); // huge model to make it visible
			scene.add(mesh);
			objects[1] = mesh;
		});

		landGridParent = new THREE.Object3D();
		scene.add(landGridParent);

		var landW = 5000;
		var landH = 5000;
		var landWS = 8;
		var landHS = 8;
		var xstep = landW / (landWS + 1);
		var zstep = landH / (landHS + 1);
		var gridGeometry = new THREE.PlaneGeometry(landW, landH, landWS, landHS);
		gridGeometry.dynamic = true;
		var grid = new THREE.Mesh(gridGeometry, new THREE.MeshBasicMaterial({
			wireframe : true
		}));
		grid.rotation.x = -Math.PI / 2;
		grid.frustumCulled = false;
		landGridParent.add(grid);

		var sphereGeom = new THREE.SphereGeometry(1000.0, 64, 32);
		var sphereMat = new THREE.MeshBasicMaterial({
			color : 0xffaa00,
			transparent : true,
			blending : THREE.AdditiveBlending
		});
		var targetMark = new THREE.Mesh(sphereGeom, sphereMat);
		scene.add(targetMark);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(800, 400);
		document.getElementById("view3d").appendChild(renderer.domElement);

		function insertTextNode(query) {
			var v = document.createTextNode("");
			document.getElementById(query).appendChild(v);
			return v;
		}

		function round(value, number) {
			var factor = Math.pow(10, number);
			return "" + Math.floor(value * factor) / factor;
		}

		var v1 = insertTextNode("vel1");
		var v2 = insertTextNode("vel2");
		var v3 = insertTextNode("vel3");

		var d1 = insertTextNode("dir1");
		var d2 = insertTextNode("dir2");
		var d3 = insertTextNode("dir3");

		var f1 = insertTextNode("for1");
		var f2 = insertTextNode("for2");
		var f3 = insertTextNode("for3");

		var l1 = insertTextNode("pos1");
		var l2 = insertTextNode("pos2");
		var l3 = insertTextNode("pos3");

		var r1 = insertTextNode("rollV");
		var r2 = insertTextNode("pitchV");
		var r3 = insertTextNode("yawV");
		var r4 = insertTextNode("engineV");

		var he = insertTextNode("hoh1");

		var cr = insertTextNode("cra1");
		document.getElementById("cra1").setAttribute("crashed", "false");

		document.getElementById("rollA").addEventListener("click", function(e) {
			plane.setRoll(plane.rollSettings + 0.05);
		}, false);

		document.getElementById("rollB").addEventListener("click", function(e) {
			plane.setRoll(plane.rollSettings - 0.05);
		}, false);

		document.getElementById("pitchA").addEventListener("click",
				function(e) {
					plane.setPitch(plane.pitchSettings + 0.05);
				}, false);

		document.getElementById("pitchB").addEventListener("click",
				function(e) {
					plane.setPitch(plane.pitchSettings - 0.05);
				}, false);

		document.getElementById("yawA").addEventListener("click", function(e) {
			plane.setYaw(plane.yawSettings + 0.05);
		}, false);

		document.getElementById("yawB").addEventListener("click", function(e) {
			plane.setYaw(plane.yawSettings - 0.05);
		}, false);

		document.getElementById("engineA").addEventListener("click",
				function(e) {
					plane.setEnginePower(plane.enginesPowerSetting + 0.05);
				}, false);

		document.getElementById("engineB").addEventListener("click",
				function(e) {
					plane.setEnginePower(plane.enginesPowerSetting - 0.05);
				}, false);

		document.getElementById("ap").addEventListener("click", function(e) {
			autopilot.navigationEnabled = !autopilot.navigationEnabled;
			var title = "Enabled";
			if (autopilot.navigationEnabled == false) {
				title = "Disabled";
			}
			var ctrl = document.getElementById("ap");
			ctrl.firstChild.data = title;
		}, false);

		function animate() {
			requestAnimationFrame(animate);
			if (stopAnimation == true)
				return;
			if (plane.crashed == false) {
				var mesh = objects[1];
				if (mesh) {
					// update plane if loaded
					mesh.setRotationFromMatrix(plane.rotationMatrix);
					//meshes[1].matrixAutoUpdate = false;
					//meshes[1].updateMatrix();

					translateCamera(camera);
					camera.lookAt(plane.pos);
					mesh.position.set(plane.pos.x, plane.pos.y, plane.pos.z);
					grid.position.set(plane.pos.x, 0.0, plane.pos.z);
					targetMark.position.set(autopilot.target.x, 500.0,
							autopilot.target.z);
				}

				// update land
				var xoffset = plane.pos.x - landW * 0.5;
				var zoffset = plane.pos.z - landH * 0.5;
				var vertexIdx = 0;
				for (var z = 0; z <= landHS; z++) {
					for (var x = 0; x <= landWS; x++) {
						var xp = xoffset + x * xstep;
						var zp = zoffset + z * zstep;
						var height = land.getValue(xp, zp);
						//height = vertexIdx * 10 + 50;//rotation!
						//if ((z == 0) && (x == 0)) {
						//	height = 0.0;
						//}
						grid.geometry.vertices[vertexIdx++].z = height;
					}
				}
				//grid.geometry.computeFaceNormals();
				//grid.geometry.normalsNeedUpdate = true;
				grid.geometry.verticesNeedUpdate = true;
			}
			renderer.render(scene, camera);
		}
		animate();

		var deltaTime = 0.1; // secs.
		setInterval(
				function() {
					if (plane.crashed == true) {
						return;
					}
					if (stopAnimation == true)
						return;
					plane.calculateForces(deltaTime);
					plane.fly(deltaTime);
					autopilot.navigate(deltaTime);
					//plane.pos.y = 500;

					v1.data = "" + plane.vel.x;
					v2.data = "" + plane.vel.y;
					v3.data = "" + plane.vel.z;

					d1.data = "" + plane.direction.x;
					d2.data = "" + plane.direction.y;
					d3.data = "" + plane.direction.z;

					f1.data = "" + plane.force.x;
					f2.data = "" + plane.force.y;
					f3.data = "" + plane.force.z;

					l1.data = "" + plane.pos.x;
					l2.data = "" + plane.pos.y;
					l3.data = "" + plane.pos.z;

					r1.data = "" + round(plane.rollSettings, 3);
					r2.data = "" + round(plane.pitchSettings, 3);
					r3.data = "" + round(plane.yawSettings, 3);
					r4.data = "" + round(plane.enginesPowerSetting, 3);

					var height = land.getValue(plane.pos.x, plane.pos.z);
					he.data = "" + round(height, 2);

					if (plane.pos.y < height) {
						plane.crashed = true;
						plane.pos.y = height;
						document.getElementById("cra1").setAttribute("crashed",
								"true");

						var vertexIdx = 0;
						for (var z = 0; z <= landHS; z++) {
							for (var x = 0; x <= landWS; x++) {
								console
										.log(vertexIdx
												+ ' '
												+ grid.geometry.vertices[vertexIdx++].z);//rotation!
							}
						}
					}

					cr.data = (plane.crashed == true) ? ("crashed "
							+ round(plane.flightTime, 1) + " sec.")
							: ("flying " + round(plane.flightTime, 1) + " sec.");
				}, 10);
	</script>

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalLabel">Configuration</h4>
				</div>
				<div class="modal-body">
					<form id="cfgFrom">

					<div class="col-md-6 form-group">
						<label for="velX">Velocity X</label>
						<input class="form-control" id="velX" required value="0" type="number" />
					</div>
					<div class="col-md-6 form-group">
						<label for="posX">Position X</label> 
						<input class="form-control" id="posX" value="0" type="number" />
					</div>
					<span class="clearfix">
					
					<div class="col-md-6 form-group">
						<label for="velY">Velocity Y</label>
						<input class="form-control" id="velY" value="0" type="number" />
					</div>
					<div class="col-md-6 form-group">
						<label for="posY">Position Y</label> 
						<input class="form-control" id="posY" value="0" type="number" />
					</div>
					<span class="clearfix">
					
					<div class="col-md-6 form-group">
						<label for="velZ">Velocity Z</label>
						<input class="form-control" id="velZ" value="0" type="number" />
					</div>
					<div class="col-md-6 form-group">
						<label for="posZ">Position Z</label> 
						<input class="form-control" id="posZ" value="0" type="number" />
					</div>
					<span class="clearfix">


					<div class="col-md-6 form-group">
						<label for="historyCmb">Last configurations</label> 
						 <select id="historyCmb" class="form-control">
						 </select>
					</div>
					
					<div class="col-md-6 form-group">
						<label for="allHistoryCmb">All configurations</label> 
						 <select id="allHistoryCmb" class="form-control">
						 </select>
					</div>
					<span class="clearfix">
					</form>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" id="cfgSave" class="btn btn-primary">Save</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>