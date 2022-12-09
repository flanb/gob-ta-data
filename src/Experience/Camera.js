import Experience from "./Experience.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug

    this.setInstance();
    this.travalPath();
    this.setOrbitControls();

    this.progressPosition = 0
    this.progressLookAt = 0
    this.easingValue = 0.2
    this.startAnimation = false

    if(this.debug.active) {
      this.debug.gui.addButton({ title: "Start Animation" })
      .on("click", () => {
        this.startAnimation = true;
      })
    }



  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      10,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.instance.position.set(40, 40, -40);
    this.scene.add(this.instance);
  }

  travalPath() {
    if (this.debug.active) {

      this.mesh = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
      this.mesh.position.set(0, 1, -2)

      this.scene.add(this.mesh)
    }
  }

  travelUpdateLeft() {
    this.instance.lookAt(this.mesh.position)
    gsap.to(this.instance.position, {
      x: 40, y: 40, z: 40, duration: 4 * 20, ease: "power2.inout",
    })
    gsap.to(this.mesh.position, {x: -0.5, y: 1, z: 12, duration: 4 * 20, ease: "power2.inout"})
  }

  travelUpdateRight() {
    this.instance.lookAt(this.mesh.position)
    gsap.to(this.instance.position, {
      x: 40, y: 40, z: -40, duration: 4 * 20, ease: "power2.inout",
    })
    gsap.to(this.mesh.position, {x: 0, y: 1, z: -2, duration: 4 * 20, ease: "power2.inout"})
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true; // move smoothly
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
    
    if (this.startAnimation) {
      this.travelUpdate()
    }
  }
}
