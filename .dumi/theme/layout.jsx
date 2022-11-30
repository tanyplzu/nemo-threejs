import React from 'react';
import Layout from 'dumi-theme-default/src/layout';
import * as THREE from 'three';
import './layout.less';

export default ({ children, ...props }) => {
  window.THREE = THREE;
  return (
    <Layout {...props}>
      <>{children}</>
    </Layout>
  );
};
