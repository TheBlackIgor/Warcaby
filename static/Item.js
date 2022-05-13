class Item extends THREE.Mesh {

    constructor(color, x, y) {
        const geometry = new THREE.BoxGeometry(14, 5, 14);
        const material = new THREE.MeshBasicMaterial({
            wireframe: false,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide, // dwustronny
            map: color = new THREE.TextureLoader().load(color === "white" ? './textures/whitewood2.jpg' : './textures/blackwood.jpg'), // plik tekstury
        })

        //this.cube = new THREE.Mesh(geometry, material);
        super(geometry, material) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.x = x
        this.y = y
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z)
    }

    setXY(x, y) {
        this.x = x
        this.y = y
    }
}

export default Item