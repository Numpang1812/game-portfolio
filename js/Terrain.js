class Terrain {
    constructor(scene) {
        this.scene = scene;
        this.width = 300; // Increased size slightly
        this.depth = 300;
        this.segments = 150;
        this.geometry = null;
        this.mesh = null;
        this.heightData = [];
        this.trees = []; // Store tree positions and radii for collision

        // Noise settings
        this.noise = new ImprovedNoise();
    }

    generate() {
        // Create plane geometry
        this.geometry = new THREE.PlaneGeometry(this.width, this.depth, this.segments, this.segments);
        this.geometry.rotateX(-Math.PI / 2);

        const vertices = this.geometry.attributes.position.array;
        this.heightData = new Float32Array(vertices.length / 3);
        const maxDist = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.depth / 2, 2));

        // Apply noise to height
        for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            const x = vertices[i];
            const z = vertices[i + 2];

            // Base Noise layers
            let y = 0;
            y += this.noise.noise(x * 0.015, 0, z * 0.015) * 25; // Mountains
            y += this.noise.noise(x * 0.06, 0, z * 0.06) * 8;    // Hills
            y += this.noise.noise(x * 0.2, 0, z * 0.2) * 2;      // Detail

            // Island Falloff (Mask)
            // Calculate distance from center (normalized 0 to 1)
            const dist = Math.sqrt(x * x + z * z);
            const normalizedDist = dist / (this.width / 2); // 0 at center, 1 at edge

            // smoothstep-like falloff
            // We want 1.0 at center, fading effectively to 0.0 around 0.8 distance
            let mask = 1.0 - Math.pow(normalizedDist, 2.5);
            if (mask < 0) mask = 0;

            y *= mask;

            // Force edges down even more to be safe
            if (normalizedDist > 0.85) {
                y -= (normalizedDist - 0.85) * 100;
            }

            vertices[i + 1] = y;
            this.heightData[j] = y;
        }

        this.geometry.computeVertexNormals();

        // Vertex colors
        const count = this.geometry.attributes.position.count;
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

        const colors = this.geometry.attributes.color;
        const pos = this.geometry.attributes.position;
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            const y = pos.getY(i);

            if (y < -4) {
                color.setHex(0x2389da); // Ocean Deep
            } else if (y < 2) {
                color.setHex(0xeecfa1); // Beach Sand
            } else if (y < 15) {
                color.setHex(0x228b22); // Forest Green
            } else if (y < 25) {
                color.setHex(0x808080); // Stone
            } else {
                color.setHex(0xffffff); // Snow
            }

            colors.setXYZ(i, color.r, color.g, color.b);
        }

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true
        });

        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // Huge water plane for "infinite" ocean
        const waterGeo = new THREE.PlaneGeometry(2000, 2000);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x1ca3ec,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.3
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.y = -2; // Water level
        this.scene.add(water);

        this.addVegetation();
    }

    addVegetation() {
        const treeCount = 500; // More trees

        for (let i = 0; i < treeCount; i++) {
            const x = (Math.random() - 0.5) * this.width * 0.85;
            const z = (Math.random() - 0.5) * this.depth * 0.85;
            const y = this.getHeightAt(x, z);

            // Trees only on land (above water + buffer) and not too high (steep/snow)
            if (y > 0 && y < 20) {
                this.createTree(x, y, z);
            }
        }
    }

    createTree(x, y, z) {
        const type = Math.floor(Math.random() * 3);
        const tree = new THREE.Group();
        let collisionRadius = 0.5;

        // Tree material - reuse to save memory if possible (but simple is fine)
        const darkGreen = new THREE.MeshStandardMaterial({ color: 0x006400, flatShading: true });
        const brown = new THREE.MeshStandardMaterial({ color: 0x3d2b1f });

        if (type === 0) {
            // Pine
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 8), darkGreen);
            leaves.position.y = 2.5;
            leaves.castShadow = true;

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1, 8), brown);
            trunk.position.y = 0.5;
            trunk.castShadow = true;

            tree.add(trunk);
            tree.add(leaves);

        } else if (type === 1) {
            // Oak
            const leaves = new THREE.Mesh(
                new THREE.IcosahedronGeometry(1.5, 0),
                new THREE.MeshStandardMaterial({ color: 0x228b22, flatShading: true })
            );
            leaves.position.y = 2.5;
            leaves.castShadow = true;

            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8),
                new THREE.MeshStandardMaterial({ color: 0x5c4033 })
            );
            trunk.position.y = 0.75;
            trunk.castShadow = true;

            tree.add(trunk);
            tree.add(leaves);
            collisionRadius = 0.7;

        } else {
            // Bush
            const leaves = new THREE.Mesh(
                new THREE.DodecahedronGeometry(1, 0),
                new THREE.MeshStandardMaterial({ color: 0x32cd32, flatShading: true })
            );
            leaves.position.y = 0.8;
            leaves.scale.y = 0.8;
            leaves.castShadow = true;

            tree.add(leaves);
            collisionRadius = 0.8;
        }

        tree.position.set(x, y, z);
        const s = 1 + Math.random() * 0.75;
        const h = 1.5 + Math.random() * 0.75;
        tree.scale.set(s, h, s);
        tree.rotation.y = Math.random() * Math.PI * 2;

        this.scene.add(tree);

        this.trees.push({
            x: x,
            z: z,
            radius: collisionRadius * s
        });
    }

    getHeightAt(x, z) {
        // Optimization: check bounds first
        if (Math.abs(x) > this.width / 2 || Math.abs(z) > this.depth / 2) return -100;

        const raycaster = new THREE.Raycaster();
        raycaster.set(new THREE.Vector3(x, 100, z), new THREE.Vector3(0, -1, 0));
        const intersects = raycaster.intersectObject(this.mesh);

        if (intersects.length > 0) return intersects[0].point.y;
        return 0;
    }

    checkTreeCollision(x, z, playerRadius) {
        for (let tree of this.trees) {
            const dx = x - tree.x;
            const dz = z - tree.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < (tree.radius + playerRadius)) return true;
        }
        return false;
    }
}
