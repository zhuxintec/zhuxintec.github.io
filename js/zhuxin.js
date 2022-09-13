var zhuxin={};
zhuxin.global={};
zhuxin.config={};
var controls;
zhuxin.loadingSplash=function () {
    var loadline = $("#loadline");
    var loadline2 = $("#loadline2");
    var loadline3 = $("#loadline3");
    loadline.bind( "webkitAnimationEnd", function() {
        loadline.hide();
        loadline2.show();
    })
    loadline2.bind( "webkitAnimationEnd", function() {
        loadline2.hide();
        loadline3.show();
        zhuxin.loading3D();
        // zhuxin.loadingTable();
    })
    $("#menuLine").bind('click', function () {
        // var json=camera.toJSON();
        // var str=JSON.stringify(json);
        // alert(controls);
        window.open('html/Javascript.html','_blank');
    })
    $("#about_arrow" ).bind( "click", function() {
        // window.location = 'html/Javascript.html'
        // window.open('html/Javascript.html','_blank');
    });



}

zhuxin.loading3D=function () {

    var threeStart=function() {
        initThree();
        initCamera();
        initScene();
        createEarth();
        initLight();
        // createLnglat();
        // createLine();
        // createStar();
        // initClouds();
        animate();
    }

// 渲染器
    var width, height;
    var renderer;
    var maxfar = 1000000;
    function initThree() {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: renderer
        });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        document.getElementById('canvasdiv').appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }
    function onWindowResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

// 相机
    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, maxfar);
        controls = new THREE.OrbitControls(camera,renderer.domElement);
        camera.position.z = 705;
        // camera.position.x = 0;
        // camera.position.y = 0;
        // camera.position.z = 700;
        // camera.rotation.x= -0.47;
        // camera.rotation.y =-0.72;
        // camera.rotation.z = -0.33;
        // camera.updateProjectionMatrix();
        // controls.update();

        controls.target = new THREE.Vector3(260,0,100);
        controls.update();
    }

// 场景
    var scene;
    function initScene() {
        scene = new THREE.Scene();
    }

// 光源
    var light;
    function initLight() {
        scene.add(new THREE.AmbientLight(0x80ccaa));

        var target = new THREE.Object3D();
        target.position.set(200, -100, 140);
        scene.add(target);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(100, 300,500);
        // 开启阴影
        // spotLight.castShadow = true;
        spotLight.distance = 800;
        spotLight.angle = 0.6;
        // spotLight.target = target;
        spotLight.intensity =1.5;// 光源强度
        spotLight.decay = 0.1;
        // spotLight.penumbra = 1;
        scene.add(spotLight);

        // // 聚光光源助手
        // spotLightHelper = new THREE.SpotLightHelper(spotLight);
        // scene.add(spotLightHelper);
    }

