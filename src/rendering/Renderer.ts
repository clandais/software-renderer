
import { vec3, mat4 } from 'gl-matrix'
import SoftwareRenderer from './SoftwareRenderer'
import Mesh from '../objectdata/Mesh'
import Camera from './Camera'

export default class Renderer {
    
    sr: SoftwareRenderer
    backBuffer: ImageData

    constructor(sr: SoftwareRenderer) {
        this.sr = sr
        this.backBuffer = this.sr.ctx.createImageData(this.sr.canvas.width, this.sr.canvas.height)
    }

    clear() {
        
        for (let i = 0; i < this.backBuffer.data.length; i += 4) {
            this.backBuffer.data[i] = 0
            this.backBuffer.data[i + 1] = 0
            this.backBuffer.data[i + 2] = 0
            this.backBuffer.data[i + 3] = 255 // alpha

        }
    }

    putPixel(x:number, y:number, z:number, color:number) {

        x = x >> 0
        y = y >> 0

        if (x < 0 || y < 0 || x > this.sr.canvas.width || y > this.sr.canvas.height) return 

        this.backBuffer.data[ (x + y * this.sr.canvas.width) * 4] = color >>16
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 1] = (color >> 8) & 0x00FF
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 2] = color & 0x0000FF
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 3] = 255
    }


    drawPoint(v: vec3, color:number) {
    
        this.putPixel(
            v[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2 , 
            v[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2,
            v[2],
            color)
    }

    /**
     * Draw a lien with bresenham's algorithm
     * @param p1
     * @param p2 
     * @param color 
     */
    drawLine(p1: vec3, p2: vec3, color: number) {
        
        let x0 = (p1[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2) >> 0
        let y0 = (p1[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2) >> 0
        let x1 = (p2[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2) >> 0
        let y1 = (p2[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2) >> 0

        let dx = Math.abs(x1 - x0)
        let dy = Math.abs(y1 - y0)
        
        let sx = (x0 < x1) ? 1 : -1
        let sy = (y0 < y1) ? 1 : -1

        let err = dx - dy

        while (true) {

            this.putPixel(x0, y0, 0, color)
            
            if ((x0 == x1) && (y0 == y1)) return

            let e2 = 2 * err

            if (e2 > -dy) {err -= dy; x0 += sx;}
            if (e2 < dx) {err += dx; y0 += sy}
        }
    }

    drawMesh(mesh: Mesh, cam: Camera): void {
        
        let v1 = vec3.create()
        let v2 = vec3.create()
        let v3 = vec3.create()

        let mat = mesh.transform.transform
        mat4.mul(mat, cam.proj, mat)


        mesh.faces.forEach( (face) => {

            vec3.transformMat4(v1, mesh.vertices[face.A] , mat)
            vec3.transformMat4(v2, mesh.vertices[face.B] , mat)
            vec3.transformMat4(v3, mesh.vertices[face.C] , mat)

            this.drawLine(v1, v2, 0xFFFFFF)
            this.drawLine(v2, v3, 0xFFFFFF)
            this.drawLine(v3, v1, 0xFFFFFF)

        })
        /*
        for (let i = 0; i < mesh.vertices.length - 1; i++) {

            vec3.transformMat4(out1,mesh.vertices[i] , mat)
            vec3.transformMat4(out2,mesh.vertices[i+1] , mat)

            this.drawLine(out1, out2, 0xFFFFFF)
        }
        */
    }

    flip(): void {
        this.sr.ctx.putImageData(this.backBuffer, 0, 0)
    }

}