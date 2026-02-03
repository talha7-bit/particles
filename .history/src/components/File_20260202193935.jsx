import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const File = () => {
    const ref=useRef();

    useEffect(()=>{
        const scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        scene.add(camera);
        camera.position.z=5;

        const renderer=new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        ref.current.appendChild(renderer.domElement);

        const _particles=[];
        const geometry=new THREE.BufferGeometry();
        geometry.setAttribute("position",new THREE.Float32BufferAttribute([],3));
        const material=new THREE.PointsMaterial({
            size:0.03,
            color:new THREE.Color(1.0,0.8,0.8)
        });
        const pointmesh=new THREE.Points(geometry,material);
        scene.add(pointmesh);

        function createparticles(){
            for(let i=0;i<50000;i++){
            _particles.push({
                position:new THREE.Vector3(
                Math.random()*17-9,
                Math.sin( Math.random()*2.5-2,),
                Math.sin(Math.random()*2-1),
                )
            })
            }
        }

       
        const points=[];
        function updategeometry(){
            for(let p of _particles){
                points.push(
                    points.push(p.position.x,p.position.y,p.position.z)
                )
            }
            geometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
            geometry.attributes.position.needsUpdate=true;
        }
        
        createparticles();
        updategeometry();
        
        const controls=new OrbitControls(camera,renderer.domElement);
        
        function animate(){
            requestAnimationFrame(animate);
            renderer.render(scene,camera);
            controls.update();
            for(let i=0;i<points/3;i++){
                p[i*3+1]+=Math.random()*2;
                p[i*3+2]+=Math.random()*2;
            }
            geometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
            geometry.attributes.position.needsUpdate=true;
        }
        animate();
    })
  return (
    <div ref={ref}>
      
    </div>
  )
}

export default File
