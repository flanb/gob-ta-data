import * as THREE from "three";
import Experience from "../Experience.js";
import Connector from "./Connector/Connector.js";

export default class Android {
  constructor(_coords) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.android;

    this.coords = _coords;
    this.color = new THREE.Color(Math.random(), Math.random(), Math.random());

    this.setModel();
    this.setConnector();
  }

  setModel() {
    this.model = this.resource.scene.clone();
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.name = "android";
    this.model.position.set(this.coords.x, this.coords.y, this.coords.z);

    this.scene.add(this.model);
  }

  setConnector() {
    this.connector = new Connector(
      [
        new THREE.Vector3(this.coords.x, this.coords.y, this.coords.z),
        new THREE.Vector3(0, 10, 0),
      ],
      this.color
    );
  }

  update() {
    this.connector.update();
  }

  destroy() {
    this.connector.destroy();
    this.scene.remove(this.model);
  }
}
