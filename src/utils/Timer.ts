export default class Timer {
    
    private lastTime: number = 0
    private deltaTime: number = 0

    private FPS: number = 0
    private accumulator: number = 0
    private frameCount: number = 0;

    private time: number = 0;

    constructor() {

    }

    update(time: number) {

        this.time = time

        this.deltaTime = time - this.lastTime
        this.lastTime = time

        this.accumulator += this.deltaTime
        this.frameCount += 1

        if (this.accumulator > 1000) {
            this.accumulator = 0
            this.FPS = this.frameCount
            this.frameCount = 0
        } 
    }

    getDeltaTimeMs(): number {
        return this.deltaTime/1000
    }

    getFPS(): number {
        return this.FPS
    }

    getTime(): number {
        return this.time
    }
} 