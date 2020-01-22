
export interface IMesh {

    id: string
    indices: Array<number>
    normals: Array<number>
    positions: Array<number>
}

export interface BabylonJson {

    autoClear: boolean
    meshes: Array<IMesh>

}
