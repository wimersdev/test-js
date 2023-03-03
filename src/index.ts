import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//Add a new scene

const loader = new THREE.TextureLoader();

function hero3d() {
  const scene = new THREE.Scene();
  const canvas = document.querySelector('canvas.webgl');

  //Add a object scale value (less-bigger object)
  const scaleValue = 600;

  //Init RGBE Loader for HDRI environment map (better to change to cubemap)
  const envMap = new RGBELoader().load(
    'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63f4b3177336d31122b5d801_03.txt',
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.backgroundIntensity = 1;
    }
  );
  /*
  //Glass shader
  const material = new THREE.RawShaderMaterial({
    vertexShader: ``,
    fragmentShader: ``,
  });
  */
  //Add glass material
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    transmission: 1,
    thickness: 1,
    envMap: envMap,
  });

  const canvasHolder = document.getElementById('canvasholder');

  //Sizes (canvas sizing)
  const sizes = {
    width: canvasHolder.offsetWidth,
    height: canvasHolder.offsetHeight,
  };

  //Add a group for mesh manipulations
  const meshGroup = new THREE.Group();
  meshGroup.scale.x = sizes.width / scaleValue; //Set the scale values for meshGroup
  meshGroup.scale.y = sizes.width / scaleValue;
  meshGroup.scale.z = sizes.width / scaleValue;
  scene.add(meshGroup);

  //Init GLTF Loader for 3d models
  const gltfLoader = new GLTFLoader();

  //Load cube
  gltfLoader.load(
    'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63f4b317da759861bfc961d6_cube-glass-test.txt',
    (gltf) => {
      const cube = gltf.scene.children[0];
      const geometry = cube.geometry.clone();
      const mesh = new THREE.Mesh(geometry, material);
      meshGroup.add(mesh);
    }
  );

  //Camera
  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.PerspectiveCamera(10, aspectRatio);
  camera.position.z = 30; //Make camera not centered in axis 0
  camera.position.y = 15; //add camera angle
  scene.add(camera); //Add Camera to Scene

  //Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  //Render Target
  const parameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
  };

  const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, parameters);

  //Post processing
  const effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Add render passes
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  //Add bloom
  const bloom = new UnrealBloomPass();
  bloom.threshhold = 0;
  bloom.resolution = 3;
  bloom.radius = 0.2;
  bloom.strength = 1;
  bloom.transmission = 1;
  //effectComposer.addPass(bloom);

  //Renderer config
  renderer.setSize(sizes.width, sizes.height); //Set size for renderer
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.7;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.antialias = true;

  //When window resizing
  window.addEventListener('resize', () => {
    // Update sizes
    //Sizes (canvas sizing)
    const sizes = {
      width: canvasHolder.offsetWidth,
      height: canvasHolder.offsetHeight,
    };
    meshGroup.scale.x = sizes.width / scaleValue;
    meshGroup.scale.y = sizes.width / scaleValue;
    meshGroup.scale.z = sizes.width / scaleValue;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  //Orbitcontrols
  const controls = new OrbitControls(camera, canvas); //Add Orbit Camera
  controls.autoRotate = true;
  controls.autoRotateSpeed = 3;
  controls.enabled = false;

  //Animation render
  const tick = () =>
    //Function allows to refresh screen every frame
    {
      // Render
      //renderer.render(scene, camera)
      controls.update();
      effectComposer.render();

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

  tick();
}

function about3d() {
  const scene = new THREE.Scene();
  const canvas = document.querySelector('canvas.webgl2');

  //Add a object scale value (less-bigger object)
  const scaleValue = 200;

  const canvasHolder = document.getElementById('portrait');

  //Sizes (canvas sizing)
  const sizes = {
    width: canvasHolder.offsetWidth,
    height: canvasHolder.offsetHeight,
  };

  //Add a group for mesh manipulations
  const meshGroup = new THREE.Group();
  meshGroup.scale.x = sizes.width / scaleValue; //Set the scale values for meshGroup
  meshGroup.scale.y = sizes.width / scaleValue;
  meshGroup.scale.z = sizes.width / scaleValue;
  meshGroup.position.y = -10;
  scene.add(meshGroup);

  //Init GLTF Loader for 3d models
  const gltfLoader = new GLTFLoader();

  //Load cube
  gltfLoader.load(
    'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63ff9419da3b23945dd54b7d_WI-Final-W.txt',
    (gltf) => {
      const cube = gltf.scene;
      cube.position.z = -0.5;
      meshGroup.add(cube);
    }
  );

  //Terrain Texture

  const displace = loader.load(
    'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/63ff7526ef8acfaa585a2311_Layer%200.png'
  );
  const texture = loader.load(
    'https://uploads-ssl.webflow.com/6385ed21375f1c00a4a3f887/64005d3e9daa172aa58cb0b8_Bake-min.jpg'
  );

  //TERRAIN
  const terrainGeo = new THREE.PlaneGeometry(15, 15, 64, 64);
  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x808080,
    displacementMap: displace,
    displacementScale: 4,
    map: texture,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = (Math.PI / 2) * -1;
  terrainMesh.position.y = -1;

  meshGroup.add(terrainMesh);

  //AmbientLight
  const ambLight = new THREE.AmbientLight({ color: 0xffffff }, 2);
  scene.add(ambLight);
  /*
  //Light
  const pointLight = new THREE.PointLight(0x404040, 500);
  const pointLight2 = new THREE.PointLight(0x404040, 500);
  const pointLight3 = new THREE.PointLight(0x404040, 500);
  const pointLight4 = new THREE.PointLight(0x404040, 200);
  pointLight.position.set(-4, 2, 0);
  pointLight2.position.set(5, 2, 0);
  pointLight3.position.set(12, 2, 0);
  pointLight4.position.set(5, 6, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 512; // default
  pointLight.shadow.mapSize.height = 512; // default
  pointLight.shadow.camera.near = 0.5; // default
  pointLight.shadow.camera.far = 500; // default

  meshGroup.add(pointLight, pointLight2, pointLight3, pointLight4);

  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);

  */

  //Camera
  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.PerspectiveCamera(24, aspectRatio);
  camera.position.z = 30; //Make camera not centered in axis 0
  camera.position.y = -20; //add camera angle
  camera.rotation.x = (Math.PI / 4) * -1;
  scene.add(camera); //Add Camera to Scene

  //Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  //Render Target
  const parameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
  };

  const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, parameters);

  //Post processing
  const effectComposer = new EffectComposer(renderer, renderTarget);
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Add render passes
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  //Add bloom
  const bloom = new UnrealBloomPass();
  bloom.threshhold = 0;
  bloom.resolution = 3;
  bloom.radius = 0.2;
  bloom.strength = 1;
  bloom.transmission = 1;
  //effectComposer.addPass(bloom);

  //Renderer config
  renderer.setSize(sizes.width, sizes.height); //Set size for renderer
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.7;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.antialias = true;

  //When window resizing
  window.addEventListener('resize', () => {
    // Update sizes
    //Sizes (canvas sizing)
    const sizes = {
      width: canvasHolder.offsetWidth,
      height: canvasHolder.offsetHeight,
    };
    meshGroup.scale.x = sizes.width / scaleValue;
    meshGroup.scale.y = sizes.width / scaleValue;
    meshGroup.scale.z = sizes.width / scaleValue;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  //Orbitcontrols
  const controls = new OrbitControls(camera, canvas); //Add Orbit Camera
  controls.autoRotateSpeed = 3;
  //controls.enabled = false;

  //Animate

  //Animation render
  const tick = () =>
    //Function allows to refresh screen every frame
    {
      // Render
      //renderer.render(scene, camera)
      controls.update();
      effectComposer.render();

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

  tick();
}

function portfolioSlider(slideWidth: number, slideHeight: number, slidesQuantity: number) {
  //Add a new scene
  const scene = new THREE.Scene();
  const canvas = document.querySelector('canvas.webgl3');

  //Add material
  const material = new THREE.MeshBasicMaterial({
    color: 0xfff000,
    side: THREE.DoubleSide,
    map: null,
  }); //Add default material

  //Sizes (canvas sizing)
  const canvasHolder = document.getElementById('portfolio');

  //Sizes (canvas sizing)
  const sizes = {
    width: canvasHolder.offsetWidth,
    height: canvasHolder.offsetHeight,
  };

  const scaleValue = 0.1;
  const scaleSlider = (sizes.width / 100) * scaleValue;
  console.log(scaleSlider);
  let planeNum = 0;

  //Textures collection
  const textures = [
    'https://uploads-ssl.webflow.com/638c5c270787c73ff9df319f/63f7100a99fcabdaac351fbf_image17.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab90403592d3_image5.jpeg',
    'https://uploads-ssl.webflow.com/63f54f92f7104f41b5892a2e/63f7117899fcab74ce35396c_image15.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab56d13592d4_image17.jpeg',
    'https://uploads-ssl.webflow.com/63bd9ed296c312580728234d/63f710c099fcab33b1352c90_image2.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab73233592d2_image14.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab554a3592d0_image7.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab983b3592d1_image19.jpeg',
    'https://uploads-ssl.webflow.com/638c5c270787c73ff9df319f/63f7100a99fcab59be351fc0_image7.jpeg',
    'https://uploads-ssl.webflow.com/638c5c270787c73ff9df319f/63f7100a99fcab8eeb351fc2_image3.jpeg',
    'https://uploads-ssl.webflow.com/638c5c270787c73ff9df319f/63f7100a99fcab4d94351fbe_image9.jpeg',
    'https://uploads-ssl.webflow.com/63f7161399fcab2247359159/63f7163599fcab56d13592d4_image17.jpeg',
  ];

  //Add a 4-sided slide
  let slidePosition = (slidesQuantity * slideWidth * -1 + slideWidth) / 2;
  const portfolioSlide = new THREE.Group();
  const porfolioHolder = new THREE.Group();
  porfolioHolder.scale.x = scaleSlider; //Set the scale values for meshGroup
  porfolioHolder.scale.y = scaleSlider;
  porfolioHolder.scale.z = scaleSlider;
  scene.add(porfolioHolder);
  for (let i = 0; i < slidesQuantity; i++) {
    portfolioSlide[i] = new THREE.Group();
    console.log(portfolioSlide[i]);
    portfolioSlide[i].position.x = slidePosition;
    add4slide(slideWidth, slideHeight, slidePosition, [i]);
    slidePosition = slidePosition + slideWidth;
    porfolioHolder.add(portfolioSlide[i]);
  }

  function add4slide(
    slideWidth: number,
    slideHeight: number,
    slidePosition: number,
    slideNumber: number
  ) {
    const slidePlane = new THREE.PlaneGeometry(slideWidth, slideHeight);
    const planeMesh = new THREE.Mesh(slidePlane, material);
    scene.add(portfolioSlide[slideNumber]);
    let planeRotation = 0;
    const texture = new THREE.TextureLoader().load();
    const planesArrayZ = [slideHeight / 2, 0, (slideHeight / 2) * -1, 0];
    const planesArrayY = [0, slideHeight / 2, 0, (slideHeight / 2) * -1];
    const planesRotationZ = [0, Math.PI, 0, Math.PI];
    for (let i = 0; i < 4; i++) {
      texture[planeNum] = new THREE.TextureLoader().load(textures[planeNum]);
      material[planeNum] = new THREE.MeshBasicMaterial({
        map: texture[planeNum],
        side: THREE.DoubleSide,
      });
      slidePlane[i] = new THREE.PlaneGeometry(slideWidth, slideHeight);
      planeMesh[i] = new THREE.Mesh(slidePlane[i], material[planeNum]);
      planeMesh[i].position.set(0, planesArrayY[i], planesArrayZ[i]);
      planeMesh[i].rotation.x = planeRotation;
      planeMesh[i].rotation.z = planesRotationZ[i];
      planeRotation = planeRotation + Math.PI / 2;
      portfolioSlide[slideNumber].add(planeMesh[i]);
      planeNum = planeNum + 1;
    }
  }

  //Camera
  const camera = new THREE.PerspectiveCamera(32, sizes.width / sizes.height); //Add a new camera with canvas sized field of view
  camera.position.z = 5; //Make camera not centered in axis 0
  scene.add(camera); //Add Camera to Scene

  //Renderer
  const renderer = new THREE.WebGLRenderer({
    //Create renderer
    canvas: canvas,
    alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height); //Set size for renderer

  const controls = new OrbitControls(camera, canvas); //Add Orbit Camera
  controls.enabled = false;

  //When window resizing
  window.addEventListener('resize', () => {
    // Update sizes
    //Sizes (canvas sizing)
    const sizes = {
      width: canvasHolder.offsetWidth,
      height: canvasHolder.offsetHeight,
    };

    porfolioHolder.scale.x = scaleSlider; //Set the scale values for meshGroup
    porfolioHolder.scale.y = scaleSlider;
    porfolioHolder.scale.z = scaleSlider;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  //Slides change
  //Animate

  const animAngle = Math.PI / 2;
  let currentSlide = 0;

  function slideNext() {
    currentSlide = currentSlide + 1;
    for (let i = 0; i < slidesQuantity; i++) {
      console.log(currentSlide);
      gsap.to(portfolioSlide[i].rotation, {
        duration: 1,
        delay: [i] / 10,
        x: animAngle * currentSlide,
      });
    }
  }

  function slidePrev() {
    currentSlide = currentSlide - 1;
    for (let i = 0; i < slidesQuantity; i++) {
      console.log(currentSlide);
      gsap.to(portfolioSlide[i].rotation, {
        duration: 1,
        delay: [i] / 10,
        x: animAngle * currentSlide,
      });
    }
  }

  const nextButton = document.getElementById('next');
  const prevButton = document.getElementById('prev');

  nextButton.addEventListener('click', slideNext);
  prevButton.addEventListener('click', slidePrev);

  const tick = () =>
    //Function allows to refresh screen every frame
    {
      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

  tick();
}

//Run
hero3d();
about3d();
//portfolioSlider(1.5, 2, 3);
