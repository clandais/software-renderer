import Timer from "../utils/Timer"
import Renderer from "./Renderer"
import { vec3 } from "gl-matrix"

export default class SoftwareRenderer {

    timer: Timer
    renderer: Renderer
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    
    
    constructor() {
        
        this.canvas = document.getElementById('sr') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')
        this.renderer = new Renderer(this)

        this.timer = new Timer()

        requestAnimationFrame(this.update.bind(this))

    }


    render() {}

    update(time: number) {

        let v = vec3.fromValues(.9,.9,0)

        this.timer.update(time)
        this.renderer.clear()

        this.render()

        //this.renderer.drawPoint(v, 0xFFFFFF)

        this.renderer.flip()

        document.getElementById('dt').innerText = this.timer.getDeltaTimeMs().toString().substr(0, 5)
        document.getElementById('fps').innerText = this.timer.getFPS().toString()

        requestAnimationFrame(this.update.bind(this))
    }
}