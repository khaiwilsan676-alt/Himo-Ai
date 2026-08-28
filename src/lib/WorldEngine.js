
import * as THREE from 'three';

export default class WorldEngine {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.terrain = null;
        this.objects = [];
        this.controls = null;
        this.animationId = null;
        this.isDisposed = false;
        
        this.init();
    }

    init() {
        // Clear container
        this.container.innerHTML = '';
        
        // Get container dimensions
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 400;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 500);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB, 1);
        this.container.appendChild(this.renderer.domElement);

        // Create clock
        this.clock = new THREE.Clock();

        // Setup world
        this.createLights();
        this.createSky();
        this.createTerrain();
        this.createObjects();
        this.setupControls();

        // Handle resize
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.container);

        // Start animation loop
        this.animate();
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
    }

    createSky() {
        const skyGeo = new THREE.SphereGeometry(400, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 20 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }

    createTerrain() {
        const geometry = new THREE.PlaneGeometry(200, 200, 80, 80);
        const vertices = geometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            vertices[i + 2] = this.getHeight(x, y);
        }
        
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({
            color: 0x3a7d44,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: false
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
    }

    getHeight(x, y) {
        return Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5 +
               Math.sin(x * 0.3 + y * 0.2) * 3 +
               Math.cos(x * 0.05 - y * 0.07) * 8;
    }

    createObjects() {
        // Trees
        for (let i = 0; i < 15; i++) {
            const tree = this.createTree();
            const x = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            const y = this.getHeight(x, z);
            tree.position.set(x, y, z);
            this.scene.add(tree);
            this.objects.push(tree);
        }

        // Rocks
        for (let i = 0; i < 10; i++) {
            const rock = this.createRock();
            const x = (Math.random() - 0.5) * 170;
            const z = (Math.random() - 0.5) * 170;
            const y = this.getHeight(x, z);
            rock.position.set(x, y, z);
            this.scene.add(rock);
            this.objects.push(rock);
        }

        // Buildings
        for (let i = 0; i < 4; i++) {
            const building = this.createBuilding();
            const x = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const y = this.getHeight(x, z);
            building.position.set(x, y, z);
            this.scene.add(building);
            this.objects.push(building);
        }
    }

    createTree() {
        const group = new THREE.Group();
        
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 8, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 4;
        trunk.castShadow = true;
        group.add(trunk);
        
        const leafGeometry = new THREE.SphereGeometry(3, 8, 8);
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
        leaves.position.y = 10;
        leaves.castShadow = true;
        group.add(leaves);
        
        return group;
    }

    createRock() {
        const geometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(geometry, material);
        rock.castShadow = true;
        rock.receiveShadow = true;
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        return rock;
    }

    createBuilding() {
        const group = new THREE.Group();
        
        const buildingGeometry = new THREE.BoxGeometry(8, Math.random() * 15 + 10, 8);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            roughness: 0.5,
            metalness: 0.2
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = buildingGeometry.parameters.height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);
        
        const roofGeometry = new THREE.ConeGeometry(6, 4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = buildingGeometry.parameters.height + 2;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        return group;
    }

    setupControls() {
        this.controls = {
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            rotation: { x: -0.5, y: 0 },
            distance: 100,
            target: new THREE.Vector3(0, 0, 0)
        };

        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => {
            this.controls.isDragging = true;
            this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mouseup', () => {
            this.controls.isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mouseleave', () => {
            this.controls.isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (this.controls.isDragging) {
                const deltaX = e.clientX - this.controls.previousMousePosition.x;
                const deltaY = e.clientY - this.controls.previousMousePosition.y;
                
                this.controls.rotation.y += deltaX * 0.005;
                this.controls.rotation.x += deltaY * 0.005;
                this.controls.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.controls.rotation.x));
                
                this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.controls.distance += e.deltaY * 0.1;
            this.controls.distance = Math.max(20, Math.min(200, this.controls.distance));
        });

        canvas.style.cursor = 'grab';
    }

    updateCamera() {
        const x = this.controls.target.x + this.controls.distance * Math.sin(this.controls.rotation.y) * Math.cos(this.controls.rotation.x);
        const y = this.controls.target.y + this.controls.distance * Math.sin(this.controls.rotation.x);
        const z = this.controls.target.z + this.controls.distance * Math.cos(this.controls.rotation.y) * Math.cos(this.controls.rotation.x);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.controls.target);
    }

    animate() {
        if (this.isDisposed) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        this.updateCamera();
        
        // Animate trees
        this.objects.forEach((obj, index) => {
            if (index < 15) { // Trees
                obj.rotation.z = Math.sin(Date.now() * 0.001 + index) * 0.02;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (this.isDisposed) return;
        
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 400;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        this.isDisposed = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Remove event listeners
        const canvas = this.renderer?.domElement;
        if (canvas) {
            canvas.removeEventListener('mousedown', () => {});
            canvas.removeEventListener('mouseup', () => {});
            canvas.removeEventListener('mouseleave', () => {});
            canvas.removeEventListener('mousemove', () => {});
            canvas.removeEventListener('wheel', () => {});
        }
        
        // Dispose Three.js resources
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode === this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objects = [];
    }
}
