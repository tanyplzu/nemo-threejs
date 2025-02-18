# webgl_lines_fat

```js
// Line2 ( LineGeometry, LineMaterial )
const geometry = new LineGeometry();
geometry.setPositions(positions);
geometry.setColors(colors);

matLine = new LineMaterial({
  color: 0xffffff,
  linewidth: 5, // in world units with size attenuation, pixels otherwise
  vertexColors: true,

  //resolution:  // to be set by renderer, eventually
  dashed: false,
  alphaToCoverage: true,
});

line = new Line2(geometry, matLine);
line.computeLineDistances();
line.scale.set(1, 1, 1);
scene.add(line);
```
