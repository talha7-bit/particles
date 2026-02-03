import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { Raycaster } from 'three';
const File = () => {
    const ref=useRef();

    useEffect(()=>{
        const scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        scene.add(camera);
        camera.position.z=10;

        const renderer=new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        ref.current.appendChild(renderer.domElement);
        const composer=new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene,camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(
            window.innerWidth,window.innerHeight
        ),0.3,0.9,0.2))



        const _particles=[];
        const geometry=new THREE.BufferGeometry();
        geometry.setAttribute("position",new THREE.Float32BufferAttribute([],3));
       const material=new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},
            uFrequency:{value:1.5},
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
        gl_FragColor=vec4(0.2,0.2,1.0,1.0);
        }
        `,
        transparent:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending
       })
        const pointmesh=new THREE.Points(geometry,material);
        //pointmesh.position.x=-16;
        pointmesh.scale.set(2,2,2);
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

        //-----------ray caster-------------//
        const raycaster=new THREE.Raycaster();
        const mouse=new THREE.Vector2(0.0,0.0);
        
        window.addEventListener("mousemove",(e)=>{
            mouse.x=(e.clientX/window.innerWidth)*2-1;
            mouse.y=-(e.clientY/window.innerHeight)*2+1;
        })
        raycaster.setFromCamera(mouse,camera);
        const intersect=raycaster.intersectObject(pointmesh);

        const originalposition=geometry.attributes.position.array;
        function animate(){
            requestAnimationFrame(animate);
            //renderer.render(scene,camera);
            composer.render();
            controls.update();
            material.uniforms.uTime.value+=0.05;
            //pointmesh.position.x+=0.08;

            if(pointmesh.position.x>27){
                pointmesh.position.x=-16;
            }
            if(intersect.length>0){
                const point=intersect[0].point;
                const position=geometry.attributes.position.array;
                const radius=0.5;
                for(let i=0;i<position.length;i++){
                const dx=position[i*3]-point.x;
                const dy=position[i*3+1]-point.x;
                const dz=position[i*3+2]-point.x;
                const distance=Math.sqrt(dx*dx+dy*dy+dz*dz);
                if(distance<radius){
                    const force=(radius-distance)/radius*0.05;
                    position[i*3]+=dx*force;
                    position[i*3+1]+=dy*force;
                    position[i*3+2]+=dz*force;
                }
                }
                geometry.attributes.position.needsUpdate=true;
            }
        }
        animate();
    })
  return (
    <div ref={ref}>
      
    </div>
  )
}

export default File
