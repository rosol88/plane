/**
 * Author: Radosław Ziembiński, 
 * Copyright: Poznań Universtiy of Technolgy, 2014
 * Laboratories: Technologie programistyczne systemy internetowe - teaching materials
 */
var KER=0;
var g_const = 9.80665; // m/s2
var air_density = 1.225; // kg/m3
var air_presuredrop_height = 10000.0;
var PI_coeff = 3.141592;
var PI2_coeff = 2.0 * PI_coeff;

// random generator
var m_w = 986778765;
var m_z = 274845846;
var mask = 0xffffffff;

function seed(i) {
	m_w = i;
}

function random() {
	m_z = (36965 * (m_z & 65535) + (m_z >> 16)) & mask;
	m_w = (18001 * (m_w & 65535) + (m_w >> 16)) & mask;
	var result = ((m_z << 16) + m_w) & mask;
	var x= result / 4294967296 + 0.5;
//	console.log(x);
	return x;
}

// kernel class definition
function Kernel() {
};

Kernel.prototype = {
	x : 0.0,
	y : 0.0,
	height : 0.0,
	width : 0.0,

	getValue : function(xp, yp) {
		with (this) {
			var dx = xp - x;
			var dy = yp - y;
			var span = (dx * dx + dy * dy) / (width * width);
			var value = height / Math.exp(span);

			return value;
		}
	},

	setup : function(xi, yi, heighti, widthi) {
		with (this) {
			x = xi;
			y = yi;
			height = heighti;
			width = widthi;
		}
	}
};

// land generators
function Land(seed, pieceSizeX, pieceSizeY, hillsPerPiece) {
	this.currentSeed = seed;
	this.pieceSizeX = pieceSizeX;
	this.pieceSizeY = pieceSizeY;
	this.hillsPerPiece = hillsPerPiece;
};

Land.prototype = {
	currentSeed : 0,
	pieceSizeX : 0,
	pieceSizeY : 0,
	hillsPerPiece : 0,
	kernelArrays : {},
	hillsBaseWidth : 200,
	hillsBaseHeight : 200,
	hillsMaxWidth : 2000,
	hillsMaxHeight : 800,
	kernelArraysCat : {},

	getKernels : function(xl, yl) {
		with (this) {
			if (kernelArrays.hasOwnProperty(xl)) {
				var my = kernelArrays[xl];
				if (my.hasOwnProperty(yl)) {
					// console.log('cached ' + xl + ' ' + yl);
					return kernelArrays[xl][yl];
				}
			} else {
				kernelArrays[xl] = {};
			}

			var seedx = xl * 10000 + yl + currentSeed;
			seed(seedx);
			kernelArrays[xl][yl] = [];
			KER++;
			for (var i = 1; i <= hillsPerPiece; i++) {
				var rkx = xl * pieceSizeX - 10000000.0;
				var rky = yl * pieceSizeY - 10000000.0;
				rkx += (random() * 0.9 + 0.5) * pieceSizeX;
				rky += (random() * 0.9 + 0.5) * pieceSizeY;
				var height = random() * hillsMaxHeight + hillsMaxHeight;
				var width = random() * hillsMaxWidth + hillsBaseWidth;

				var k = new Kernel();
				k.setup(rkx, rky, height, width);
				kernelArrays[xl][yl].push(k);
			}
			// console.log('built ' + xl + ' ' + yl);
			return kernelArrays[xl][yl];
		}
	},

	getValue : function(xp, yp) {
		with (this) {
			var xl = Math.floor((xp + 10000000) / pieceSizeX);
			var yl = Math.floor((yp + 10000000) / pieceSizeY);

			var allkernels = null;
			if (kernelArraysCat.hasOwnProperty(xl)) {
				var my = kernelArraysCat[xl];
				if (my.hasOwnProperty(yl)) {
					// console.log('cached ' + xl + ' ' + yl);
					allkernels = kernelArraysCat[xl][yl];
				}
			} else {
				kernelArraysCat[xl] = {};
			}

			if (allkernels == null) {
				allkernels = [];
				for (var xoffset = -1; xoffset < 2; xoffset++) {
					for (var yoffset = -1; yoffset < 2; yoffset++) {
						var xpk = xl + xoffset;
						var ypk = yl + yoffset;
						allkernels = allkernels.concat(getKernels(xpk, ypk));
					}
				}
				kernelArraysCat[xl][yl] = allkernels;
			}

			// calculate total height
			var sum = 0.0;

			for (var i = 0; i < allkernels.length; i++) {
				sum += allkernels[i].getValue(xp, yp);
			}

			return sum;
		}
	}
};

function Plane() {
}

