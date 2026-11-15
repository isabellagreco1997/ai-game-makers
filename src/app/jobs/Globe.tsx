"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import world from "@/content/world-map.json";
import styles from "./jobs.module.css";

type Pin = { city: string; lat: number; lon: number; count: number };
export default function Globe({ pins, onSelect }: { pins: Pin[]; onSelect: (city: string) => void }) {
  const mount = useRef<HTMLDivElement>(null);
  const callback = useRef(onSelect); callback.current = onSelect;
  useEffect(() => {
    const el = mount.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { el.textContent = "3D globe unavailable. Use the location buttons below to explore jobs."; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.z = 5.5;
    const group = new THREE.Group(); group.rotation.y = -.6; group.rotation.x = .1; scene.add(group);
    const canvas = document.createElement('canvas'); canvas.width=1440; canvas.height=720;
    const ctx=canvas.getContext('2d')!; ctx.fillStyle='#29162e'; ctx.fillRect(0,0,1440,720); ctx.scale(2,2);
    for(const item of world) { ctx.fillStyle='#e87954'; ctx.strokeStyle='#5c2937'; ctx.lineWidth=.45; const p=new Path2D(item.d); ctx.fill(p); ctx.stroke(p); }
    const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace;
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(1.36,64,48),new THREE.MeshPhongMaterial({map:texture,shininess:7})); group.add(sphere);
    scene.add(new THREE.AmbientLight(0xffffff,1.3)); const light=new THREE.DirectionalLight(0xffd9a2,2); light.position.set(2,3,5); scene.add(light);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(1.41,48,32),new THREE.MeshBasicMaterial({color:0xffb65b,transparent:true,opacity:.07,side:THREE.BackSide})); group.add(glow);
    const targets: THREE.Mesh[]=[];
    for(const pin of pins){
      const lat=THREE.MathUtils.degToRad(pin.lat), phi=THREE.MathUtils.degToRad(pin.lon+180);
      const p=new THREE.Vector3(-Math.cos(phi)*Math.cos(lat), Math.sin(lat), Math.sin(phi)*Math.cos(lat)).multiplyScalar(1.375);
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.032,12,10),new THREE.MeshBasicMaterial({color:0xffe16b})); dot.position.copy(p); dot.userData.city=pin.city; group.add(dot); targets.push(dot);
      const halo=new THREE.Mesh(new THREE.SphereGeometry(.059,12,10),new THREE.MeshBasicMaterial({color:0xffba60,transparent:true,opacity:.25})); halo.position.copy(p); group.add(halo);
    }
    let width=0,height=0; const resize=()=>{width=el.clientWidth;height=el.clientHeight; if(!width||!height)return; renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    let dragging=false, moved=false, lastX=0,lastY=0; const down=(e:PointerEvent)=>{dragging=true;moved=false;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
    const move=(e:PointerEvent)=>{if(!dragging)return; const dx=e.clientX-lastX,dy=e.clientY-lastY; if(Math.abs(dx)+Math.abs(dy)>1)moved=true; group.rotation.y+=dx*.008;group.rotation.x=Math.max(-1.1,Math.min(1.1,group.rotation.x+dy*.008));lastX=e.clientX;lastY=e.clientY;};
    const up=(e:PointerEvent)=>{dragging=false;if(moved)return; const box=renderer.domElement.getBoundingClientRect();const point=new THREE.Vector2((e.clientX-box.left)/box.width*2-1,-((e.clientY-box.top)/box.height)*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(point,camera);const all=ray.intersectObjects([...targets,sphere]);if(all[0] && all[0].object!==sphere)callback.current(all[0].object.userData.city);};
    renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);
    let frame=0; const animate=()=>{frame=requestAnimationFrame(animate);if(!dragging)group.rotation.y+=.0012;renderer.render(scene,camera)};animate();
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose(); const materials=Array.isArray(obj.material)?obj.material:[obj.material];materials.forEach(m=>m.dispose())}});texture.dispose();renderer.dispose();renderer.domElement.remove();};
  },[pins]);
  return <div ref={mount} className={styles.globe} aria-label="Interactive 3D globe. Drag to rotate. Choose a city using the buttons below." role="img" />;
}
