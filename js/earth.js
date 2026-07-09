(function () {
  "use strict";

  /* =========================================================
   * ✅ 全局可调参数区（只改这里）
   * ========================================================= */

  // ---------- 地球姿态 ----------
  const EARTH_LONGITUDE_OFFSET_DEG = 100;
  const AXIAL_TILT_DEG = 0;
  const ROTATION_SPEED = 0.0023;

  // ---------- 地球尺度 ----------
  const BASE_RADIUS = 7;
  const ZOOM = 1.25;

  // ---------- 地球位置 ----------
  const EARTH_POS_X = 3;
  const EARTH_POS_Y = -3;

  // ---------- ✅ 地球视觉 ----------
  const EARTH_BRIGHTNESS = 0.86; // ✅ 0.3（暗）～0.8（亮）
  const EARTH_OPACITY = 1.0;

  /* =========================================================
   * ⚠️ 以下为逻辑区，原则上不再需要修改
   * ========================================================= */

  const canvas = document.getElementById("earth-canvas");
  if (!canvas) return;

  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none";

  const scene = new THREE.Scene();

  const viewSize = 5 / ZOOM;
  const aspect = window.innerWidth / window.innerHeight;

  const camera = new THREE.OrthographicCamera(
    (-viewSize * aspect) / 2,
    (viewSize * aspect) / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const loader = new THREE.TextureLoader();
  loader.load("./images/earth.jpg", (texture) => {
    const EARTH_RADIUS = BASE_RADIUS / ZOOM;

    // ✅ 可控亮度材质
    const earthMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: new THREE.Color().setScalar(EARTH_BRIGHTNESS),
      transparent: EARTH_OPACITY < 1,
      opacity: EARTH_OPACITY,
    });

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 64, 64),
      earthMaterial
    );

    earth.position.set(
      EARTH_POS_X,
      EARTH_POS_Y,
      -EARTH_RADIUS
    );

    earth.rotation.x = THREE.MathUtils.degToRad(AXIAL_TILT_DEG);
    earth.rotation.y = THREE.MathUtils.degToRad(EARTH_LONGITUDE_OFFSET_DEG);

    scene.add(earth);

    console.log("🌏 Earth config loaded:");
    console.log("   - Brightness:", EARTH_BRIGHTNESS);
    console.log("   - Radius:", EARTH_RADIUS);
    console.log("   - Position:", earth.position);

    (function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += ROTATION_SPEED;
      renderer.render(scene, camera);
    })();
  });

  window.addEventListener("resize", () => {
    const a = window.innerWidth / window.innerHeight;
    camera.left = (-viewSize * a) / 2;
    camera.right = (viewSize * a) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
})();