// 地球
    var earthMesh;
    var earthgroup = new THREE.Group();
    function createEarth() {
        scene.add(earthgroup);
        var earthGeo = new THREE.SphereGeometry(240, 100, 100);
        var url = './images/MapDark.jpg';
        var earthMater = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(url),
            transparent: false,
            opacity: 1
        });
        earthMesh = new THREE.Mesh(earthGeo, earthMater);
        earthMesh.rotation.x=  Math.PI*0.15;
        earthMesh.rotation.y = Math.PI*0.7;
        earthgroup.add(earthMesh);
    }

    function createLnglat() {
        var earthrad = 245;
        var geometry_lng = new THREE.TorusGeometry(earthrad, 0.5, 5, 100);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        });
        var torus;
        //经线
        var step = 18;
        for (var i = 0; i < 180; i += step) {
            torus = new THREE.Mesh(geometry_lng, material);
            torus.rotation.y = (Math.PI / 2) * i / 90;
            earthgroup.add(torus);
        }

        //纬线
        for (var i = -85; i < 85; i += step) {
            var h = Math.sin((Math.PI / 2) * i / 90) * earthrad;
            var l = Math.cos((Math.PI / 2) * i / 90) * earthrad;
            var geometry_lng = new THREE.TorusGeometry(l, 0.5, 5, 100);
            torus = new THREE.Mesh(geometry_lng, material);
            torus.position.y = h;
            torus.rotation.x = Math.PI / 2;
            earthgroup.add(torus);
        }

    }

    var particles_star;
    var numParticles_star = 1000;
    var mindistance = 500;
    function createStar() {
        //wave
        var positions = new Float32Array(numParticles_star * 3);
        var scales = new Float32Array(numParticles_star);
        var colors = new Float32Array(numParticles_star * 3);
        var i = 0, j = 0;
        for (var ix = 0; ix < numParticles_star; ix++) {
            var x = THREE.Math.randFloat(-50000, 50000);
            var y = THREE.Math.randFloat(-50000, 50000);
            var z = THREE.Math.randFloat(-50000, 50000);

            // if(x<mindistance){
            //     x+=mindistance;
            // }
            // if(y<mindistance){
            //     y+=mindistance;
            // }
            // if(z<mindistance){
            //     z+=mindistance;
            // }
            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            colors[i] = THREE.Math.randFloat(0.7, 1.0);
            colors[i + 1] = THREE.Math.randFloat(0.7, 1.0);
            colors[i + 2] = THREE.Math.randFloat(0.7, 1.0);
            scales[j] = THREE.Math.randFloatSpread(50);
            i += 3;
            j++;
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        var material = new THREE.PointsMaterial({
            size: 600,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1.0
        });
        var pointsMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            size: 500,
            transparent: true,//使材质透明
            blending: THREE.AdditiveBlending,
            // depthTest:false,//深度测试关闭，不消去场景的不可见面
            map: createLightMateria()//刚刚创建的粒子贴图就在这里用上
        });
        particles_star = new THREE.Points(geometry, pointsMaterial);
        scene.add(particles_star);
    }

    var r = 800;
    var rHalf = r / 2;
    var particles_line;
    var particleCount = 500;
    var numParticles_line = 1000;
    var segments = numParticles_line * numParticles_line;
    var positions_line = new Float32Array(segments * 3);
    var colors_line = new Float32Array(segments * 3);
    var particlesData = [];
    var particlePositions;
    var pointCloud;
    var linesMesh;
    function createLine() {
        var group = new THREE.Group();
        scene.add(group);

        particlePositions = new Float32Array(numParticles_line * 3);
        for (var i = 0; i < numParticles_line; i++) {
            var x = Math.random() * r - r / 2;
            var y = Math.random() * r - r / 2;
            var z = Math.random() * r - r / 2;
            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
            // add it to the geometry
            particlesData.push({
                velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
                numConnections: 0
            });
        }
        particles_line = new THREE.BufferGeometry();
        particles_line.setDrawRange(0, particleCount);
        particles_line.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(true));

        var pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.1,
            sizeAttenuation: false
        });

        // create the particle system
        pointCloud = new THREE.Points(particles_line, pMaterial);
        group.add(pointCloud);

        //create line
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions_line, 3).setDynamic(true));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors_line, 3).setDynamic(true));
        geometry.computeBoundingSphere();
        geometry.setDrawRange(0, 0);
        var material = new THREE.LineBasicMaterial({
            color: 0xAAAAAA,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.1
        });
        linesMesh = new THREE.LineSegments(geometry, material);
        group.add(linesMesh);
    }

    function createLightMateria() {
        let canvasDom = document.createElement('canvas');
        canvasDom.width = 32;
        canvasDom.height = 32;
        let ctx = canvasDom.getContext('2d');
        //根据参数确定两个圆的坐标，绘制放射性渐变的方法，一个圆在里面，一个圆在外面
        let gradient = ctx.createRadialGradient(
            canvasDom.width / 2,
            canvasDom.height / 2,
            0,
            canvasDom.width / 2,
            canvasDom.height / 2,
            canvasDom.width / 2);
        //设置偏移值和颜色值

        //蓝色
        /*
          gradient.addColorStop(0,'rgba(255,255,255,1)');
          gradient.addColorStop(0.2,'rgba(0,255,255,1)');
          gradient.addColorStop(0.4,'rgba(0,0,64,1)');
          gradient.addColorStop(1,'rgba(0,0,0,1)');
         */

        //红色
        /*
        gradient.addColorStop(0,'rgba(255,255,255,1)');
        gradient.addColorStop(0.2,'rgba(255,182,193,1)');
        gradient.addColorStop(0.4,'rgba(64,0,0,1)');
        gradient.addColorStop(1,'rgba(0,0,0,1)');
        */

        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(200,200,200,0.9)');
        gradient.addColorStop(0.6, 'rgba(100,100,100,0.6)');
        gradient.addColorStop(0.9, 'rgba(50,50,50,0.3)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        //设置ctx为渐变色
        ctx.fillStyle = gradient;
        //绘图
        ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);

        //贴图使用
        let texture = new THREE.Texture(canvasDom);
        texture.needsUpdate = true;//使用贴图时进行更新
        return texture;
    }

