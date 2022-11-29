# ThreeJS 基础

## scene

场景能够让你在什么地方、摆放什么东西来交给 three.js 来渲染，这是你放置物体、灯光和摄像机的地方。

```js
const scene = new THREE.Scene();
```

```js
import { Object3D } from '../core/Object3D.js';

class Scene extends Object3D {
  constructor() {
    super();

    this.type = 'Scene';

    this.background = null;
    this.environment = null;
    this.fog = null;

    this.overrideMaterial = null;

    this.autoUpdate = true; // checked by the renderer

    if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
      __THREE_DEVTOOLS__.dispatchEvent(
        new CustomEvent('observe', { detail: this }),
      ); // eslint-disable-line no-undef
    }
  }

  copy(source, recursive) {
    super.copy(source, recursive);

    if (source.background !== null) this.background = source.background.clone();
    if (source.environment !== null)
      this.environment = source.environment.clone();
    if (source.fog !== null) this.fog = source.fog.clone();

    if (source.overrideMaterial !== null)
      this.overrideMaterial = source.overrideMaterial.clone();

    this.autoUpdate = source.autoUpdate;
    this.matrixAutoUpdate = source.matrixAutoUpdate;

    return this;
  }

  toJSON(meta) {
    const data = super.toJSON(meta);

    if (this.fog !== null) data.object.fog = this.fog.toJSON();

    return data;
  }
}

Scene.prototype.isScene = true;

export { Scene };
```

## camera

### PerspectiveCamera 透视摄像机

```js
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
scene.add(camera);
```

- fov — 摄像机视锥体垂直视野角度
- aspect — 摄像机视锥体长宽比
- near — 视锥体近端面
- far — 视锥体远端面

默认值是 0.1

- far — 摄像机视锥体远端面

默认值是 2000。

- camera.position：控制相机在整个 3D 环境中的位置（取值为 3 维坐标对象-THREE.Vector3(x,y,z)）
- camera.lookAt：控制相机的焦点位置，决定相机的朝向（取值为 3 维坐标对象-THREE.Vector3(x,y,z)）

### OrthographicCamera 正交摄像机

## renderer

- WebGLRenderer

## Mesh

在 threeJs 的世界中，材质(Material)+几何体(Geometry)就是一个 mesh。设置其 name 属性可以通过 scene.getObjectByName(name)获取该物体对象；Geometry 就好像是骨架，材质则类似于皮肤。

```js
const groundGeometry = new PlaneGeometry(20000, 20000); //草地平面几何体

const groundTexture = new TextureLoader().load('/images/room/grass.jpg'); //加载草地材质
groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping; //设置重复贴图
groundTexture.repeat.set(50, 50);
groundTexture.anisotropy = 16;

const groundMaterial = new MeshLambertMaterial({
  //生成贴图的材质
  map: groundTexture,
});

const ground = new Mesh(groundGeometry, groundMaterial); //生成草地
```

## group

它几乎和 Object3D 是相同的，其目的是使得组中对象在语法上的结构更加清晰。

```js
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cubeA = new THREE.Mesh(geometry, material);
cubeA.position.set(100, 100, 0);

const cubeB = new THREE.Mesh(geometry, material);
cubeB.position.set(-100, -100, 0);

//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
const group = new THREE.Group();
group.add(cubeA);
group.add(cubeB);

scene.add(group);
```

父对象 group 进行旋转、缩放、平移变换，子对象同样跟着变换

```js
//沿着Y轴平移mesh1和mesh2的父对象，mesh1和mesh2跟着平移
group.translateY(100);
//父对象缩放，子对象跟着缩放
group.scale.set(4, 4, 4);
//父对象旋转，子对象跟着旋转
group.rotateY(Math.PI / 6);
```

## BufferGeometry

缓冲区类型几何体 BufferGeometry 是 Three.js 的核心类之一，立方体 BoxBufferGeometry、圆柱体 CylinderBufferGeometry、球体 SphereBufferGeometry 等几何体类的基类都是 BufferGeometry。

