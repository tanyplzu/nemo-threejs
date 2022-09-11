# three.js 数学方法之 Matrix4

今天郭先生说一说 three.js 中的 Matrix4，相较于 Matrix3 来说，Matrix4 和 three.js 联系的更紧密，因为在 4x4 矩阵最常用的用法是作为一个变换矩阵。这使得表示三维空间中的一个点的向量 Vector3 通过乘以矩阵来进行转换，如平移、旋转、剪切、缩放、反射、正交或透视投影等。这就是把矩阵应用到向量上。

## 1. Object3D 矩阵

任何 3D 物体 Object3D 都有三个关联的矩阵：

- Object3D.matrix: 存储物体的本地变换。 这是对象相对于其父对象的变换。
- Object3D.matrixWorld: 对象的全局或世界变换。如果对象没有父对象，那么这与存储在矩阵 matrix 中的本地变换相同。
- Object3D.modelViewMatrix: 表示对象相坐标相对于摄像机空间坐标转换， 一个对象的 modelViewMatrix 是物体世界变换矩阵乘以摄像机相对于世界空间变换矩阵的逆矩阵。

摄像机 Cameras 有两个额外的四维矩阵:

- Camera.matrixWorldInverse: 视图矩阵 - 摄像机世界坐标变换的逆矩阵。
- Camera.projectionMatrix: 投影矩阵 - 表示将场景中的信息投影到裁剪空间。

注意：物体的正规矩阵 Object3D.normalMatrix 并不是一个 4 维矩阵，而是一个三维矩阵 Matrix3。下面举例子说明一下这几个矩阵。

```js
var geom = new THREE.BoxGeometry(); //创建一个几何体
var mate = new THREE.MeshNormalMaterial(); //创建一个材质
var mesh = new THREE.Mesh(geom, mate); //创建一个网格
var group = new THREE.Group(); //创建一个组
mesh.position.setX(9); //设置网格的位置
group.add(mesh); //将网格添加到组里
group.position.setX(8); //设置组的位置
scene.add(group); //将组添加到场景中
scene.position.setX(7); //设置场景的位置
```

下面我们来分析一下这几个矩阵，mesh、group 和 scene 的 Object3D.matrix 矩阵分别是

- mesh -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 9, 0, 0, 1
- group -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 8, 0, 0, 1
- scene -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 7, 0, 0, 1

可以看出他们本地变换矩阵的 x 方向位置分量分别是 9、8 和 7，很明显，Object3D.matrix 是相对于父元素的变换，我们再来看看 mesh、group 和 scene 的 Object3D.matrixWorld 矩阵

- mesh -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 24, 0, 0, 1
- group -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 15, 0, 0, 1
- scene -- elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 7, 0, 0, 1

其中 scene 世界变换矩阵 x 方向的位置分量是 7，group 的是 15（7+8），mesh 的是 24（7+8+9），也就是说世界变换矩阵是该元素相对于世界坐标系的变换，也是该元素的本地变换和该元素父级世界变换的乘积。

说 Object3D.modelViewMatrix 之前，先说一下 Camera.matrixWorldInverse 矩阵，这个矩阵有很重要的意义，

```js
camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000,
);
camera.position.set(0, 0, 60);
scene.add(camera);
```

由于相机是加到场景里面的所以相机的本地变换矩阵是 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 60, 1，

相机的世界变换矩阵是 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 7, 0, 60, 1，

相机的视图矩阵是 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -7, 0, -60, 1，

Camera.projectionMatrix 是投影矩阵，它和相机的方向，视角等等有关。

Object3D.modelViewMatrix 是对象相坐标相对于摄像机空间坐标转换，如上 mesh 的世界变换是 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 24, 0, 0, 1，

摄像机视图矩阵阵 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -7, 0, -60, 1，

那么将二者相乘，既是 mesh 的 Object3D.modelViewMatrix 的值 elements: (16) 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 17, 0, -60, 1。

以上是我自己在矩阵上推到出的结论。

## 2. Matrix4 的属性

### 1. elements

矩阵列优先 column-major 列表。

### 2. isMatrix4

用于判定此对象或者此类的派生对象是否是三维矩阵。默认值为 true。

## 3. Matrix4 的方法

### 1. set(number, number, number ...): Matrix4

设置 set()方法参数采用行优先 row-major， 而它们在内部是用列优先 column-major 顺序存储在数组当中。方法同三维矩阵

### 2. identity(): Matrix4

创建并初始化一个 4X4 的单位矩阵 identity matrix。方法同三维矩阵。

### 3. clone(): this

创建一个新的矩阵，元素 elements 与该矩阵相同。方法同三维矩阵。

### 4. copy( m: Matrix4 ): this

将矩阵 m 的元素 elements 复制到当前矩阵中。方法同三维矩阵。

### 5. copyPosition( m: Matrix4 ): Matrix4

将给定矩阵 m : Matrix4 的平移分量拷贝到当前矩阵中。