// 云
    var cloudsMesh;
    function initClouds() {
        var cloudsGeo = new THREE.SphereGeometry(260, 100, 100);
        var cloudsMater = new THREE.MeshPhongMaterial({
            alphaMap: new THREE.TextureLoader().load('./assets/clouds.jpg'),
            transparent: true,
            opacity: 0.2
        });
        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
        // cloudsMesh.position.x= -360;
        // cloudsMesh.position.y = 20;
        // cloudsMesh.position.z= -260;
        // cloudsMesh.rotation.y = 1.5;
        scene.add(cloudsMesh);
    }

    function animate() {
        // 地球自转
        earthgroup.rotation.y += 0.0002;

        // // 漂浮的云层
        // cloudsMesh.rotation.y += 0.0005;

        //star
        // var positions = particles_star.geometry.attributes.position.array;
        // for ( var ix = 0; ix < numParticles_star; ix ++ ) {
        //     var i=ix*3;
        //     var deltal=THREE.Math.randFloat(0,20);
        //     positions[i] +=deltal;
        //     positions[i + 1] +=  deltal;
        //     positions[i + 2] +=  deltal;
        // }
        // particles_star.geometry.attributes.position.needsUpdate = true;
        // particles_star.rotation.y -= 0.0005;

        // // line
        // animateline();
        // controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    function animateline() {
        var minDistance = 150;
        var vertexpos = 0;
        var colorpos = 0;
        var numConnected = 0;
        for (var i = 0; i < particleCount; i++)
            particlesData[i].numConnections = 0;
        for (var i = 0; i < particleCount; i++) {
            // get the particle
            var particleData = particlesData[i];
            particlePositions[i * 3] += particleData.velocity.x;
            particlePositions[i * 3 + 1] += particleData.velocity.y;
            particlePositions[i * 3 + 2] += particleData.velocity.z;
            if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
                particleData.velocity.y = -particleData.velocity.y;
            if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
                particleData.velocity.x = -particleData.velocity.x;
            if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
                particleData.velocity.z = -particleData.velocity.z;
            // Check collision
            for (var j = i + 1; j < particleCount; j++) {
                var particleDataB = particlesData[j];
                var dx = particlePositions[i * 3] - particlePositions[j * 3];
                var dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                var dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < minDistance) {
                    particleData.numConnections++;
                    particleDataB.numConnections++;
                    var alpha = 1.0 - dist / minDistance;
                    positions_line[vertexpos++] = particlePositions[i * 3];
                    positions_line[vertexpos++] = particlePositions[i * 3 + 1];
                    positions_line[vertexpos++] = particlePositions[i * 3 + 2];
                    positions_line[vertexpos++] = particlePositions[j * 3];
                    positions_line[vertexpos++] = particlePositions[j * 3 + 1];
                    positions_line[vertexpos++] = particlePositions[j * 3 + 2];
                    colors_line[colorpos++] = alpha;
                    colors_line[colorpos++] = alpha;
                    colors_line[colorpos++] = alpha;
                    colors_line[colorpos++] = alpha;
                    colors_line[colorpos++] = alpha;
                    colors_line[colorpos++] = alpha;
                    numConnected++;
                }
            }
        }
        linesMesh.geometry.setDrawRange(0, numConnected * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.position.needsUpdate = true;
    }
    threeStart();
}

zhuxin.loadingTable=function () {
    var camera, scene, renderer;
    var controls;
    var objects = [];
    var table = [
        "关于著信", "北京著信科技有限公司", "1.00794", 1, 1
    ];
    var targets = { table: [], sphere: [], helix: [], grid: [] };
    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 3000;
        scene = new THREE.Scene();
        // table
        for ( var i = 0; i < table.length; i += 5 ) {
            var element = document.createElement( 'div' );
            element.className = 'element';
            element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

            var number = document.createElement( 'div' );
            number.className = 'number';
            number.textContent = ( i / 5 ) + 1;
            element.appendChild( number );

            var symbol = document.createElement( 'div' );
            symbol.className = 'symbol';
            symbol.textContent = table[ i ];
            element.appendChild( symbol );

            var details = document.createElement( 'div' );
            details.className = 'details';
            details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
            element.appendChild( details );

            var object = new THREE.CSS3DObject( element );
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            scene.add( object );
            objects.push( object );

            //
            var object = new THREE.Object3D();
            object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
            object.position.y = - ( table[ i + 4 ] * 180 ) + 990;
            targets.table.push( object );
        }
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById( 'container' ).appendChild( renderer.domElement );

        //
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );

        transform( targets.table, 2000 );
        // window.addEventListener( 'resize', onWindowResize, false );
    }

    function transform( targets, duration ) {
        TWEEN.removeAll();
        for ( var i = 0; i < objects.length; i ++ ) {
            var object = objects[ i ];
            var target = targets[ i ];
            new TWEEN.Tween( object.position )
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();

            new TWEEN.Tween( object.rotation )
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
        }
        new TWEEN.Tween( this )
            .to( {}, duration * 2 )
            .onUpdate( render )
            .start();
    }
    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        controls.update();
    }

    function render() {
        renderer.render( scene, camera );
    }

}

zhuxin.loadingSplash();