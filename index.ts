import {vec3, mat4} from 'gl-matrix'
import SoftwareRenderer from "./src/rendering/SoftwareRenderer"
import Mesh, { CubeMesh } from './src/objectdata/Mesh'
import Camera from './src/rendering/Camera'

import {BabylonJson} from './src/objectdata/BabylonUtils'

async function getObj(path) {
    let res = await fetch(path)
    let data = await res.json()
    return data
}

class  SR extends SoftwareRenderer {

    camera: Camera

    cube2: Mesh

    constructor() {
        super()

        this.cube2 = new Mesh()

        let obj: BabylonJson
        getObj('./objs/suzanne.babylon')
        .then( data => 
            {
                obj = data;
                this.cube2.fromJson(obj)
            })


        this.camera = new Camera(70, 0.1, 100)

        this.cube2.transform.translate(
            vec3.fromValues(0, 0, 5)
        )

    }

    render() {


        let rotationX = this.timer.getDeltaTimeMs()
        let rotationY = this.timer.getDeltaTimeMs()
        let rotationZ = this.timer.getDeltaTimeMs() * 0.5



        this.cube2.transform.rotate(
            rotationX,
            rotationY,
            rotationZ
        )
    
        this.renderer.drawMesh(this.cube2, this.camera)
    }
}

new SR()