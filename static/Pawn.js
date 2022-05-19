class Pawn extends THREE.Mesh {

    constructor(color, x, y) {
        const geometry = new THREE.CylinderGeometry(6, 6, 3, 16)
        const material = new THREE.MeshBasicMaterial({
            wireframe: false,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load(color === "white" ? './textures/whitewood.jpg' : './textures/redwood.jpg'), // plik tekstury
        })

        //this.cube = new THREE.Mesh(geometry, material);
        super(geometry, material) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.col = color
        this.x = x
        this.y = y
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }
    getPos() {
        return { x: this.x, y: this.y }
    }
    setID(id) {
        this.pawnID = id
    }
    setPosition(x, y, z) {
        this.position.set(x, y, z)
    }
    getColor() {
        return this.col
    }
    getType() {
        return "pawn"
    }
}

export default Pawn