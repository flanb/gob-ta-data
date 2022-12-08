import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Connector from "./Connector/Connector.js";
import * as THREE from "three";
import RoomDes from "./Rooms/RoomDes.js";
import RoomDev from "./Rooms/RoomDev.js";
import Doors from "./Doors.js"
// import files for 3D objects

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;

    this.cameraMoved = false;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      // instantiate 3D objects before the environment
      this.roomDes = new RoomDes();
      this.doors = new Doors();
      this.roomDev = new RoomDev();
      this.environment = new Environment();

    });
  }

  update() {
    // Can updtate 3D objects here
    // check if the this.element is visible
    if(this.doors) {
      this.doors.update();

      this.doors.on("doorsOpen", () => {
        // if(this.cameraMoved === false){
        //   this.camera.travelUpdateLeft();
        //   this.cameraMoved = true;
        // }
        this.camera.travelUpdateLeft();
        // this.camera.travelUpdateRight();
      });
    }
    // this.connector.update();
  }
}