```js
var matrix1 = new THREE.Matrix4().makeTranslation(3, 3, 3);
var matrix2 = new THREE.Matrix4().makeScale(2, 2, 2);
matrix2.copyPosition(matrix1);
console.log(matrix2); //返回elements: (16) [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 3, 3, 3, 1]
```

### 6. extractBasis( xAxis: Vector3, yAxis: Vector3, zAxis: Vector3 ): Matrix4

将矩阵的基向量 basis 提取到指定的 3 个轴向量中。方法同三维矩阵。

### 7. makeBasis( xAxis: Vector3, yAxis: Vector3, zAxis: Vector3 ): Matrix4

通过给定的三个向量设置该矩阵为基矩阵 basis:

```text
xAxis.x, yAxis.x, zAxis.x, 0,
xAxis.y, yAxis.y, zAxis.y, 0,
xAxis.z, yAxis.z, zAxis.z, 0,
0,       0,       0,       1
```

### 8. extractRotation( m: Matrix4 ): Matrix4

将给定矩阵 m 的旋转分量提取到该矩阵的旋转分量中。

```js
var matrix1 = new THREE.Matrix4().makeRotationZ(Math.PI / 6);
var matrix2 = new THREE.Matrix4().makeScale(2, 2, 2);
matrix2.extractRotation(matrix1);
console.log(matrix2); //返回elements: (16) [0.8660254037844387, 0.49999999999999994, 0, 0, -0.49999999999999994, 0.8660254037844387, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
```

### 9. makeRotationFromEuler( euler: Euler ): Matrix4

将传入的欧拉角转换为该矩阵的旋转分量(左上角的 3x3 矩阵)。 矩阵的其余部分被设为单位矩阵。根据欧拉角 euler 的旋转顺序 order，总共有六种可能的结果。

```js
var euler = new THREE.Euler(0, 0, Math.PI / 6, 'XYZ');
var matrix = new THREE.Matrix4().makeScale(2, 2, 2);
matrix.makeRotationFromEuler(euler);
console.log(matrix); //返回elements: (16) [0.8660254037844387, 0.49999999999999994, 0, 0, -0.49999999999999994, 0.8660254037844387, 0, 0, 0, -0, 1, 0, 0, 0, 0, 1]
```

因为都是绕 z 轴旋转 30 度，所以返回结果和上面一样

### 10. makeRotationFromQuaternion( q: Quaternion ): Matrix4

将这个矩阵的旋转分量设置为四元数 q 指定的旋转，使用方法同 makeRotationFromEuler。

### 11. lookAt( eye: Vector3, target: Vector3, up: Vector3 ): Matrix4

构造一个旋转矩阵，从 eye 指向 center，由向量 up : Vector3 定向。

```js
var eye = new THREE.Vector3(0, 0, 0);
var target = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 0, 1);
var matrix = new THREE.Matrix4();
matrix.lookAt(eye, target, up);
console.log(matrix); //返回elements: (16) [0, -0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]
```

### 12. multiply( m: Matrix4 ): Matrix4

将当前矩阵乘以矩阵 m。方法同三维矩阵。

### 13. premultiply( m: Matrix4 ): Matrix4

将矩阵 m 乘以当前矩阵。方法同三维矩阵。

### 14. multiplyMatrices( a: Matrix4, b: Matrix4 ): Matrix4

设置当前矩阵为矩阵 a x 矩阵 b。方法同三维矩阵。

### 15. multiplyScalar( s: number ): Matrix4

当前矩阵所有的元素乘以该缩放值 s。方法同三维矩阵。

### 16. determinant(): number

计算并返回矩阵的行列式 determinant。方法同三维矩阵。

### 17. transpose(): Matrix4

将该矩阵转置 Transposes。方法同三维矩阵。

### 18. setPosition( v: Vector3 | number, y?: number, z?: number ): Matrix4

取传入参数 v : Vector3 中值设置该矩阵的位置分量，不影响该矩阵的其余部分——即。或者直接传递向量的分量值（v,y,z），下面是源码:

```js
setPosition: function ( x, y, z ) {
    var te = this.elements;
    if ( x.isVector3 ) {
        te[ 12 ] = x.x;
        te[ 13 ] = x.y;
        te[ 14 ] = x.z;
    } else {
        te[ 12 ] = x;
        te[ 13 ] = y;
        te[ 14 ] = z;
    }
    return this;
}
```

### 19. getInverse( m: Matrix4 ): Matrix4

使用逆矩阵计算方法 analytic method， 将当前矩阵设置为给定矩阵的逆矩阵 inverse，如果 throwOnDegenerate 参数没有设置且给定矩阵不可逆，那么将当前矩阵设置为 3X3 单位矩阵。逆矩阵求法可以是用伴随矩阵的方法，同三维矩阵。

### 20. scale( v: Vector3 ): Matrix4

将该矩阵的列向量乘以对应向量 v 的分量。

