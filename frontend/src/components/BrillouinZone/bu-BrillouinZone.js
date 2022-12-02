import * as THREE from "three";
import { Edges, Polyhedron, Stage, Sphere } from '@react-three/drei'



function BrillouinZone(props) {
    const origin = new THREE.Vector3( 0, 0, 0 );
    const dir = new THREE.Vector3( 1, 0, 0);
    const hex = 0xff0000;
    const vertices = new Float32Array(props.vertex_coords)
    return (
            <group position={props.translation}>
            {/* 
            <Sphere args={[0.25, 32, 16]} >
                <meshPhongMaterial
                  attach="material"
                  color="black"
                  side={THREE.DoubleSide}
                />
            </Sphere>
            */}
            <Polyhedron args={[props.vertex_coords, props.vertex_inds, props.scale, 0]}>
                <Edges
                    scale={1.0}
                    threshold={1} 
                    color="black"
                    side={THREE.DoubleSide}
                />
                <meshPhongMaterial
                  attach="material"
                  color={props.color}
                  opacity={0.8}
                  transparent="true"
                  depthWrite={true}
                  side={THREE.DoubleSide}
                />
            </Polyhedron>
            </group>
    );
}

export default BrillouinZone;
