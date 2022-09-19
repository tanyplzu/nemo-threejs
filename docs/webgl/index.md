# webgl 基础

## GLSL：着色器

### 数据类型

- vec2：2 维向量容器。
- vec4：4 维向量容器。
- 运算法则：向量与向量、向量与浮点数的运算法则。

### 修饰符

- attribute：属性修饰符。
- uniform：全局变量修饰符。
- varying：顶点着色器传递给片元着色器的属性修饰符。

### precision：设置精度

- highp：高精度。
- mediump：中等精度。
- lowp：低精度。

### 内置变量

- gl_Position：顶点坐标。
- gl_FragColor：片元颜色。
- gl_PointSize：顶点大小。

### 屏幕坐标系到设备坐标系的转换。

- 屏幕坐标系左上角为原点，X 轴坐标向右为正，Y 轴坐标向下为正。

- 坐标范围：
  - X 轴：【0, canvas.width】
  - Y 轴：【0, canvas.height】
- 设备坐标系以屏幕中心为原点，X 轴坐标向右为正，Y 轴向上为正。
- 坐标范围是
  - X 轴：【-1, 1】。
  - Y 轴：【-1, 1】。

## WebGL API

### shader：着色器对象

- gl.createShader：创建着色器。
- gl.shaderSource：指定着色器源码。
- gl.compileShader：编译着色器。

### program：着色器程序

- gl.createProgram：创建着色器程序。
- gl.attachShader：链接着色器对象。
- gl.linkProgram：链接着色器程序。
- gl.useProgram：使用着色器程序。

### attribute：着色器属性

- gl.getAttribLocation：获取顶点着色器中的属性位置。
- gl.enableVertexAttribArray：启用着色器属性。
- gl.vertexAttribPointer：设置着色器属性读取 buffer 的方式。
- gl.vertexAttrib2f：给着色器属性赋值，值为两个浮点数。
- gl.vertexAttrib3f：给着色器属性赋值，值为三个浮点数。

### uniform：着色器全局属性

- gl.getUniformLocation：获取全局变量位置。
- gl.uniform4f：给全局变量赋值 4 个浮点数。
- gl.uniform1i：给全局变量赋值 1 个整数。

### buffer：缓冲区

- gl.createBuffer：创建缓冲区对象。
- gl.bindBuffer：将缓冲区对象设置为当前缓冲。
- gl.bufferData：向当前缓冲对象复制数据。

### clear：清屏

- gl.clearColor：设置清除屏幕的背景色。
- gl.clear：清除屏幕。

### draw：绘制

- gl.drawArrays：数组绘制方式。
- gl.drawElements：索引绘制方式。

### 图元

- gl.POINTS：点。
- gl.LINE：基本线段。
- gl.LINE_STRIP：连续线段。
- gl.LINE_LOOP：闭合线段。
- gl.TRIANGLES：基本三角形。
- gl.TRIANGLE_STRIP：三角带。
- gl.TRIANGLE_FAN：三角扇。

### 纹理

- gl.createTexture：创建纹理对象。
- gl.activeTexture：激活纹理单元。
- gl.bindTexture：绑定纹理对象到当前纹理。
- gl.texImage2D：将图片数据传递给 GPU。
- gl.texParameterf：设置图片放大缩小时的过滤算法。
