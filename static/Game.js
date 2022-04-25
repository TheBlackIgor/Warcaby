import Item from './Item.js'
import Pawn from './Pawn.js'

export default class Game {
    constructor() {
        this.pawnsMade = false

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xA9A9A9);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //siatka
        const axes = new THREE.AxesHelper(1000)
        axes.position.y = 17.5

        this.doneW = false
        this.doneB = false

        this.szachownica = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]

        this.board()

        document.getElementById("root").append(this.renderer.domElement);



        this.camera.position.set(0, 100, 100)
        this.camera.lookAt(this.scene.position)

        this.render() // wywołanie metody render

        this.onWindowResize = () => {
            console.log(this)
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', this.onWindowResize, false);


        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()
        this.intersects = this.raycaster.intersectObjects(this.scene.children);
        this.currentPawn = ""

        window.addEventListener('mousedown', e => {
            if (playerBlackLoggedIn || playerWhiteLoggedIn) {
                if (this.currentPawn != "")
                    this.currentPawn.material.map = this.setMaterial(playerWhiteLoggedIn ? 0 : 1)
                this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouseVector, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children);
                if (intersects[0].object != this.currentPawn) {
                    this.currentPawn = this.raycaster.intersectObjects(this.scene.children)[0].object;
                    this.currentPawn.material.map = this.setMaterial(2)
                    console.log(this.currentPawn.getColor());
                } else {
                    this.currentPawn = ""
                }
            }
        })
    }

    makeWhitePons() {
        this.board()
        this.pawns()
        this.camera.position.set(0, 100, 100)
    }

    makeBlackPons() {
        this.board()
        this.pawns()
        this.camera.position.set(0, 100, -100)
    }

    board = () => {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.szachownica[i][j] == 0) {
                    const pawn = new Item("white")//new THREE.Mesh(geometry, materialBialy);
                    pawn.setPosition(14 * (j - 3.5), 20, 14 * (i - 3.5))
                    this.scene.add(pawn);
                }
                else {
                    const pawn = new Item("black")//new THREE.Mesh(geometry, materialBialy);
                    pawn.setPosition(14 * (j - 3.5), 20, 14 * (i - 3.5))
                    this.scene.add(pawn);
                }
            }
        }
    }

    pawns = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.pionki[i][j] == 1) {
                    const pawn = new Pawn("white")
                    pawn.setPosition(14 * (j - 3.5), 24, 14 * (i - 3.5))
                    this.scene.add(pawn);
                }
                else if (this.pionki[i][j] == 2) {
                    const pawn = new Pawn("black")
                    pawn.setPosition(14 * (j - 3.5), 24, 14 * (i - 3.5))
                    this.scene.add(pawn);
                }
            }
        }
    }


    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        this.camera.lookAt(this.scene.position)

        if ((this.doneW != true || this.doneB != true) && !this.pawnsMade) {
            if (playerWhiteLoggedIn) {
                this.makeWhitePons()
                console.log("WHITE")
                this.doneW = true
                this.pawnsMade = true
            }
            if (playerBlackLoggedIn) {
                this.makeBlackPons()
                console.log("BLACK")
                this.doneB = true
                this.pawnsMade = true
            }
        }
    }

    setMaterial(num) {
        const materials = [
            './textures/whitewood.jpg',
            './textures/redwood.jpg',
            './textures/yellowwood.jpg'
        ]
        console.log('change material')
        return new THREE.TextureLoader().load(materials[num])
    }
}