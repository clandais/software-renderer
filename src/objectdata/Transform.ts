import { mat4, quat, vec3 } from "gl-matrix"

export default class Transform {

    private _transform: mat4
    
    get transform(): mat4 {
        mat4.identity(this._transform)

        mat4.fromQuat(this.rotationMatrix, this.rotation)
        mat4.mul(this._transform, this.rotationMatrix, this._transform)
        
        mat4.mul(this._transform, this.translation, this._transform)
        return this._transform
    }
    
    rotationMatrix: mat4
    rotation: quat
    translation: mat4

    constructor() {
        this._transform = mat4.create()
        mat4.identity(this._transform)

        this.rotationMatrix = mat4.create()
        mat4.identity(this.rotationMatrix)

        this.rotation = quat.create()
        quat.identity(this.rotation)

        this.translation = mat4.create()
        mat4.identity(this.translation)
    }

    rotate(x: number, y: number, z: number) {
        
        quat.rotateX(this.rotation, this.rotation, x)
        quat.rotateY(this.rotation, this.rotation, y)
        quat.rotateZ(this.rotation, this.rotation, z)
    }

    
    translate(trans: vec3) {
        mat4.mul(this.translation, this.translation, mat4.fromTranslation(mat4.create(), trans))
    }

}