import { vec3, mat4, quat } from "gl-matrix";
import Face from "./Face";
import Transform from "./Transform";
import { BabylonJson } from "./BabylonUtils";
import Timer from "../utils/Timer";

export default class Mesh {

    vertices: Array<vec3>
    faces: Array<Face>
    
    transform: Transform
    


    constructor() {

        this.vertices = []
        this.faces = []
        this.transform = new Transform()
    }

    fromJson(json: BabylonJson) {

        let mesh = json.meshes[0]

        for (let i = 0; i < mesh.positions.length; i +=3) {
            this.vertices.push(
                vec3.fromValues(
                    mesh.positions[i],
                    mesh.positions[i + 1],
                    mesh.positions[i + 2],
                )
            )
        }

        for (let i = 0; i < mesh.indices.length; i+=3) {
            this.faces.push(
                {A: mesh.indices[i], B: mesh.indices[i + 1], C: mesh.indices[i + 2]}
            )
        }

    }

    update(timer: Timer) {

    }

}

export class CubeMesh extends Mesh {
    
    constructor() {
        super()
        
        this.vertices = [

            vec3.fromValues(1, 1, -1),
            vec3.fromValues(1, -1, -1),
            vec3.fromValues(1, 1, 1),
            vec3.fromValues(1, -1, 1),
            
            vec3.fromValues(-1, 1, -1),
            vec3.fromValues(-1, -1, -1),
            vec3.fromValues(-1, 1, 1),
            vec3.fromValues(-1, -1, 1),
      ]

      this.faces = [
          {A: 5, B: 3, C: 1},
          {A: 3, B: 8, C: 4},
          {A: 7, B: 6, C: 8},
          {A: 2, B: 8, C: 6},

          {A: 1, B: 4, C: 2},
          {A: 5, B: 2, C: 6},
          {A: 5, B: 7, C: 3},
          {A: 3, B: 7, C: 8},

          {A: 7, B: 5, C: 6},
          {A: 2, B: 4, C: 8},
          {A: 1, B: 3, C: 4},
          {A: 5, B: 1, C: 2},
      ]
        
    }
}