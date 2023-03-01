import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Add a new scene
const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');

//Texture Loader

const loader = new THREE.TextureLoader();
const heightMap = loader.load(
  'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63ff7526ef8acfaa585a2311_Layer%200.png'
);
const texture = loader.load(
  'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63ff76cd2896f4042f77f52b_michael-oeser-chBLQ_UCmgU-unsplash.jpg'
);

//Default Object
const geometry = new THREE.PlaneGeometry(4, 4, 64, 64); //Add a plane terrain
const material = new THREE.MeshStandardMaterial({
  color: 0x808080,
  displacementMap: heightMap,
  displacementScale: 1.5,
  map: texture,
  bumpMap: heightMap,
  roughness: 0.7,
});

const material2 = new THREE.MeshStandardMaterial({
  color: 0x101010,
  roughness: 0.25,
});

const mesh = new THREE.Mesh(geometry, material); //Add a mesh with box and material
const mirror = new THREE.Mesh(geometry, material2);
mirror.position.y = 0.15;
mesh.rotation.x = (Math.PI / 2) * -1;
mirror.rotation.x = (Math.PI / 2) * -1;
scene.add(mesh); //Add mesh to scene
scene.add(mirror);

//Sizes (canvas sizing)
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Lights
const pointLight = new THREE.PointLight(0xffffff, 2, 10);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); //Add a new camera with canvas sized field of view
camera.position.y = 1;
camera.position.z = 1; //Make camera not centered in axis 0
scene.add(camera); //Add Camera to Scene

//Renderer
const renderer = new THREE.WebGLRenderer({
  //Create renderer
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height); //Set size for renderer

const controls = new OrbitControls(camera, canvas); //Add Orbit Camera

const tick = () =>
  //Function allows to refresh screen every frame
  {
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

tick();
