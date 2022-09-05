import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Vector3 = () => {
  const [vec, setVet] = useState(null);

  useEffect(() => {
    setVet(() => {
      const vec1 = new THREE.Vector3(1, 2, 3);
      const vec2 = new THREE.Vector3(2, 3, 4);
      vec2.sub(vec1); //Vector3 {x: 1, y: 1, z: 1}
      return JSON.stringify(vec2);
    });
  }, []);

  return <div>{vec}</div>;
};

export default Vector3;
