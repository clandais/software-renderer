import { mat4 } from "gl-matrix"

export default class Camera {

    proj: mat4

    constructor(fov: number, aspectRatio: number, near: number, far: number) {

        this.proj = mat4.create()
        mat4.perspective(this.proj, fov, aspectRatio, near, far)
    }
}