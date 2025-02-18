# WebGL 例子

## 动态绘制

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>动态绘制点</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../css/common.css" />
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <div class="tips">点击屏幕试一下</div>

    <script type="shader-source" id="vertexShader">
      //浮点数设置为中等精度
      precision mediump float;
      //接收 JavaScript 传递过来的点的坐标（X, Y）
      attribute vec2 a_Position;
      // 接收canvas的尺寸。
      attribute vec2 a_Screen_Size;
      void main(){
        // 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
        vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
        // canvas的 Y 轴坐标方向和 设备坐标系的相反。
        position = position * vec2(1.0, -1.0);
        // 最终的顶点坐标。
        gl_Position = vec4(position, 0.0, 1.0);
        // 点的大小。
        gl_PointSize = 10.0;
      }
    </script>

    <script type="shader-source" id="fragmentShader">
      //浮点数设置为中等精度
      precision mediump float;
      //全局变量，用来接收 JavaScript传递过来的颜色。
      uniform vec4 u_Color;
      void main(){
        // 将颜色处理成 GLSL 允许的范围[0， 1]。
        vec4 color = u_Color / vec4(255, 255, 255, 1);
        // 点的最终颜色。
        gl_FragColor = color;
      }
    </script>

    <script src="../utils/webgl-helper.js"></script>

    <script>
      //获取canvas
      let canvas = getCanvas('#canvas');

      //设置canvas尺寸为满屏
      resizeCanvas(canvas);

      //获取绘图上下文
      let gl = getContext(canvas);

      //创建定点着色器
      let vertexShader = createShaderFromScript(
        gl,
        gl.VERTEX_SHADER,
        'vertexShader',
      );

      //创建片元着色器
      let fragmentShader = createShaderFromScript(
        gl,
        gl.FRAGMENT_SHADER,
        'fragmentShader',
      );

      //创建着色器程序
      let program = createSimpleProgram(gl, vertexShader, fragmentShader);
      //使用该着色器程序
      gl.useProgram(program);

      //获取顶点着色器中的变量a_Position的位置。
      let a_Position = gl.getAttribLocation(program, 'a_Position');

      //获取顶点着色器中的变量a_Screen_Size的位置。
      let a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');

      //获取片元着色器中的变量u_Color的位置。
      let u_Color = gl.getUniformLocation(program, 'u_Color');

      //向顶点着色器的 a_Screen_Size 传递 canvas 尺寸信息。
      gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

      //存储区顶点信息的容器
      let points = [];

      canvas.addEventListener('click', e => {
        let x = e.pageX;
        let y = e.pageY;
        let color = randomColor();

        //存储新的点的坐标和颜色。
        points.push({ x: x, y: y, color: color });
        render(gl);
      });

      //绘制函数
      function render(gl) {
        //清除屏幕
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let i = 0; i < points.length; i++) {
          let color = points[i].color;
          //向片元着色器传递颜色信息
          gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
          //向顶点着色器传递坐标信息。
          gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);
          //绘制点。
          gl.drawArrays(gl.POINTS, 0, 1);
        }
      }

      //设置屏幕清除颜色为黑色。
      gl.clearColor(0, 0, 0, 1.0);

      //绘制
      render(gl);

    </script>
  </body>
</html>
```

```js
// webgl-helper.js
var random = Math.random;
function randomColor() {
  return {
    r: random() * 255,
    g: random() * 255,
    b: random() * 255,
    a: random() * 1
  };
}

function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width) {
    canvas.width = width ? width : window.innerWidth;
  }
  if (canvas.height !== height) {
    canvas.height = height ? height : window.innerHeight;
  }
}

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  //检测是否编译正常。
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createShaderFromScript(gl, type, scriptId) {
  let sourceScript = $$('#' + scriptId);
  if (!sourceScript) {
    return null;
  }
  return createShader(gl, type, sourceScript.innerHTML);
}

function createSimpleProgram(gl, vertexShader, fragmentShader) {
  if (!vertexShader || !fragmentShader) {
    console.warn('着色器不能为空');
    return;
  }
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function $$(str) {
  if (!str) return null;
  if (str.startsWith('#')) {
    return document.querySelector(str);
  }
  let result = document.querySelectorAll(str);
  if (result.length == 1) {
    return result[0];
  }
  return result;
}
```

## 解释

### GLSL

- gl_Position： 内置变量，用来设置顶点坐标。
- gl_PointSize： 内置变量，用来设置顶点大小。
- vec2：2 维向量容器，可以存储 2 个浮点数。
- gl_FragColor： 内置变量，用来设置像素颜色。
- vec4：4 维向量容器，可以存储 4 个浮点数。
- precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
- 运算符：向量的对应位置进行运算，得到一个新的向量。
  - vec _浮点数： vec2(x, y)_ 2.0 = vec(x _2.0, y_ 2.0)。
  - vec2 _vec2：vec2(x1, y1)_ vec2(x2, y2) = vec2(x1 _x2, y1_ y2)。
  - 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec 向量，那么这两个 vec 的维数必须相同。

### JavaScript 程序如何连接着色器程序

- createShader：创建着色器对象
- shaderSource：提供着色器源码
- compileShader：编译着色器对象
- createProgram：创建着色器程序
- attachShader：绑定着色器对象
- linkProgram：链接着色器程序
- useProgram：启用着色器程序

### JavaScript 如何往着色器中传递数据

- getAttribLocation：找到着色器中的 attribute 变量地址。
- getUniformLocation：找到着色器中的 uniform 变量地址。
- vertexAttrib2f：给 attribute 变量传递两个浮点数。
- uniform4f：给 uniform 变量传递四个浮点数。

### WebGL 绘制函数

- drawArrays: 用指定的图元进行绘制。

### WebGL 图元

- gl.POINTS: 将绘制图元类型设置成点图元。
