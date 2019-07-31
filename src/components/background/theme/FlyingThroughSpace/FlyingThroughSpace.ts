import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
import textures from "./images";
import { vertexShader, fragmentShader } from "./shaders";
import starSpectralColors from "./starSpectralColors";

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class FlyingThroughSpace {
  _background: THREE.Color;
  _paused: boolean;
  _isAnimating: boolean;
  _width: number;
  _height: number;
  _uniforms: {
    texture1: { value: THREE.Texture };
    texture2: { value: THREE.Texture };
    texture3: { value: THREE.Texture };
    texture4: { value: THREE.Texture };
    time: {
      type: string;
      value: number;
    };
    width: {
      type: string;
      value: number;
    };
    height: {
      type: string;
      value: number;
    };
  };
  _lastTime: number;
  _time: number;
  _distancePerSecond: number;
  _particles: number;
  _zMin: number;
  _zMax: number;
  _camera: THREE.PerspectiveCamera;
  _renderer: THREE.WebGLRenderer;
  _scene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement) {
    this._background = new THREE.Color(1 / 256, 1 / 256, 24 / 256);
    this._paused = false;
    this._isAnimating = false;
    this._time = 0.0;
    this._lastTime = Date.now();
    this._distancePerSecond = 200;
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._particles = 10000;
    this._zMin = -2;
    this._zMax = 0;

    // let camera = new THREE.PerspectiveCamera(45, this._width / this._height, 1, 10000);
    this._camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    this._camera.position.set(0, 0, 0);

    this._scene = new THREE.Scene();

    this._uniforms = {
      texture1: { value: textures.texture1 },
      texture2: { value: textures.texture2 },
      texture3: { value: textures.texture3 },
      texture4: { value: textures.texture4 },
      time: {
        type: "f",
        value: this._time,
      },
      width: {
        type: "f",
        value: this._width,
      },
      height: {
        type: "f",
        value: this._height,
      },
    };

    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: THREE.VertexColors,
    });

    let geometry = new THREE.BufferGeometry();
    let positions: number[] = [];
    let colors: number[] = [];
    let sizes: number[] = [];

    for (let i = 0; i < this._particles; i++) {
      positions.push(rand(-1, 1));
      positions.push(rand(-1, 1));
      positions.push(rand(this._zMin, this._zMax));
      sizes.push(32);

      let spectralColor = starSpectralColors[i % 512];

      colors.push(spectralColor[0]);
      colors.push(spectralColor[1]);
      colors.push(spectralColor[2]);
    }

    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    geometry.addAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true),
    );

    let particleSystem = new THREE.Points(geometry, shaderMaterial);

    this._scene.add(particleSystem);

    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });

    this._renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this._renderer.setSize(this._width, this._height);
    this._renderer.setClearColor(this._background, 1);

    window.addEventListener("resize", this._resize);

    THREE.DefaultLoadingManager.onLoad = () => {
      this._render();
    };

    this._t = 0;
  }

  _t: number;

  _animate = () => {
    if (this._isAnimating) {
      requestAnimationFrame(this._animate);
      this._render();
    }
  };

  _resize = () => {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._uniforms.width.value = this._width;
    this._uniforms.height.value = this._height;

    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();

    this._renderer.setSize(this._width, this._height);
  };

  _render = () => {
    const now = Date.now();
    const dt = now - this._lastTime;
    this._lastTime = now;

    this._time += this._distancePerSecond * (dt / 1000);

    this._uniforms.time.value = this._time;

    this._renderer.render(this._scene, this._camera);
  };

  start = () => {
    if (this._isAnimating === false) {
      this._isAnimating = true;
      this._animate();
    }
  };

  stop = () => {
    this._isAnimating = false;
  };

  render = () => {
    this._render();
  };
}

export default FlyingThroughSpace;
