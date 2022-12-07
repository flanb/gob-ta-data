import * as THREE from "three";
import Experience from "../../Experience";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export default class Connector {
  constructor(_points, _color) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.bezierPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];

    this.points = _points;
    this.color = _color;

    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Connector");
      this.debugFolder.addColor(this, "color");
      this.bezierPoints.forEach((point, index) => {
      const bezierFolder = this.debugFolder.addFolder(`Bezier ${index}`);
        bezierFolder.add(point, "x", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
        bezierFolder.add(point, "y", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
        bezierFolder.add(point, "z", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
      });

      this.points.forEach((point, index) => {
        const pointFolder = this.debugFolder.addFolder(`Point ${index}`);
        pointFolder.add(point, "x", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
        pointFolder.add(point, "y", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
        pointFolder.add(point, "z", -1, 1, 0.01).onChange(() => {
          this.updateGeometry();
        });
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    const curve = new THREE.CubicBezierCurve3(
      this.points[0],
      this.bezierPoints[0],
      this.bezierPoints[1],
      this.points[1]
    );

    this.geometry = new THREE.TubeGeometry(curve, 128, 0.01, 8, false);
  }

  updateGeometry() {
    this.geometry.dispose();
    this.setGeometry();
    this.mesh.geometry = this.geometry;
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: this.color },
        uTime: { value: 0.0 },
      },
      vertexShader,
      fragmentShader,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.time.elapsed;
  }
}
