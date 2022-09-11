import { defineConfig } from 'dumi';

export default defineConfig({
  title: '朝花夕拾',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: false,
  outputPath: 'docs-dist',
  mode: 'site',
  // publicPath: '/nemo-threejs/',
  // base: '/nemo-threejs',
  publicPath: '/',
  base: '/',
  resolve: {
    includes: ['docs', 'src'],
  },
  theme: {},

  navs: [
    {
      title: '前端可视化',
      path: '/visualization',
    },
    {
      title: 'WebGL',
      path: '/webgl',
    },
    {
      title: 'ThreeJS',
      path: '/threejs',
    },
    {
      title: 'ThreeJS示例',
      path: '/threejs-demo',
    },
    {
      title: 'example',
      path: '/example',
    },
  ],
  menus: {
    '/visualization': [
      {
        title: 'canvas',
        children: ['/visualization/canvas/index.md'],
      },
      {
        title: 'Math',
        children: [
          '/visualization/math/index.md',
          '/visualization/math/数学基础.md',
        ],
      },
    ],
    '/webgl': [
      {
        title: 'WebGL 基础',
        children: [
          '/webgl/index.md',
          '/webgl/WebGL&Three/',
          '/webgl/example.md',
          '/webgl/buffer.md',
        ],
      },
    ],
    '/threejs': [
      {
        title: 'ThreeJS基础',
        children: [
          '/threejs/index.md',
          '/threejs/一个例子.md',
          '/threejs/api.md',
          '/threejs/Vector3_1.md',
          '/threejs/Vector3_2.md',
          '/threejs/类型化数组.md',
        ],
      },
    ],
    '/threejs-demo': [
      {
        title: 'ThreeJS基础',
        children: [
          '/threejs-demo/cube.md',
          '/threejs-demo/Rubiks-cube/index.md',
          '/threejs-demo/happy-birthday/index.md',
          '/threejs-demo/一个小场景.md',
        ],
      },
    ],
    '/example': [
      {
        title: '练习示例',
        children: ['/example/Vector3.md', '/example/threejsTest.md'],
      },
    ],
    '/learn': [
      {
        title: '《跟月影学可视化》',
        children: [
          '/learn/跟月影学可视化/index',
          '/learn/跟月影学可视化/图形基础篇',
          '/learn/跟月影学可视化/数学篇',
        ],
      },
      {
        title: '《WebGL 入门与实践》',
        children: ['/learn/webgl入门与实践/index'],
      },
    ],
  },
});
