import * as THREE from 'three';
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js"
import { PointerLockControls } from "https://threejs.org/examples/jsm/controls/PointerLockControls.js";



function main() {
  console.log("hello")
  let floorPlatforms =  [];
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  const scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper())
  let prevTime = performance.now();
  const velocity = new THREE.Vector3();
  let canJump = false;
  let score = 0;
  let scoreElement = document.createElement('div')
  scoreElement.id = "score";
  scoreElement.innerHTML = score;
  
  velocity.x = 50;
  const bullets = [];


  const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

  const fov = 70;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 0;
      
  const camera = new THREE.PerspectiveCamera(fov,aspect,near, far);
  camera.position.set(0,10,15);
  camera.lookAt(0,0,0);
  
  
    const menuPanel = document.getElementById('menuPanel');
    const startButton = document.getElementById('startButton');
    startButton.addEventListener(
          'click',
          function () {
              controls.lock()
          },
          false
)
    const controls = new PointerLockControls(camera, renderer.domElement)
    controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
    controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))
    const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0),0,20)
    const raycasterBack = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0),0,20)
    document.addEventListener('mousedown', event => inputManager(event) );
    

    
    generateFloor(scene);
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    document.body.appendChild(scoreElement);
    console.log(stats.dom)
   
    let rayArrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,300,0xff0000);
    scene.add(rayArrow);
    let rayArrowBack = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,300,0xff0000);
    scene.add(rayArrowBack);
   
  function inputManager(e){
    e = e || window.event;
    switch (e.which) {
      case 1: jump();break;
      case 2: jump(); break;
      case 3: shoot(); break; 
    }
  }
    

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function jump(){
      velocity.y += 350;
    }

  function shoot(){
    const geometry = new THREE.SphereGeometry(10);
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    scene.add(sphere);
    sphere.position.copy(controls.getObject().position);
    sphere.rotation.copy(controls.getObject().rotation);
    bullets.push(sphere);
  }
    
    
  

  function generateFloor(scene){
    const groundGeometry = new THREE.BoxGeometry(20,20,1);
    const groundMaterial = new THREE.MeshPhongMaterial({color:0xD4DDFF});
    
    for(let x = 0, z = 0; x < 100; x++, z+=60){
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.rotation.x = Math.PI * -.5;
        groundMesh.name = "floor";
        groundMesh.add(new THREE.AxesHelper())
        groundMesh.position.set(0,0,z);
        floorPlatforms.push(groundMesh);
        floorPlatforms.push(groundMesh);
        scene.add(groundMesh);
    }  

    

 
  }
  

  function render() {
    if(resizeRendererToDisplaySize(renderer)){
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    const time = performance.now();
   

    if(controls.isLocked === true){
      //console.log(controls.getObject().rotation)

      canJump=false;
      //console.log(velocity.y)
      raycaster.ray.origin.copy(controls.getObject().position);
      raycaster.ray.origin.y -= 5;
      raycaster.ray.origin.z +=5;
      const intersectionsFront = raycaster.intersectObjects(floorPlatforms,false);
      rayArrow.position.copy(raycaster.ray.origin)
      raycasterBack.ray.origin.copy(controls.getObject().position);
      raycasterBack.ray.origin.y -= 5;
      raycasterBack.ray.origin.z -=5;
      const intersectionsBack = raycasterBack.intersectObjects(floorPlatforms,false);
      rayArrowBack.position.copy(raycasterBack.ray.origin)
      const intersections = intersectionsBack.concat(intersectionsFront);
      //console.log(intersections)
      const touching = intersections.length > 0;
      
      const delta = (time - prevTime) / 1000;
      controls.moveForward(velocity.x * delta)
      velocity.y -= 9.8 * 100.0 * delta;
      controls.getObject().position.y += (velocity.y * delta)

      const shooting = bullets.length > 0;
      if(shooting){
          bullets.forEach(bullet => {
            const direction = new THREE.Vector3();
            bullet.getWorldDirection(direction);
            bullet.position.z -= 700 * delta * direction.z;
            bullet.position.x -= 700 * delta * direction.x;
            bullet.position.y -= 700 * delta * direction.y;
            

        })
      
      }

      if(touching === true){
        score += delta;
        velocity.y = Math.max(0,velocity.y);
				canJump = true;
        //console.log(intersections[0])
        if(controls.getObject().position.y < (intersections[0].point.y+25) ){
          controls.getObject().position.y = intersections[0].point.y + 25;
          velocity.y = 0;
          
        }
        
      }  
    }
    
    stats.update()
    scoreElement.innerHTML = score;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    prevTime = time;

   }



  requestAnimationFrame(render);



};
main();