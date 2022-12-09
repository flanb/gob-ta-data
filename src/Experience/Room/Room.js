import Experience from "../Experience.js";
import Environment from "./Environment.js";
import RoomDes from "./Rooms/RoomDes.js";
import RoomDev from "./Rooms/RoomDev.js";
import Doors from "./Doors.js";
import Android from "./Android.js";
import screen_time from "../../data/screen_time.json";
import Histogram from "./Histogram.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;

    this.debug = this.experience.debug;

    this.devicesObjects = [];
    this.PARAMS = {
      randomRangeX: 5,
      randomRangeZ: 32,
    };
    if (this.debug.active) this.setDebug();

    this.designer = screen_time.filter((d) => d.role === "Designer");
    this.developer = screen_time.filter((d) => d.role === "Developer");

    this.histogram = new Histogram(
      {
        x: -1,
        y: 10,
        z: 0,
      },
      this.designer
    );
    this.histogram1 = new Histogram(
      {
        x: -1,
        y: 10,
        z: 28,
      },
      this.developer
    );

    // Wait for resources
    this.resources.on("ready", () => {
      this.setPhones();

      this.roomDes = new RoomDes();
      this.doors = new Doors();
      this.roomDev = new RoomDev();
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
      this.android = new Android(
        {
          x:
            Math.random() * this.PARAMS.randomRangeX -
            this.PARAMS.randomRangeX / 2 +
            -3,
          y: 3.25,
          z:
            Math.random() * this.PARAMS.randomRangeZ -
            this.PARAMS.randomRangeZ / 2 +
            3,
        },
        des
      );
      this.devicesObjects.push(this.android);
    });

    this.developer.forEach((dev) => {
      this.android = new Android(
        {
          x:
            Math.random() * this.PARAMS.randomRangeX -
            this.PARAMS.randomRangeX / 2 -
            1,
          y: 3.25,
          z:
            Math.random() * this.PARAMS.randomRangeZ -
            this.PARAMS.randomRangeZ / 2 +
            58,
        },
        dev
      );
      this.devicesObjects.push(this.android);
    });
  }

  update() {
    this.devicesObjects.forEach((device) => {
      device.update();
    });
    if (this.doors) {
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
  }
}
