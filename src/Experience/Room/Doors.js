import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";
import EventEmitter from "../Utils/EventEmitter.js";

export default class Doors extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.camera = this.experience.camera.instance
    
    console.log(`Doors loaded in ${this.experience.time.elapsed}ms`)
    this.currentIntersect = null

    this.isClicked = false

    this.resource = this.resources.items.doors

    this.setModel()
    this.setRaycaster()
    this.setPointLight()
  }

  setModel() {

    this.plane = new THREE.PlaneGeometry(2.5, 2.1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0})
    this.mesh = new THREE.Mesh(this.plane, this.material)
    this.mesh.position.set(-.15, 1.4, 5.75)
    this.mesh.rotation.z = -Math.PI / 2

    this.modelLeft = this.resources.items.door_left.scene
    this.modelRight = this.resources.items.door_right.scene
    this.group = [this.modelLeft, this.modelRight]

    this.modelLeft.scale.set(0.2, 0.2, 0.2)
    this.modelRight.scale.set(0.2, 0.2, 0.2)

    this.scene.add(this.modelLeft, this.modelRight, this.mesh)
    this.mesh.name = "door"

    gsap.set(this.modelLeft.position, {x: 0, y: 0, z: 0})
    gsap.set(this.modelRight.position, {x: 0, y: 0, z: 0})
  }

  setRaycaster() {
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    })
  }

  setPointLight() {
    this.pointLight = new THREE.PointLight("#ffffff", 1, 2, 2);
    this.pointLight.position.set(0, 2, -2);
    this.scene.add(this.pointLight);

    //point light helper
    this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.1);
    this.scene.add(this.pointLightHelper);
  }

  update() {
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersect = this.raycaster.intersectObject(this.mesh);

    if (this.intersect.length) {
      if (this.currentIntersect) {

        if (this.currentIntersect.object.name === "door") {
          gsap.to(this.modelLeft.position, {x: 1, y: 0, z: 0, duration: 0.5, ease: "power2.out"})
          gsap.to(this.modelRight.position, {x: -1, y: 0, z: 0, duration: 0.5, ease: "power2.out"})

          window.addEventListener('click', () => {
            this.isClicked = true
          })
        }
      }
      this.currentIntersect = this.intersect[0]
    }
    else {
      gsap.to(this.modelLeft.position, {x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.out"})
      gsap.to(this.modelRight.position, {x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.out"})

      this.currentIntersect = null
    }

    if (this.isClicked) {
      this.trigger('doorsOpen')
    }
  }
}
