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
       const material=new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},
            uFrequency:{value:1.2},
            uAmplitude:{value:0.2}
        },
        vertexShader:`
        uniform float uTime;
        uniform float uFrequency;
        uniform float uAmplitude;
        varying vec3 pos;
        void main(){
        pos=position;
        pos.y+=sin(pos.x*uFrequency+uTime)*uAmplitude;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
        gl_PointSize=3.0;
        }
        `,
        fragmentShader:`
        void main(){
        gl_FragColor=vec4(1.0,1.0,1.0,1.0);
        }
        `
       })
        const pointmesh=new THREE.Points(geometry,material);
        //pointmesh.position.x=-16;
        scene.add(pointmesh);

        function createparticles(){
            for(let i=0;i<50000;i++){
            _particles.push({
                position:new THREE.Vector3(
                    Math.random()*17-9,
                    Math.sin( Math.random()*2.5-2,),
                    Math.sin(Math.random()*2-1),
                ),
                angle:Math.random()*2*Math.PI,
                basey: Math.sin( Math.random()*2.5-2,),
            })
            }
        }
        
        
        const basey=[];
        const angles=[];
        function updategeometry(){
            const points=[];
            for(let p of _particles){
                points.push(
                    points.push(p.position.x,p.position.y,p.position.z)
                );
                angles.push(p.angle);
                basey.push(p.basey)
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
            material.uniforms.uTime.value+=0.05;
           
        }
        animate();
    })
  return (
    <div ref={ref}>
      
    </div>
  )
}

export default File
