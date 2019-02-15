import * as THREE from "three";
import starSpectralColors from "./starSpectralColors";
import textures from "./images";
import { vertexShader, fragmentShader } from "./shaders";

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class FlyingThroughSpace {
  _background: THREE.Color;
  _paused: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this._background = new THREE.Color(1 / 256, 1 / 256, 24 / 256);
    this._paused = false;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let particles = 6000;
    let zMin = -2000;
    let zMax = 0;
    let time = Date.now() + 1.0;

    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 0);

    let scene = new THREE.Scene();

    let uniforms = {
      texture1: { value: textures.texture1 },
      texture2: { value: textures.texture2 },
      texture3: { value: textures.texture3 },
      texture4: { value: textures.texture4 },
      time: {
        type: "f",
        value: time,
      },
      width: {
        type: "f",
        value: width,
      },
      height: {
        type: "f",
        value: height,
      },
    };

    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: THREE.VertexColors,
    });

    let geometry = new THREE.BufferGeometry();
    let positions: number[] = [];
    let colors = [];
    let sizes = [];

    for (let i = 0; i < particles; i++) {
      positions.push(rand(-1, 1));
      positions.push(rand(-1, 1));
      positions.push(rand(zMin, zMax));
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

    scene.add(particleSystem);

    let renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(this._background, 1);

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        let newPosition = positions[i * 3 + 2] + 1;

        if (newPosition > zMax) {
          newPosition = zMin;
        }

        positions[i * 3 + 2] = newPosition;
      }

      geometry.attributes.position = new THREE.Float32BufferAttribute(
        positions,
        3,
      );

      time++;

      uniforms.time.value = time;

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", function() {
      width = window.innerWidth;
      height = window.innerHeight;

      uniforms.width.value = width;
      uniforms.height.value = height;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    animate();
  }

  start() {}

  stop() {}

  setState(paused: boolean) {}

  get background() {
    return this._background;
  }

  set background(color: THREE.Color) {
    this._background = color;
  }
}

export default FlyingThroughSpace;
