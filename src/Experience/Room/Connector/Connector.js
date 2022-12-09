import * as THREE from "three";
import Experience from "../../Experience";
import vertexShader from "./vertex.glsl";
import noise from "/src/Experience/Utils/noise.glsl";
import fragmentShader from "./fragment.glsl";

export default class Connector {
  constructor(_points, _color, _weight) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.bezierPoints = [
      _points[0].clone().add(new THREE.Vector3(0, 2, 0)),
      _points[1].clone().add(new THREE.Vector3(0, -2, 0)),
    ];

    this.points = _points;
    this.color = _color;
    this.weight = _weight;

    this.PARAMS = {
      waveIntensity: 0.01,
      waveSpeed: 0.001,
      waveFrequency: 2,
      noiseIntensity: 0.02,
      noiseSpeed: 0.001,
      noiseFrequency: 2,
      uRandom: Math.random(),
    };

    // if (this.debug.active) this.setDebug();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setLight();
  }

  setDebug() {
    this.debugFolder = this.debug.gui.addFolder({
      title: "connector",
      expanded: false,
    });
    this.debugFolder.addInput(this, "color", {
      color: { type: "float" },
      picker: "inline",
      expanded: true,
    });
    this.bezierPoints.forEach((point, index) => {
      const bezierFolder = this.debugFolder.addFolder({
        title: `bezier point ${index}`,
        expanded: false,
      });
      bezierFolder
        .addInput(point, "x", { min: -10, max: 10, step: 0.1 })
        .on("change", this.updateGeometry.bind(this));
      bezierFolder
        .addInput(point, "y", { min: -10, max: 10, step: 0.1 })
        .on("change", this.updateGeometry.bind(this));
      bezierFolder
        .addInput(point, "z", { min: -10, max: 10, step: 0.1 })
        .on("change", this.updateGeometry.bind(this));
    });

    this.points.forEach((point, index) => {
      const pointFolder = this.debugFolder.addFolder({
        title: `point ${index}`,
        expanded: false,
      });
      pointFolder
        .addInput(point, "x", { min: -10, max: 10, step: 1 })
        .on("change", this.updateGeometry.bind(this));
      pointFolder
        .addInput(point, "y", { min: -10, max: 10, step: 1 })
        .on("change", this.updateGeometry.bind(this));
      pointFolder
        .addInput(point, "z", { min: -10, max: 10, step: 1 })
        .on("change", this.updateGeometry.bind(this));
    });

    this.debugFolder
      .addInput(this.PARAMS, "waveIntensity", {
        min: 0,
        max: 0.1,
        step: 0.001,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uWaveIntensity.value = value;
      });
    this.debugFolder
      .addInput(this.PARAMS, "waveSpeed", {
        min: 0,
        max: 0.1,
        step: 0.001,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uWaveSpeed.value = value;
      });
    this.debugFolder
      .addInput(this.PARAMS, "waveFrequency", {
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uWaveFrequency.value = value;
      });
    this.debugFolder
      .addInput(this.PARAMS, "noiseIntensity", {
        min: 0,
        max: 0.1,
        step: 0.001,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uNoiseIntensity.value = value;
      });
    this.debugFolder
      .addInput(this.PARAMS, "noiseSpeed", {
        min: 0,
        max: 0.1,
        step: 0.001,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uNoiseSpeed.value = value;
      });
    this.debugFolder
      .addInput(this.PARAMS, "noiseFrequency", {
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", ({ value }) => {
        this.material.uniforms.uNoiseFrequency.value = value;
      });
  }

  setLight() {
    this.light = new THREE.PointLight(this.color, this.weight * 0.2);
    this.light.position.copy(
      new THREE.Vector3(
        this.points[0].x - this.points[1].x,
        5,
        this.points[0].z - this.points[1].z
      )
    );
    this.scene.add(this.light);
  }
  setGeometry() {
    const curve = new THREE.CubicBezierCurve3(
      this.points[0],
      this.bezierPoints[0],
      this.bezierPoints[1],
      this.points[1]
    );


    this.geometry = new THREE.TubeGeometry(
      curve,
      32,
      0.002 * this.weight,
      8,
      false
    );
  }

  updateGeometry() {
    this.geometry.dispose();
		this.light.dispose()
    this.setGeometry();
    this.mesh.geometry = this.geometry;
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: this.color },
        uTime: { value: 0.0 },
        uWaveIntensity: { value: this.PARAMS.waveIntensity },
        uWaveSpeed: { value: this.PARAMS.waveSpeed },
        uWaveFrequency: { value: this.PARAMS.waveFrequency },
        uNoiseIntensity: { value: this.PARAMS.noiseIntensity },
        uNoiseSpeed: { value: this.PARAMS.noiseSpeed },
        uNoiseFrequency: { value: this.PARAMS.noiseFrequency },
        uRandom: { value: this.PARAMS.uRandom },
      },
      vertexShader: noise + vertexShader,
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

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
		this.light.dispose()
    this.scene.remove(this.mesh);
  }
}
