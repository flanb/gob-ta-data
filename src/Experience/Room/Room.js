import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Connector from "./Connector/Connector.js";
import * as THREE from "three";
import RoomDes from "./RoomDes.js";
import Android from "./Android.js";
import screen_time from "../../data/screen_time.json";
// import files for 3D objects

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.devicesObjects = [];
    this.PARAMS = {
      randomRangeX: 5,
      randomRangeZ: 25,
    };
    if (this.debug.active) this.setDebug();

    this.designer = screen_time.filter((d) => d.role === "Designer");
    this.developer = screen_time.filter((d) => d.role === "Developer");

    // Wait for resources
    this.resources.on("ready", () => {
      this.setPhones();

      this.roomDes = new RoomDes();
      this.environment = new Environment();
    });
  }

  setDebug() {
    this.debugFolder = this.debug.gui.addFolder({
      title: "room",
    });
    //random range
    this.debugFolder.addInput(this.PARAMS, "randomRangeX").on("change", () => {
      this.devicesObjects.forEach((device) => {
        device.destroy();
      });
      this.setPhones();
    });
    this.debugFolder.addInput(this.PARAMS, "randomRangeZ").on("change", () => {
      this.devicesObjects.forEach((device) => {
        device.destroy();
      });
      this.setPhones();
    });
  }

  setPhones() {
    this.designer.forEach((des) => {
      this.android = new Android({
        x:
          Math.random() * this.PARAMS.randomRangeX -
          this.PARAMS.randomRangeX / 2 +
          -3,
        y: 3.25,
        z:
          Math.random() * this.PARAMS.randomRangeZ -
          this.PARAMS.randomRangeZ / 2,
      }, des);
      this.devicesObjects.push(this.android);
    });
  }

  update() {
    this.devicesObjects.forEach((device) => {
      device.update();
    });
  }
}