```js
var matrix = new THREE.Matrix4();
matrix.scale(new THREE.Vector3(1, 2, 3));
console.log('matrix', matrix); //返回elements: (16) [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1]
```

### 21. getMaxScaleOnAxis(): number

获取 3 个轴方向的最大缩放值。

```js
var matrix = new THREE.Matrix4().makeScale(2, 3, 4);
matrix.getMaxScaleOnAxis(); //返回4
```

### 22. makeTranslation( x: number, y: number, z: number ): Matrix4

x - 在 X 轴上的平移量。y - 在 Y 轴上的平移量。z - 在 Z 轴上的平移量。不多说。

### 23. makeRotationX( theta: number ): Matrix4

把该矩阵设置为绕 x 轴旋转弧度 theta (θ)大小的矩阵。很简单，不多说。

### 24. makeRotationY( theta: number ): Matrix4

把该矩阵设置为绕 y 轴旋转弧度 theta (θ)大小的矩阵。同上。

### 25. makeRotationZ( theta: number ): Matrix4

把该矩阵设置为绕 z 轴旋转弧度 theta (θ)大小的矩阵。同上。

### 26. makeRotationAxis( axis: Vector3, angle: number ): Matrix4

设置当前矩阵为围绕轴 axis 旋转量为 theta 弧度。也不难。

```js
var matrix = new THREE.Matrix4();
//一下两个旋转是相同的
matrix.makeRotationZ(Math.PI / 4);
matrix.makeRotationAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
```

### 27. makeScale( x: number, y: number, z: number ): Matrix4

x - 在 X 轴方向的缩放比。y - 在 Y 轴方向的缩放比。z - 在 Z 轴方向的缩放比。方法不难，就不多说了。

### 28. compose( translation: Vector3, rotation: Quaternion, scale: Vector3 ): Matrix4

设置将该对象由位置 position，四元数 quaternion 和 缩放 scale 组合变换的矩阵。内部先调用 makeRotationFromQuaternion( quaternion ) 再调用缩放 scale( scale )最后是平移 setPosition( position )。

这个方法集成了旋转、缩放和平移。

```js
//使用make系列的方法操作
Object3D.applyMatrix(new THREE.Matrix4().makeScale(2, 1, 1));
Object3D.applyMatrix(new THREE.Matrix4().makeTranslation(0, 4, 0));
Object3D.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 6));
//使用compose方法操作
var matrix = new THREE.Matrix4();
var trans = new THREE.Vector3(0, 4, 0);
var rotat = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, 0, Math.PI / 6),
);
var scale = new THREE.Vector3(2, 1, 1);
Object3D.applyMatrix4(matrix.compose(trans, rotat, scale)); //效果同上
```

### 29. decompose(translation: Vector3, rotation: Quaternion, scale: Vector3): Matrix4

将矩阵分解到给定的平移 position ,旋转 quaternion，缩放 scale 分量中。就是 compose 的逆过程。随便举个例子。

```js
var matrix = new THREE.Matrix4().set(
  1,
  2,
  3,
  4,
  2,
  3,
  4,
  5,
  3,
  4,
  5,
  6,
  4,
  5,
  6,
  7,
);
var trans = new THREE.Vector3();
var rotat = new THREE.Quaternion();
var scale = new THREE.Vector3();
matrix.decompose(trans, rotat, scale);
console.log(trans); //返回Vector3 {x: 4, y: 5, z: 6} 因为是随便写的，所以只有平移变量不需计算就可以看出来的
console.log(rotat); //返回Quaternion {_x: 0.05565363763555474, _y: -0.11863820054057297, _z: 0.051265314875937947, _w: 0.7955271896092125}
console.log(scale); //返回Vector3 {x: 3.7416573867739413, y: 5.385164807134504, z: 7.0710678118654755}
```

### 30. makePerspective(fov: number,aspect: number,near: number,far: number): Matrix4

创建一个透视投影矩阵 perspective projection。 在引擎内部由 PerspectiveCamera.updateProjectionMatrix()使用。

### 31. makeOrthographic(left: number,right: number,top: number,bottom: number,near: number,far: number): Matrix4

创建一个正交投影矩阵 orthographic projection。 在引擎内部由 OrthographicCamera.updateProjectionMatrix()使用。

### 32. equals( matrix: Matrix4 ): boolean

如果矩阵 m 与当前矩阵所有对应元素相同则返回 true。

### 33. fromArray( array: number[], offset?: number ): Matrix4

使用基于列优先格式 column-major 的数组来设置该矩阵。方法同三维矩阵。

### 34. toArray( array?: number[], offset?: number ): number[]

使用列优先 column-major 格式将此矩阵的元素写入数组中。

四维矩阵就先说到这里，我们以后将会经常看到他，无论是在变换中，还是在着色器中。

转载地址：[郭先生的博客](https://cloud.tencent.com/developer/article/1689761)