Plane.prototype = {
	tmpMatrix : new THREE.Matrix4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	tmp2Matrix : new THREE.Matrix4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	// matrix containing orientation of the plane n the space (rotation)
	rotationMatrix : new THREE.Matrix4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0),
	rotationMatrixRoll : new THREE.Matrix4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	rotationMatrixYaw : new THREE.Matrix4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	rotationMatrixPitch : new THREE.Matrix4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	direction : new THREE.Vector3(1.0, 0.0, 0.0),
	planeplane : new THREE.Vector3(1.0, 1.0, 0.0),
	liftDirection : new THREE.Vector3(0.0, 1.0, 0.0),
	pos : new THREE.Vector3(0.0, 0.0, 0.0),
	vel : new THREE.Vector3(400.0 * 1000.0 / 3600.0, 0.0, 0.0),
	accel : new THREE.Vector3(0.0, 0.0, 0.0),
	force : new THREE.Vector3(0.0, 0.0, 0.0),
	partialForce : new THREE.Vector3(0.0, 0.0, 0.0),
	enginesPower : 300000.0, // N (c.a. twice Boeing 737 powerhorse)
	enginesPowerSetting : 0.5, // [0-1] current settings
	pitchMax : 0.1, // min-max angular velocity
	pitchSettings : 0.0, // [0-1] current settings
	rollMax : 0.1, // min-max angular velocity
	rollSettings : 0.0, // [0-1] current settings
	yawMax : 0.1, // min-max angular velocity
	yawSettings : 0.0, // [0-1] current settings
	mass : 50000.0, // kg plane mass (a twice bigger than Boeing 737)
	flightTime : 0.0, // sec. total flight time
	drag_coeff : 0.2, // plane property - drag coefficient
	minCrossArea : 30.0, // front profile of the plane
	maxCrossArea : 130.0, // surface of the plane
	crashed : false,

	fly : function(deltaTime) {
		with (this) {
			if (crashed) {
				vel.x = 0.0;
				vel.y = 0.0;
				vel.z = 0.0;
				return;
			}
			// acceleration
			accel.x = force.x / mass;
			accel.y = force.y / mass;
			accel.z = force.z / mass;

			// movement vector
			vel.x += accel.x * deltaTime;
			vel.y += accel.y * deltaTime;
			vel.z += accel.z * deltaTime;

			// position change
			pos.x += vel.x * deltaTime;
			pos.y += vel.y * deltaTime;
			pos.z += vel.z * deltaTime;

			flightTime += deltaTime;
		}
	},

	calculateForces : function(deltaTime) {
		with (this) {
			if (crashed) {
				return;
			}
			// attack angle required to calculate air resistance and rotation
			// impact
			// on previous data
			var velocity = vel.length();
			var pl = direction.length();
			var cosAttackAngle = 0.0;
			if ((velocity > 0.0) && (pl > 0.0)) {
				cosAttackAngle = direction.dot(vel) / (velocity * pl);
			}
			var attackAngle = Math.acos(cosAttackAngle);
			var angularStep = deltaTime * cosAttackAngle;

			// update plane flying direction
			var rotationPitch = pitchSettings * pitchMax * angularStep;
			var rotationRoll = rollSettings * rollMax * angularStep;
			var rotationYaw = yawSettings * yawMax * angularStep;

			// rotation per time step (angular drag) - must be small
			tmp2Matrix.identity();
			tmpMatrix.makeRotationX(rotationRoll);
			tmp2Matrix.multiply(tmpMatrix);
			tmpMatrix.makeRotationZ(rotationPitch);
			tmp2Matrix.multiply(tmpMatrix);
			tmpMatrix.makeRotationY(rotationYaw);
			tmp2Matrix.multiply(tmpMatrix);

			// rotate plane
			tmp2Matrix.multiply(rotationMatrix);
			rotationMatrix.copy(tmp2Matrix);
			// rotationMatrix.multiply(tmp2Matrix);

			direction.set(1.0, 0.0, 0.0);
			direction.applyMatrix4(rotationMatrix);
			planeplane.set(1.0, 0.0, 1.0);
			planeplane.applyMatrix4(rotationMatrix);
			liftDirection.set(0.0, 1.0, 0.0);
			liftDirection.applyMatrix4(rotationMatrix);

			// reset forces
			force.set(0.0, 0.0, 0.0);

			// engine direction force
			partialForce.set(direction.x, direction.y, direction.z);
			partialForce.multiplyScalar(enginesPower * enginesPowerSetting);
			force.add(partialForce);

			// air resistance force
			var drag = 0.5 * drag_coeff * air_density * ((maxCrossArea - minCrossArea) * Math.sqrt(1 - cosAttackAngle * cosAttackAngle) + minCrossArea) * velocity * velocity;
			partialForce.set(-vel.x, -vel.y, -vel.z);
			partialForce.normalize();
			partialForce.multiplyScalar(drag);
			force.add(partialForce);

			// lift force (ortogonal to direction of movement)
			// depends on plane construction and wing profile
			var air_pressure = 1.0 - 1.0 / (1.0 + Math.exp(-(pos.y - air_presuredrop_height) * 0.0002));
			var lift_coeff = 0.4 / ((attackAngle * 4.0 + 0.3) * 0.3 + 1.0 / (Math.pow(Math.exp((attackAngle * 4.0 + 0.3) * 2.0), 2.0))) - 0.6;
			lift_coeff = (lift_coeff < 0.0) ? (0.0) : (lift_coeff);
			var lift = 0.5 * air_pressure * lift_coeff * air_density * maxCrossArea * velocity * velocity;
			partialForce.set(liftDirection.x, liftDirection.y, liftDirection.z);
			partialForce.normalize();
			partialForce.multiplyScalar(lift);
			force.add(partialForce);

			// gravity force
			partialForce.set(0.0, -mass * g_const, 0.0);
			force.add(partialForce);
		}
	},

	setEnginePower : function(power) {
		with (this) {
			enginesPowerSetting = power;
			enginesPowerSetting = (enginesPowerSetting < 0) ? (0) : ((enginesPowerSetting > 1) ? (1) : (enginesPowerSetting));
		}
	},

	setPitch : function(pitch) {
		with (this) {
			pitchSettings = pitch;
			pitchSettings = (pitchSettings < -1) ? (-1) : ((pitchSettings > 1) ? (1) : (pitchSettings));
		}
	},

	setRoll : function(roll) {
		with (this) {
			rollSettings = roll;
			rollSettings = (rollSettings < -1) ? (-1) : ((rollSettings > 1) ? (1) : (rollSettings));
		}
	},

	setYaw : function(yaw) {
		with (this) {
			yawSettings = yaw;
			yawSettings = (yawSettings < -1) ? (-1) : ((yawSettings > 1) ? (1) : (yawSettings));
		}
	}
};

