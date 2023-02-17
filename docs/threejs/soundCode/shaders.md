# shaders

shader中有三种类型的变量: `uniforms`, `attributes`, 和 `varyings`:

- Uniforms 是所有顶点都具有相同的值的变量。 比如灯光，雾，和阴影贴图就是被储存在uniforms中的数据。 uniforms可以通过顶点着色器和片元着色器来访问。

- Attributes 与每个顶点关联的变量。例如，顶点位置，法线和顶点颜色都是存储在attributes中的数据。attributes 只可以在顶点着色器中访问。

- Varyings 是从顶点着色器传递到片元着色器的变量。对于每一个片元，每一个varying的值将是相邻顶点值的平滑插值。
注意：在shader 内部，uniforms和attributes就像常量；你只能使用JavaScript代码通过缓冲区来修改它们的值。
