// import './adapter/index.js'
import Main from './js/main';
import React, { useRef, useEffect } from 'react';

const HelloThreejs = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      new Main(canvasRef.current);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} />;
};

export default HelloThreejs;
