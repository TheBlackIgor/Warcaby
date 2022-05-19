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
        this.tabWhite = []
        this.tabBlack = []

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
        this.currentObj = ""

        window.addEventListener('mousedown', e => {
            try {
                if (playerBlackLoggedIn || playerWhiteLoggedIn) {
                    if (this.currentPawn != "")
                        if (this.currentPawn.getColor() === "black" && playerBlackLoggedIn)
                            this.currentPawn.material.map = this.setMaterial(1)
                        else if (this.currentPawn.getColor() === "white" && !playerBlackLoggedIn)
                            this.currentPawn.material.map = this.setMaterial(0)
                    this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                    this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
                    this.raycaster.setFromCamera(this.mouseVector, this.camera);
                    const intersects = this.raycaster.intersectObjects(this.scene.children);
                    if (intersects[0].object != this.currentPawn) {

                        this.currentObj = this.raycaster.intersectObjects(this.scene.children)[0].object;

                        if (this.currentObj.getType() === "item") {
                            let newPos = this.currentObj.getPosition()
                            console.log(this.currentObj.getColor())
                            if (this.currentObj.getColor() === "black") {
                                console.log(this.currentPawn)
                                if (playerBlackLoggedIn && this.currentPawn.getColor() === "black") {
                                    let lastPos = this.currentPawn.getPos()

                                    if (
                                        (lastPos.x - newPos.x === 1 || lastPos.x - newPos.x === -1) && (lastPos.y - newPos.y === -1)
                                        && this.pionki[newPos.y][newPos.x] === 0
                                    ) {
                                        this.currentPawn.setPosition(14 * (newPos.x - 3.5), 24, 14 * (newPos.y - 3.5))
                                        this.pionki[lastPos.y][lastPos.x] = 0
                                        this.pionki[newPos.y][newPos.x] = 2
                                        this.currentPawn.setPos(newPos.x, newPos.y)
                                    }

                                }
                                else if (!playerBlackLoggedIn && this.currentPawn.getColor() === "white") {
                                    let lastPos = this.currentPawn.getPos()
                                    if ((lastPos.x - newPos.x === 1 || lastPos.x - newPos.x === -1) && (lastPos.y - newPos.y === 1)
                                        && this.pionki[newPos.y][newPos.x] === 0
                                    ) {
                                        new TWEEN.Tween(this.currentPawn.position) // co
                                            .to({ x: 14 * (newPos.x - 3.5), z: 14 * (newPos.y - 3.5) }, 500) // do jakiej pozycji, w jakim czasie
                                            .easing(TWEEN.Easing.Linear.None) // typ easingu (zmiana w czasie)
                                            .onComplete(() => { console.log("koniec animacji") }) // funkcja po zakończeniu animacji
                                            .start()
                                        this.pionki[lastPos.y][lastPos.x] = 0
                                        this.pionki[newPos.y][newPos.x] = 1

                                        this.currentPawn.setPos(newPos.x, newPos.y)

                                    }

                                }
                                console.table(this.pionki)
                            }
                            this.currentPawn = ""
                        }
                        if (this.currentObj.getType() === "pawn") {
                            this.currentPawn = this.currentObj
                            if (playerBlackLoggedIn && this.currentPawn.getColor() === 'black') {
                                this.currentPawn.material.map = this.setMaterial(2)
                            } else if (!playerBlackLoggedIn && this.currentPawn.getColor() === 'white') {
                                this.currentPawn.material.map = this.setMaterial(2)
                            }
                        }
                    } else {
                        this.currentPawn = ""
                    }
                }
            } catch (e) {
                this.currentPawn = ""
                console.log('nie klikasz w pionka')
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
                    const item = new Item("white", j, i)
                    item.setPosition(14 * (j - 3.5), 20, 14 * (i - 3.5), j, i)
                    this.scene.add(item);
                }
                else {
                    const item = new Item("black", j, i)
                    item.setPosition(14 * (j - 3.5), 20, 14 * (i - 3.5), j, i)
                    this.scene.add(item);
                }
            }
        }
    }

    pawns = () => {
        let whiteID = 0
        let blackID = 0
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.pionki[i][j] == 1) {
                    const pawn = new Pawn("white", j, i)
                    pawn.setPosition(14 * (j - 3.5), 24, 14 * (i - 3.5))
                    pawn.setID(whiteID)
                    whiteID++
                    this.tabWhite.push(pawn)
                    this.scene.add(pawn);
                }
                else if (this.pionki[i][j] == 2) {
                    const pawn = new Pawn("black", j, i)
                    pawn.setPosition(14 * (j - 3.5), 24, 14 * (i - 3.5))
                    pawn.setID(blackID)
                    blackID++
                    this.tabBlack.push(pawn)
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
            if (playerWhiteLoggedIn && !playerBlackLoggedIn) {
                this.makeWhitePons()
                this.doneW = true
                this.pawnsMade = true
            }
            if (playerBlackLoggedIn) {
                this.makeBlackPons()
                this.doneB = true
                this.pawnsMade = true
            }
        }
        TWEEN.update();
    }

    setMaterial(num) {
        const materials = [
            './textures/whitewood.jpg',
            './textures/redwood.jpg',
            './textures/yellowwood.jpg'
        ]
        return new THREE.TextureLoader().load(materials[num])
    }
}