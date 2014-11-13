function PlanetControls ( object , innerRadius , outerRadius ) {

  this.object = object;

  this.iPlane = new THREE.Mesh(
    new THREE.PlaneGeometry( 1000 , 1000 ),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
  );

  this.iPlane.visible = false;
  scene.add( this.iPlane )

  this.iDir   = new THREE.Vector3( 0 , 0 , -1 );
  this.iPlaneDistance = 5;

  this.raycaster          = new THREE.Raycaster();
  this.projector          = new THREE.Projector();

  this.raycaster.near     = this.object.near;
  this.raycaster.far      = this.object.far;

 
  this.small = new THREE.Mesh(
    new THREE.IcosahedronGeometry( .1, 0 ) ,
    new THREE.MeshNormalMaterial()
  );

  scene.add( this.small );

  this.guide = new THREE.Mesh(
    new THREE.IcosahedronGeometry( .5, 0 ) ,
    new THREE.MeshNormalMaterial()
  );


  this.guide.visible = false;
  scene.add( this.guide );

  this.guide.position.copy( this.object.position );
  this.guide.position.y += 10;
  this.guide.position.normalize();
  this.guide.position.multiplyScalar( innerRadius );

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();

  this.tObj = new THREE.Object3D();

  this.innerRadius = innerRadius;
  this.outerRadius = outerRadius;

  this.radius      = this.innerRadius;

  this.mouse = new THREE.Vector3();
  this.unprojectedMouse = new THREE.Vector3();

  this.down = false;
  this.speed = 0;
  
  var addListener = window.addEventListener;
   

  addListener( 'mousedown', this.mouseDown.bind( this )  , false );
  addListener( 'mouseup'  , this.mouseUp.bind( this )    , false );
  addListener( 'mousemove', this.mouseMove.bind( this )  , false );
}


PlanetControls.prototype.mouseMove = function( e ){

  this.mouse.x =  ( event.clientX / window.innerWidth )  * 2 - 1;
  this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  this.mouse.z = 1;

}

PlanetControls.prototype.mouseUp = function(){

  this.down = false;

}

PlanetControls.prototype.mouseDown = function(){

  this.down = true;

}

PlanetControls.prototype.unprojectMouse = function(){

  this.unprojectedMouse.copy( this.mouse );
  this.projector.unprojectVector( this.unprojectedMouse , this.object );

}

PlanetControls.prototype.checkForIntersections = function(){

    
  this.v1.copy( this.unprojectedMouse );
  this.v1.sub( this.object.position );
  this.v1.normalize();

  this.raycaster.set( this.object.position , this.v1 );

  var intersected =  this.raycaster.intersectObjects([this.iPlane] );

  this.intersected = intersected;
  //console.log( intersected[0] );
  //
  //
  if( this.intersected[0] ){
    this.point =  this.intersected[0].point;
    //this.guide.position.copy( this.intersected[0].point );
  }


}


PlanetControls.prototype.update = function(){

  if( this.down == true ){

    this.speed += .2;

  }
    
  this.speed *= .9;

  this.unprojectMouse();
  

  this.v1.set( 0 , 0 , -1 );
  this.v1.applyQuaternion( this.object.quaternion );

  this.v1.multiplyScalar( 6 );
  this.iPlane.position.copy( this.object.position );
  this.iPlane.position.add( this.v1 );
  this.iPlane.lookAt( this.object.position );

  this.object.lookAt( this.guide.position );
  this.v1.copy( this.object.position );
  this.v1.normalize();

  this.object.up.copy( this.v1 );

//  this.checkForIntersections();
 
  if( this.point ){


    this.small.position.copy( this.point );
    this.small.up.copy( this.object.up );
    this.small.lookAt( this.object.position );
    this.v1.copy( this.guide.position );
    this.v1.sub( this.point );
    this.v1.multiplyScalar( -.06 );
    this.guide.position.add( this.v1 );

  }else{

    console.log('FUXK');

  }

    this.checkForIntersections();
 /* var quat = new THREE.Quaternion();

  console.log( this.v1 )
  quat.setFromAxisAngle( this.v1 , 0 );
  this.v2.set( 0 , 1 , 0 );


  this.v2.applyQuaternion( quat );

  this.object.rotation.setFromQuaternion( quat );

  this.object.updateMatrix();

  this.v1.multiplyScalar( this.innerRadius );
  this.object.position.copy( this.v1 );*/

  this.v1.set( 0 , 0 , -.09 );
  this.v1.applyQuaternion( this.object.quaternion );
  this.object.position.add( this.v1.multiplyScalar( this.speed ) );

  var r = this.object.position.length();
  if( r <= this.outerRadius){
    this.radius = r;
    if( r >= this.innerRadius){
      this.radius = r;
    }else{
      this.radius = this.innerRadius;
    }


  }else{
    this.radius = this.outerRadius;
  }


  this.object.position.normalize();
  this.object.position.multiplyScalar( this.radius  );


/*  //console.log('hello');
  //

 // this.object.lookAt( this.object.position.clone().add( new THREE.Vector3( 1 , 0 , 0 )));

  //this.object.position.y += .1;*/

  //this.object.position.x += .1;



  
  //up vector 
 /* this.v1

  this.v2.set( 0 , 1 , 0 );

  var dot = this.v1.dot( this.v2 );
  
  var upPara = this.v2.clone().multiplyScalar( dot );
  var upPerp = this.v1.clone().sub( upPara );

  var basisX = upPerp.normalize();
  var basisY = this.v2.clone().cross( basisX );

  // Exact rotation Method

  vec3  upVector = vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );


  float theta = position.z * 2. * 3.14195;
 
  float x = cos( theta );
  float y = sin( theta );

  float r =  .1;

  vec3 point = columnPos + ( r * x * basisX ) + ( r * y * basisY );*/

}