function Autopilot() {
}

Autopilot.prototype = {
	plane : null,
	land : null,
	target : null,
	landHeight : null,
	planeHeight : null,
	land1Height : null,
	plane1Height : null,
	flightAltitude : 500,
	targetAchieved : false,
	navigationEnabled : false,
	movingDirection : new THREE.Vector3(0.0, 0.0, 0.0),
	targetDirection : new THREE.Vector3(0.0, 0.0, 0.0),
	movingDirectionNorm : new THREE.Vector3(0.0, 0.0, 0.0),
	targetDirectionNorm : new THREE.Vector3(0.0, 0.0, 0.0),
	tmp1 : new THREE.Vector3(0.0, 0.0, 0.0),
	tmp2 : new THREE.Vector3(0.0, 0.0, 0.0),
	position : new THREE.Vector3(0.0, 0.0, 0.0),

	setup : function(planeref, landref, targetPosVec) {
		with (this) {
			plane = planeref;
			land = landref;
			target = targetPosVec;
		}
	},

	navigate : function(deltatime) {
		with (this) {
			if (navigationEnabled == false) {
				return;
			}

			position.set(plane.pos.x, 0.0, plane.pos.z);

			targetDirection.set(target.x - plane.pos.x, 0.0, target.z - plane.pos.z);
			targetDirectionNorm.copy(targetDirection);
			targetDirectionNorm.normalize();

			movingDirection.set(plane.vel.x, 0.0, plane.vel.z);
			movingDirectionNorm.copy(movingDirection);
			movingDirectionNorm.normalize();

			landHeight = land.getValue(plane.pos.x, plane.pos.z);
			planeHeight = plane.pos.y;

			/* vertical steering */
			var verticalVel = -50.0; // max falling speed
			for (var scanRange = 4.0; scanRange < 20; scanRange += 4.0) {
				tmp1.copy(movingDirectionNorm);
				tmp1.multiplyScalar(movingDirection.length() * scanRange);

				tmp2.copy(position);
				tmp2.add(tmp1);

				land2Height = land.getValue(tmp2.x, tmp2.z);
				plane2Height = land2Height + flightAltitude;

				var verticalVelCur = (plane2Height - planeHeight) / scanRange;
				if (verticalVel < verticalVelCur) {
					verticalVel = verticalVelCur;
				}
			}

			/* where plane would be located for 10.0 secs */
			if (plane.vel.y < verticalVel) {
				plane.setPitch(0.5);
				if (plane.vel.y > 0) {
					plane.setEnginePower(1.0);
				} else {
					plane.setEnginePower(0.75);
				}
			} else {
				plane.setPitch(-0.25);
				if (plane.vel.y < 0) {
					plane.setEnginePower(0.25);
				} else {
					plane.setEnginePower(0.5);
				}
			}

			/* horizontal steering */
			if (plane.vel.y > -10.0) {
				tmp1.crossVectors(targetDirection, movingDirection);
				if (tmp1.y > 0.0) {
					plane.setYaw(-0.1);
				} else {
					plane.setYaw(0.1);
				}
			} else {
				plane.setYaw(0.0);
			}
		}
	}
};
