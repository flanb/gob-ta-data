import Experience from '../Experience.js'
import Environment from './Environment.js'
// import files for 3D objects

export default class Room
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // instantiate 3D objects before the environment

            this.environment = new Environment()
        })
    }

    update()
    {
        // Can updtate 3D objects here
        // check if the this.element is visible
    }
}