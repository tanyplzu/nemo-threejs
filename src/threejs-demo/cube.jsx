import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Cube = () => {
  const canvasRef = useRef(null);

  function createWorld(canvas) {
    initRender(canvas); //创建渲染器
    initCamera(); //创建相机
    initLight(); //创建光源
    initObject(); //创建物体
    initScene(); //创建场景
    render(); //渲染
  }

  let renderer; //渲染器
  let width;
  let height;
  function initRender(canvas) {
    // width = window.innerWidth;
    // height = window.innerHeight;
    width = 200;
    height = 200;
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, //抗锯齿开启
    });
    renderer.setSize(width, height); //设置渲染器宽度和高度
    renderer.setClearColor('#ffffff', 1.0); //设置背景颜色
    renderer.setPixelRatio(window.devicePixelRatio); //设置设备像素比
  }

  let camera;
  let origPoint = new THREE.Vector3(0, 0, 0); //原点
  function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(100, 300, 0.1); //设置相机位置
    camera.up.set(0, 1, 0); //设置相机正方向
    camera.lookAt(origPoint); //设置相机视点
  }

  let pointLight;
  let ambientLight;
  function initLight() {
    //点光源
    pointLight = new THREE.PointLight(0xffffff, 1, 2000);
    pointLight.position.set(70, 112, 98);
    //环境光
    ambientLight = new THREE.AmbientLight(0x333333);
  }

  let cube;
  function initObject() {
    let geometry = new THREE.BoxGeometry(100, 100, 100);
    let material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
  }

  let scene;
  function initScene() {
    scene = new THREE.Scene();
    scene.add(pointLight);
    scene.add(ambientLight);
    scene.add(cube);
  }

  function render() {
    renderer.clear();
    renderer.render(scene, camera);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    requestAnimationFrame(render);
  }

  useEffect(() => {
    if (canvasRef.current) {
      createWorld(canvasRef.current);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} />;
};

export default Cube;