```text
//创建一个缓冲类型的几何体对象
var geo = new THREE.BufferGeometry();
//类型数组创建顶点数据  数组中包含6个顶点的xyz坐标数据
var verArr = new Float32Array([
  1,2,3,
  49,2,4,
  -1,99,-1,
  1,1,9,
  6,5,108,
  48,1,3,
]);
//三个为一组，表示一个顶点坐标
var BufferAttribute = new THREE.BufferAttribute(verArr, 3);
// 设置几何体的顶点位置数据
geo.attributes.position = BufferAttribute;
```

Three.js 渲染器解析 BufferGeometry

Three.js 渲染器在渲染场景的时候，会从缓冲类型几何体对象 BufferGeometry 中提取顶点位置、法向量、颜色、索引等数据，然后调用 WebGL 相关原生 API 创建顶点缓冲区，这样 GUP 可以读取顶点数据在顶点着色器中进行逐顶点计算处理。

### BoxBufferGeometry

```js
const geometry = new BoxBufferGeometry(2, 2, 2);
```

## dispose

删除场景对象中 Scene 一个子对象 Group，并释放组对象 Group 中所有网格模型几何体的顶点缓冲区占用内存

```js
// 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
group.traverse(function(obj) {
  if (obj.type === 'Mesh') {
    obj.geometry.dispose();
    obj.material.dispose();
  }
});
// 删除场景对象scene的子对象group
scene.remove(group);
```

## 场景交互

```js
//核心代码
var clickObjects = []; //存储哪些 obj 需要交互
var _raycaster = new THREE.Raycaster(); //射线拾取器
var raycAsix = new THREE.Vector2(); //屏幕点击点二维坐标
var container = null;

function onMouseMove(event) {
  event.preventDefault();
  container = document.getElementById('Canvas1');
  raycAsix.x =
    ((event.pageX - $(container).offset().left) / container.offsetWidth) * 2 -
    1;
  raycAsix.y =
    -((event.pageY - $(container).offset().top) / container.offsetHeight) * 2 +
    1;
  _raycaster.setFromCamera(raycAsix, Camera);
  //获取射线上与存储的可被点击物体的集合的交集，集合的第一个物体为距离相机最近的物体，最后一个则为离相机最远的。
  var intersects = _raycaster.intersectObjects(clickObjects);

  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
    console.log(intersects[0].object.name); //打印导入模型时设置的model name
  } else {
    document.body.style.cursor = 'default';
  }
}
```

## 材质分类

| 材质                 | 说明                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| MeshBasicMaterial    | 基本的材质，显示为简单的颜色或者显示为线框。不考虑光线的影响              |
| MeshDepthMaterial    | 使用简单的颜色，但是颜色深度和距离相机的远近有关                          |
| MeshNormalMaterial   | 基于面 Geometry 的法线（normals）数组来给面着色                           |
| MeshFacematerial     | 容器，允许为 Geometry 的每一个面指定一个材质                              |
| MeshLambertMaterial  | 考虑光线的影响，哑光材质                                                  |
| MeshPhongMaterial    | 考虑光线的影响，光泽材质                                                  |
| ShaderMaterial       | 允许使用自己的着色器来控制顶点如何被放置、像素如何被着色                  |
| LineBasicMaterial    | 用于 THREE.Line 对象，创建彩色线条                                        |
| LineDashMaterial     | 用于 THREE.Line 对象，创建虚线条                                          |
| RawShaderMaterial    | 仅和 THREE.BufferedGeometry 联用，优化静态 Geometry（顶点、面不变）的渲染 |
| SpriteCanvasMaterial | 在针对单独的点进行渲染时用到                                              |
| SpriteMaterial       | 在针对单独的点进行渲染时用到                                              |
| PointCloudMaterial   | 在针对单独的点进行渲染时用到                                              |
