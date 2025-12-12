import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef} from "react";
import * as THREE from "three";

interface props {
  location: string;
  position: [number, number, number];
  scale:[number,number,number];
}
const CarosolItems = ({ location, position,scale }: props) => {
  console.log(scale)
  const { scene } = useGLTF(location);
  const modelRef = useRef<THREE.Group>(null!);

  const timeline=useRef<gsap.core.Timeline>(null!)

  useEffect(()=>{
    if(modelRef.current){
      timeline.current=gsap.timeline({paused:true})
      .to(modelRef.current.scale,{
        x:scale[0]+0.05,
        y:scale[1]+0.05,
        z:scale[2]+0.05,
        duration:0.5,
        ease:"power2.out"
      })
      .to(modelRef.current.rotation,{
        y:`+=${Math.PI}`,
        duration:1,
        ease:"power4.inOut"
      },'<')
    } 
    return ()=>{
      timeline.current?.kill()
    }
  },[])


  return (
    <>
      <primitive
        ref={modelRef}
        onPointerOver={()=>{timeline.current?.play()}}
        onPointerOut={()=>{timeline.current?.reverse()}}
        object={scene.clone()}
        position={position}
        scale={scale}
      />
    </>
  );
};

export default CarosolItems;
