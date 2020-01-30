import Camera from "./Camera";
import SoftwareRenderer from "./SoftwareRenderer";
import Mesh from "../objectdata/Mesh";

export default class Scene {

    camera: Camera

    objects: Array<Mesh>

    constructor(sr: SoftwareRenderer) {
        this.camera = new Camera(70, sr.canvas.width/sr.canvas.height, 0.1, 100)
        this.objects = new Array<Mesh>()
    }

    addMesh(mesh: Mesh) {
        this.objects.push(mesh)
    }

    render(sr: SoftwareRenderer) {

        this.objects.forEach( o => {
            sr.renderer.drawMesh(o, this.camera)
        })
    }
}