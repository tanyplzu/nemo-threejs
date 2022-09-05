# Vector3

- [Three.js 向量 Vector3](http://www.yanhuangxueyuan.com/doc/three.js/vector3.html)
- [three.js 数学方法之 Vector3](https://cloud.tencent.com/developer/article/1689757)

## 计算直线的长度

```js
// 点1坐标
var p1 = new THREE.Vector3(10, 8, 12);
// 点2坐标
var p2 = new THREE.Vector3(20, 30, -10);
// .clone()方法克隆p1，直接执行向量减法.sub()会改变p1向量本身
// .sub()：向量减法运算
// .length()：返回向量的长度
var L = p1
  .clone()
  .sub(p2)
  .length();
console.log('两点之间距离', L);
```

## 两条线段的余弦值和夹角

```js
// 三角形的三个点坐标p1，p2，p3
var p1 = new THREE.Vector3(0, 0, 0); // 点1坐标
var p2 = new THREE.Vector3(20, 0, 0); // 点2坐标
var p3 = new THREE.Vector3(0, 40, 0); // 点3坐标

// p1，p2两个点确定一个向量
var v1 = p1.clone().sub(p2);
// p1，p3两个点确定一个向量
var v2 = p1.clone().sub(p3);
// .dot()计算两个向量点积    .length()计算向量长度
// 返回三角形顶点p1对应夹角余弦值
var CosineValue = v1.dot(v2) / (v1.length() * v2.length());

console.log('三角形两条边夹角余弦值', CosineValue);
// .acos()：反余弦函数，返回结果是弧度
console.log('三角形两条边夹角', (Math.acos(CosineValue) * 180) / Math.PI);
```
