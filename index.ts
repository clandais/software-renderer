import {vec3, mat4} from 'gl-matrix'
import SoftwareRenderer from "./src/rendering/SoftwareRenderer"
import Mesh, { CubeMesh } from './src/objectdata/Mesh'
import Camera from './src/rendering/Camera'
import Scene from './src/rendering/Scene'
import {BabylonJson} from './src/objectdata/BabylonUtils'
import Timer from './src/utils/Timer'

async function getObj(path) {
    let res = await fetch(path)
    let data = await res.json()
    return data
}

class  SR extends SoftwareRenderer {

    //camera: Camera

   // cube2: Mesh

    scene: Scene

    constructor() {
        super()

        this.scene = new Scene(this)

        let cube2 = new Mesh()

        this.scene.addMesh(cube2)

        let cube3 = new Mesh()
        this.scene.addMesh(cube3)

        let obj: BabylonJson
        getObj('./objs/suzanne.babylon')
        .then( data => 
            {
                obj = data;
                cube2.fromJson(obj)
                cube3.fromJson(obj)
            })

        

        cube3.transform.translate(
            vec3.fromValues(3, 0, -10)
        )
        

        cube2.transform.translate(
            vec3.fromValues(0, 0, -5)
        )

        
        cube2.update = function(timer: Timer) {
            let rotationX = timer.getDeltaTimeMs()
            let rotationY = timer.getDeltaTimeMs()
            let rotationZ = timer.getDeltaTimeMs() * 0.5
    
    
    
            this.transform.rotate(
                rotationX,
                rotationY,
                rotationZ
            )
        }

        cube3.update = function(timer: Timer) {
            let rotationX = -timer.getDeltaTimeMs()
            let rotationY = -timer.getDeltaTimeMs()
            let rotationZ = -timer.getDeltaTimeMs() * 0.5
    
    
    
            this.transform.rotate(
                rotationX,
                rotationY,
                rotationZ
            )
        }

    }

    render() {


        this.scene.objects.forEach( o => {
            o.update(this.timer)
        })
    
        this.scene.render(this)
    }
}

new SR()