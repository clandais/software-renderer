export namespace MathS {
 
    // Clamping values to keep them between 0 and 1
    export function clamp(value: number, min: number = 0, max: number = 1): number {
        return Math.max(min, Math.min(value, max));
    }

    // Interpolating the value between 2 vertices 
    // min is the starting point, max the ending point
    // and gradient the % between the 2 points
    export function interpolate(min: number, max: number, gradient: number) {
        return min + (max - min) * this.clamp(gradient);
    }

}