import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import img_3 from './img/img_3.png';

import image2 from './img/image2.png';
import img_1 from './img/img_1.png';
import img from './img/img.png';
import image_2 from './img/image_2.jpg';
import image_4 from './img/image_4.jpg';
import img_4 from './img/img_4.png';
import image_41 from './img/image_41.jpg';

import img_h1 from './img/h1.png';
import img_h2 from './img/h2.png';
import img_h3 from './img/h3.png';
import img_h4 from './img/h4.png';
import img_h5 from './img/h5.png';

import gentilis_bold from './font/gentilis_bold.typeface.json';

const HappyBirthday = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const demoReact = document.getElementById('threejs-demo-happy-birthday');
      //窗口宽度
      const width = demoReact.clientWidth - 60 || window.innerWidth;
      //窗口高度
      const height = 500 || window.innerHeight;
      //窗口宽高比
      const k = width / height;
      //三维场景显示范围控制系数，系数越大，显示的范围越大
      const s = 200;
      /**
       * 创建文字载体
       */
      const loader = new THREE.TextureLoader();
      /**
       * 创建分组
       */
      const asteroids = new THREE.Group();
      /**
       * 创建场景对象
       */
      const scene = new THREE.Scene();
      /**
       * 创建相机
       */
      const camera = new THREE.OrthographicCamera(
        -s * k,
        s * k,
        s,
        -s,
        1,
        1000,
      );
      /**
       * 创建渲染器
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true, //抗锯齿开启
      });
      /**
       * 花瓣分组
       */
      const petal = new THREE.Group();
      /**
       * 底部祝福
       */
      const bottomBlessingCurveObjectGroup = new THREE.Group();
      /**
       * 蛋糕装饰组
       */
      const decorationGroup = new THREE.Group();
      create();
      render();
      const controls = new OrbitControls(camera, canvasRef.current);
      // renderPetal()

      function create() {
        // loader.load(gentilis_bold, function(font) {
        /**
         * 光源设置
         */
        const point = new THREE.AmbientLight(0xcccccc);
        // 点光源位置
        point.position.set(200, 200, 200);
        // 将点光源添加到场景中
        scene.add(point);
        // 环境光
        const ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        /**
         * 相机设置
         */
        //设置相机位置
        camera.position.set(0, 100, 600);
        //设置相机方向(指向的场景对象)
        camera.lookAt(scene.position);

        /**
         * 创建渲染器对象
         */
        //设置渲染区域尺寸
        renderer.setSize(width, height);
        //设置背景颜色
        renderer.setClearColor(0xffc0cb, 1);
        //body元素中插入canvas对象
        // document.body.appendChild(renderer.domElement);
        //执行渲染操作   指定场景、相机作为参数
        renderer.render(scene, camera);

        // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
        // const axisHelper = new THREE.AxisHelper(2500);
        // scene.add(axisHelper)
        /**
         * 蛋糕主体
         */
        // 图片加载器
        const texture = new THREE.TextureLoader().load(img_3);
        const texture2 = new THREE.TextureLoader().load(image2);
        const texture3 = new THREE.TextureLoader().load(img_1);
        const texture4 = new THREE.TextureLoader().load(img);
        const texture5 = new THREE.TextureLoader().load(image_2);
        const texture6 = new THREE.TextureLoader().load(image_4);
        const texture7 = new THREE.TextureLoader().load(img_4);
        const texture8 = new THREE.TextureLoader().load(image_41);
        const material = new THREE.MeshPhongMaterial({
          specular: 0xffffff,
          color: 0x7777ff,
        });
        const caizhi1 = [
          new THREE.MeshPhongMaterial({ map: texture3 }),
          new THREE.MeshPhongMaterial({ map: texture3 }),
          new THREE.MeshPhongMaterial({ map: texture3 }),
        ];
        const caizhi2 = [
          new THREE.MeshPhongMaterial({ map: texture }),
          new THREE.MeshPhongMaterial({ map: texture4 }),
          material,
        ];
        const caizhi3 = [
          new THREE.MeshPhongMaterial({ map: texture2 }),
          new THREE.MeshPhongMaterial({ map: texture4 }),
          material,
        ];
        const caizhi4 = [
          new THREE.MeshPhongMaterial({ map: texture5 }),
          new THREE.MeshPhongMaterial({ map: texture6 }),
          material,
        ];
        const bottom = new THREE.CylinderBufferGeometry(160, 160, 10, 40);
        const mesh1 = new THREE.Mesh(
          bottom,
          new THREE.MeshFaceMaterial(caizhi1),
        );
        mesh1.translateY(-120);
        asteroids.add(mesh1);

        const central1 = new THREE.CylinderBufferGeometry(140, 140, 60, 40);
        const meshCentral1 = new THREE.Mesh(
          central1,
          new THREE.MeshFaceMaterial(caizhi2),
        );
        meshCentral1.translateY(-90);
        asteroids.add(meshCentral1);

        const central2 = new THREE.CylinderBufferGeometry(120, 120, 70, 40);
        const meshCentral2 = new THREE.Mesh(
          central2,
          new THREE.MeshFaceMaterial(caizhi3),
        );
        meshCentral2.translateY(-25);
        asteroids.add(meshCentral2);

        const central3 = new THREE.CylinderBufferGeometry(100, 100, 70, 40);
        const meshCentral3 = new THREE.Mesh(
          central3,
          new THREE.MeshFaceMaterial(caizhi4),
        );
        meshCentral3.translateY(45);
        asteroids.add(meshCentral3);
        asteroids.position.y = -500;
        /**
         * 18字体
         */
        var fontGeometry = new THREE.TextGeometry('17', {
          // font: font,
          size: 40,
          height: 3,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 4,
          bevelSegments: 3,
        });
        const fontMaterial = [
          new THREE.MeshPhongMaterial({ map: texture5 }),
          new THREE.MeshPhongMaterial({ map: texture8 }),
          material,
        ];
        const curveObject = new THREE.Mesh(
          fontGeometry,
          new THREE.MeshFaceMaterial(fontMaterial),
        );
        curveObject.translateY(100);
        curveObject.translateX(40);
        curveObject.translateZ(-20);
        curveObject.rotateY(-Math.PI / 2);
        // asteroids.add(curveObject)

        scene.add(asteroids);
        /**
         * 创建底部祝福字体
         */
        // var bottomBlessingGeometry = new THREE.BoxGeometry(700, 50, 10);
        // const bottomBlessingMaterial = [
        //     new THREE.MeshPhongMaterial({map: texture3}),
        //     new THREE.MeshPhongMaterial({map: texture3}),
        //     new THREE.MeshPhongMaterial({map: texture3}),
        //     new THREE.MeshPhongMaterial({map: texture3}),
        //     new THREE.MeshPhongMaterial({map: texture7}),
        //     new THREE.MeshPhongMaterial({map: texture3})
        // ];
        // var bottomBlessingCurveObject = new THREE.Mesh(bottomBlessingGeometry, new THREE.MeshFaceMaterial(bottomBlessingMaterial));
        // bottomBlessingCurveObject.translateY(-800)
        // bottomBlessingCurveObject.translateZ(400)
        // bottomBlessingCurveObjectGroup.add(bottomBlessingCurveObject)
        // bottomBlessingCurveObjectGroup.position.y = 100
        // scene.add(bottomBlessingCurveObjectGroup)

        /**
         * 精灵创建下雨效果
         */
        // 加载雨滴理贴图
        var textureTree1 = new THREE.TextureLoader().load(img_h1);
        var textureTree2 = new THREE.TextureLoader().load(img_h2);
        var textureTree3 = new THREE.TextureLoader().load(img_h3);
        var textureTree4 = new THREE.TextureLoader().load(img_h4);
        var textureTree5 = new THREE.TextureLoader().load(img_h5);
        var imageList = [
          textureTree1,
          textureTree2,
          textureTree3,
          textureTree4,
          textureTree5,
        ];
        // 批量创建表示雨滴的精灵模型
        for (let i = 0; i < 400; i++) {
          var spriteMaterial = new THREE.SpriteMaterial({
            map: imageList[Math.floor(Math.random() * imageList.length)], //设置精灵纹理贴图
          });
          // 创建精灵模型对象
          var sprite = new THREE.Sprite(spriteMaterial);
          petal.add(sprite);
          // 控制精灵大小,
          sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
          var k1 = Math.random() - 0.5;
          var k2 = Math.random() - 0.5;
          var k3 = Math.random();
          // 设置精灵模型位置，在整个空间上上随机分布
          sprite.position.set(2000 * k1, 1000 * k3, 2000 * k2);
        }
        scene.add(petal);

        /**
         * 音频
         */
        // 非位置音频可用于不考虑位置的背景音乐
        // 创建一个监听者
        var listener = new THREE.AudioListener();
        camera.add(listener);
        // 创建一个非位置音频对象  用来控制播放
        var audio = new THREE.Audio(listener);
        // 创建一个音频加载器对象
        var audioLoader = new THREE.AudioLoader();
        // 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
        audioLoader.load('./63771.ogg', function(AudioBuffer) {
          console.log(AudioBuffer);
          // 音频缓冲区对象关联到音频对象audio
          audio.setBuffer(AudioBuffer);
          audio.setLoop(true); //是否循环
          audio.setVolume(0.5); //音量
          // 播放缓冲区中的音频数据
          audio.play(); //play播放、stop停止、pause暂停

          // var audioContext = new AudioContext();
          // document.documentElement.addEventListener(
          // "mousedown", function(){
          //   if (audioContext.context.state !== 'running') {
          //     audioContext.context.resume();
          // }})
        });

        // for (let i = 0; i < 20; i++) {
        //     var buffer = new THREE.IcosahedronBufferGeometry(10, 0)
        //     var material1 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        //     var cube = new THREE.Mesh( buffer, material1 );
        //     decorationGroup.add(cube)
        // }
        // scene.add( decorationGroup );
        // });
      }

      function render() {
        // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
        // 每次渲染都会更新雨滴的位置，进而产生动画效果
        petal.children.forEach(sprite => {
          // 雨滴的y坐标每次减1
          sprite.position.y -= 1;
          sprite.position.x += 0.5;
          if (sprite.position.y < -400) {
            // 如果雨滴落到地面，重置y，从新下落
            sprite.position.y = 800;
          }
          if (sprite.position.x > 1000) {
            sprite.position.x = -1000;
          }
        });

        renderer.render(scene, camera);
        //默认保持60FPS的频率，大约每16.7ms调用一次
        asteroids.rotation.y += 0.005;
        if (asteroids.position.y < 10) {
          asteroids.position.y += 1;
        }
        if (bottomBlessingCurveObjectGroup.position.y < 705) {
          bottomBlessingCurveObjectGroup.position.y += 1;
        }
        // mesh2.rotateY(0.01)
        // mesh3.rotateY(0.01)
        requestAnimationFrame(render);
      }
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} />;
};

export default HappyBirthday;
