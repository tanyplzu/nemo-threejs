---
title: Nginx 配置
order: 6
toc: 'content'
nav:
  title: 工程化
  order: 5
---

## 代理

```conf
server {
  listen       80;
  server_name  test.com;

  location / {
    proxy_pass http://127.0.0.1:8888;
    proxy_set_header Host $host;
}

server {
  listen       80;
  server_name  a.test.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}
```

- proxy_pass 转发的请求
- `$host` 每个请求带过来的 host 就是`$host`，也可以转发
- 用 host 区分我实际想访问哪个服务

## 缓存

```conf
proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;
```

- proxy_cache_path 是缓存的存放地址,cache 是相对路径目录
- 缓存路径，是否要创建二级文件夹
- my_cache 缓存的名字，可以设置大小

```conf
proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;
server {
  listen       80;
  server_name  test.com;
  location / {
    proxy_cache my_cache;
    proxy_pass http://127.0.0.1:8888;
    proxy_set_header Host $host;
  }
}
```

### 跟代理缓存有关的 http 头

- s-maxage 专门给代理缓存用的，如果同时设置了 max-age 和 s-maxage，会优先使用 s-maxage
- max-age 浏览器缓存
- 加 private 时 s-maxage 不会生效
- no-store 所有地方都不缓存
- Vary 头信息一致时缓存，比如中文、英文的场景

```js
// 服务端
response.writeHead(200, {
  'Cache-Control': 'max-age=2, s-maxage=20, private',
  Vary: 'X-Test-Cache',
});

// 客户端
var index = 0;
fetch('/data', {
  headers: {
    'X-Test-Cache': index++,
  },
});
```

## 前后端分离配置

antd pro 的配置[地址](https://pro.ant.design/docs/deploy-cn)

```shell
server {
  listen 80;
  # gzip config
  gzip on;
  gzip_min_length 1k;
  gzip_comp_level 9;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary on;
  gzip_disable "MSIE [1-6]\.";

  root /usr/share/nginx/html;

  location / {
    # 用于配合 browserHistory使用
    try_files $uri $uri/ /index.html;

    # 如果有资源，建议使用 https + http2，配合按需加载可以获得更好的体验
    # rewrite ^/(.*)$ https://preview.pro.ant.design/$1 permanent;
  }
  location /api {
    proxy_pass https://ant-design-pro.netlify.com;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   X-Real-IP         $remote_addr;
  }
}

server {
  # 如果有资源，建议使用 https + http2，配合按需加载可以获得更好的体验
  listen 443 ssl http2 default_server;

  # 证书的公私钥
  ssl_certificate /path/to/public.crt;
  ssl_certificate_key /path/to/private.key;

  location / {
    # 用于配合 browserHistory使用
    try_files $uri $uri/ /index.html;
  }
  location /api {
    proxy_pass https://ant-design-pro.netlify.com;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Host              $http_host;
    proxy_set_header   X-Real-IP         $remote_addr;
  }
}
```

```
server {
  listen  80;
  listen 443 ssl;
  server_name abc.com.cn;
  access_log  logs/access.log  main;
  error_log  logs/error.log;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For ...;
  proxy_pass_header Set-Cookie;

  if ($scheme = http) {
    return   301 https://$host$request_uri;
  }
  location / {
    proxy_set_header Host abc.com.cn;
    proxy_pass http://b;
  }
  location /api/ {
    proxy_set_header Host abc.com.cn;
    proxy_pass http://b;
  }
  location ~ /(.svn|.git|.bat|.log|.DS) {
    deny all;
  }
}
```

## 超时

请求如果超时，ngnix 或重新发起请求，导入超时时会引起重复数据问题；
