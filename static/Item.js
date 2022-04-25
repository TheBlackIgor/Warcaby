class Item extends THREE.Mesh {

    constructor(color) {
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
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z)
    }
}

export default Item