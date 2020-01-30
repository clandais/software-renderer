
import { vec3, mat4 } from 'gl-matrix'
import SoftwareRenderer from './SoftwareRenderer'
import Mesh from '../objectdata/Mesh'
import Camera from './Camera'
import Face from '../objectdata/Face'
import { MathS } from '../MathS'

export default class Renderer {
    
    sr: SoftwareRenderer
    backBuffer: ImageData

    zBuffer: Array<number>

    constructor(sr: SoftwareRenderer) {
        this.sr = sr

        this.zBuffer = new Array<number>(this.sr.canvas.width * this.sr.canvas.height)
        this.zBuffer.fill(1000)
        this.backBuffer = this.sr.ctx.createImageData(this.sr.canvas.width, this.sr.canvas.height)

    }

    clear() {
        
        for (let i = 0; i < this.backBuffer.data.length; i += 4) {
            this.backBuffer.data[i] = 0
            this.backBuffer.data[i + 1] = 0
            this.backBuffer.data[i + 2] = 0
            this.backBuffer.data[i + 3] = 255 // alpha

        }

        this.zBuffer.fill(1000)
    }

    putPixel(x:number, y:number, z:number, color:number) {

        x = x >> 0
        y = y >> 0

        if (x < 0 || y < 0 || x > this.sr.canvas.width || y > this.sr.canvas.height) return 

        if (this.zBuffer[x + y * this.sr.canvas.width] < z) return 
        else this.zBuffer[x + y * this.sr.canvas.width] = z

        this.backBuffer.data[ (x + y * this.sr.canvas.width) * 4] = color >>16
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 1] = (color >> 8) & 0x00FF
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 2] = color & 0x0000FF
        this.backBuffer.data[(x + y * this.sr.canvas.width) * 4 + 3] = 255
    }


    drawPoint(v: vec3, color:number) {
    
        this.putPixel(
            v[0], 
            v[1],
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

            //this.drawWireFrame(v1, v2, v3)
            this.drawTriangle(v1, v2, v3, 0xFFFFFF)
        })
    }

    drawWireFrame(v1: vec3, v2: vec3, v3: vec3) {
        this.drawLine(v1, v2, 0xFFFFFF)
        this.drawLine(v2, v3, 0xFFFFFF)
        this.drawLine(v3, v1, 0xFFFFFF)
    }

    flip(): void {
        this.sr.ctx.putImageData(this.backBuffer, 0, 0)
    }


    /**
     * @see https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/
     * @param y 
     * @param pa 
     * @param pb 
     * @param pc 
     * @param pd 
     * @param color 
     */
    processScanLine(y: number, pa: vec3, pb: vec3, pc: vec3, pd: vec3, color: number): void {
        // Thanks to current Y, we can compute the gradient to compute others values like
        // the starting X (sx) and ending X (ex) to draw between
        // if pa.Y == pb.Y or pc.Y == pd.Y, gradient is forced to 1
        var gradient1 = pa[1] != pb[1] ? (y - pa[1]) / (pb[1] - pa[1]) : 1;
        var gradient2 = pc[1] != pd[1] ? (y - pc[1]) / (pd[1] - pc[1]) : 1;

        var sx = MathS.interpolate(pa[0], pb[0], gradient1)
        var ex = MathS.interpolate(pc[0], pd[0], gradient2)

        // drawing a line from left (sx) to right (ex) 
        for (var x = sx; x < ex; x++) {
            this.putPixel(x, y, 0, color);
        }
    }

    /**
     * @see https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/
     * @param p1 
     * @param p2 
     * @param p3 
     * @param color 
     */
    drawTriangle(p1: vec3, p2: vec3, p3: vec3, color: number): void {
        
        p1[0] = p1[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2
        p1[1] = p1[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2
        p2[0] = p2[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2
        p2[1] = p2[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2
        p3[0] = p3[0] * this.sr.canvas.width /2 + this.sr.canvas.width /2
        p3[1] = p3[1] * -this.sr.canvas.height/2 + this.sr.canvas.height /2
        

        // Sorting the points in order to always have this order on screen p1, p2 & p3
        // with p1 always up (thus having the Y the lowest possible to be near the top screen)
        // then p2 between p1 & p3
        
        if (p1[1] > p2[1]) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        if (p2[1] > p3[1]) {
            var temp = p2;
            p2 = p3;
            p3 = temp;
        }

        if (p1[1] > p2[1]) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        // inverse slopes
        var dP1P2: number; var dP1P3: number;

        // http://en.wikipedia.org/wiki/Slope
        // Computing slopes
        if (p2[1] - p1[1] > 0)
            dP1P2 = (p2[0] - p1[0]) / (p2[1] - p1[1]);
        else
            dP1P2 = 0;

        if (p3[1] - p1[1] > 0)
            dP1P3 = (p3[0] - p1[0]) / (p3[1] - p1[1]);
        else
            dP1P3 = 0;

        // First case where triangles are like that:
        // P1
        // -
        // -- 
        // - -
        // -  -
        // -   - P2
        // -  -
        // - -
        // -
        // P3
        
        if (dP1P2 > dP1P3) {
            for (var y = p1[1] >> 0; y <= p3[1] >> 0; y++) {
                if (y < p2[1]) {
                    this.processScanLine(y, p1, p3, p1, p2, color);
                } else {
                    this.processScanLine(y, p1, p3, p2, p3, color);
                }
            }
        }
        // First case where triangles are like that:
        //       P1
        //        -
        //       -- 
        //      - -
        //     -  -
        // P2 -   - 
        //     -  -
        //      - -
        //        -
        //       P3
    
        
        else {
            for (var y = p1[1] >> 0; y <= p3[1] >> 0; y++) {
                if (y < p2[1]) {
                    this.processScanLine(y, p1, p2, p1, p3, color);
                } else {
                    this.processScanLine(y, p2, p3, p1, p3, color);
                }
            }
        }
        
    }



}