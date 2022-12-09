import * as THREE from "three";
import Experience from "../Experience.js";
import social_network_colors from "../../data/social_network_colors.json";
import { Text } from "troika-three-text";
export default class Histogram {
  constructor(_position, _data) {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.position = _position;
    this.data = _data;

    this.group = new THREE.Group();

    this.allNetworks = Object.keys(social_network_colors);

    const allNetworksTime = {};

    this.allNetworks.forEach((network) => {
      allNetworksTime[network] = this.data.reduce((acc, d) => {
        if (d[network] !== undefined) {
          return acc + d[network];
        }
        return acc;
      }, 0);
    });

    const allNetworksTimeSorted = Object.entries(allNetworksTime).sort(
      (a, b) => b[1] - a[1]
    );

    allNetworksTimeSorted.forEach((network, index) => {
      const color = new THREE.Color(social_network_colors[network[0]]);
      this.setBar(
        {
          x: this.position.x,
          y: this.position.y,
          z: this.position.z - index,
        },
        color,
        network[1] / 1000
      );
      this.setText(
        {
          x: this.position.x,
          y: 1 + this.position.y + network[1] / 1000,
          z: this.position.z - index,
        },
        color,
        network[0]
      );
    });

    this.group.position.set(this.position.x, this.position.y, this.position.z);
    this.group.scale.set(0.4, 0.4, 0.4);
    this.scene.add(this.group);
  }

  setLight(_position, _color) {
    this.light = new THREE.PointLight(new THREE.Color(_color), 1);
    this.light.position.set(_position.x, _position.y, _position.z);
    this.group.add(this.light);
  }

  setBar(_position, _color, _weight) {
    this.geometry = new THREE.BoxGeometry(1, _weight, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(_color),
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(
      _position.x,
      _position.y + _weight / 2,
      _position.z + this.allNetworks.length / 2
    );
    this.group.add(this.mesh);
  }
  setText(_position, _color, _text) {
    this.text = new Text();
    this.text.text = _text;
    this.text.fontSize = 0.75;
    this.text.color = new THREE.Color(_color);
    this.text.rotation.y = Math.PI / 2;
    this.text.rotation.x = Math.PI / 3;
    this.text.position.set(
      _position.x,
      _position.y,
      _position.z + this.allNetworks.length / 2 + 0.75 / 2
    );
    this.group.add(this.text);
  }
}
