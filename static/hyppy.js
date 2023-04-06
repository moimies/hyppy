import * as THREE from 'three';
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js"
import { PointerLockControls } from "https://threejs.org/examples/jsm/controls/PointerLockControls.js";
function main() {
  console.log("hello")
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  const scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper())
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
  var score = 0;

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const playerGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const playerMaterial = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  const fov = 110;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 300;
      
  const camera = new THREE.PerspectiveCamera(fov,aspect,near, far);
  camera.position.set(0,0,0);
  camera.lookAt(0,0,0)
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
    controls.addEventListener('unlock', () => (menuPanel.domElement.style.display = 'block'))

  let clock = new THREE.Clock();


  class InputManager {
    constructor() {
      document.addEventListener("mousedown",(e) =>{
        player.jump();
        //console.log(player.cube.position)
      })
      
    }
  }

  
  class Player {
    constructor() {
      
      this.updateList = {
        "moveForward":[-1, function(cube,camera){cube.translateZ(-0.05);
                              camera.position.copy(cube.position)
                              camera.translateZ(5);
                              camera.translateY(0);}],
        "jump":[0, function(cube,camera){
                            cube.translateY(0.1);
                            camera.position.copy(cube.position)
                            camera.translateZ(5);
                            camera.translateY(0);}],
        'falling':[0, function(cube,camera){
                            cube.translateY(-0.1);
                            camera.position.copy(cube.position);
                            camera.translateZ(5);
                            camera.translateY(0);}]
                          };
      
      //const controls = new OrbitControls(this.camera,renderer.domElement);
      this.velocity = 0.1;

      this.cube = new THREE.Mesh(playerGeometry, playerMaterial);
      this.cube.add(new THREE.AxesHelper());
      this.cube.position.set(0,1,0)
      camera.add(this.cube)
      scene.add(camera)
      console.log(controls.getObject())

    }

    jump(){
      if(this.updateList['jump'][0] == 0 &&this.updateList['falling'][0] == 0){
        this.updateList['jump'][0] += 100;
        this.updateList['falling'][0] += 100;
      }
      
    }
    isTangent(mesh){
      if(this.playerBottomY() === meshUpperBound(mesh)){
        return true;
      }else{
        return false;
      }
    }

    turn(){
      
      this.cube.rotation.y = camera.rotation.y;
    }


    playerBottomY(){
      const half = this.cube.geometry.parameters.height / 2
      return this.cube.position.y - half;
      
    }
    
    collisionRays(){
      return;
    
    }
    update(){
     
      //eteenpäin
      this.updateList['moveForward'][1](this.cube,camera);
      //this.turn();
      //hyppy ja putoaminen
      if(this.updateList['jump'][0] > 0){
        this.updateList['jump'][1](this.cube,camera);
        this.updateList['jump'][0] -= 1;
      }else if(this.updateList['falling'][0] > 0){
        this.updateList['falling'][1](this.cube,camera);
        this.updateList['falling'][0] -= 1;
      }

    }

  }

  function meshUpperBound(mesh){
    const half = mesh.geometry.parameters.depth / 2;
    return mesh.position.y + half;
  }
  
  
  let player = new Player();
  let inputManager = new InputManager();
  const floor = generateFloor(scene);
  const stats = new Stats();
  document.body.appendChild(stats.dom)  

    

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


  function generateFloor(scene){
    const groundGeometry = new THREE.BoxGeometry(10,50,1);
    const groundMaterial = new THREE.MeshPhongMaterial({color:0xCC8866});
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.name = "floor";
    groundMesh.add(new THREE.AxesHelper())
    scene.add(groundMesh);
    return groundMesh;
  }
  

  function render(time) {
    time *= 0.001;  // convert time to seconds
    if(resizeRendererToDisplaySize(renderer)){
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    
    }
    player.update();
    stats.update()
    renderer.render(scene, camera);
    requestAnimationFrame(render);
   }
  requestAnimationFrame(render);



};
main();