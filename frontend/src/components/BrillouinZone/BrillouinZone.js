import * as THREE from "three";
import { Edges, Polyhedron, Stage, Sphere, Text } from '@react-three/drei'
import LatticeVectors from "../LatticeVector/LatticeVectors";
import HighSymmPoint from "../HighSymmPoint/HighSymmPoint";
import Label from "../Label/Label";

function BrillouinZone(props) {
    const positions = new Float32Array(props.vertexCoords)
    const normals = new Float32Array(props.planeNormals)
    const indices = new Uint16Array(props.vertexInds)
    const vectorLabels = ["a", "b", "c"];
    let latticeVectors = [];
    let latticeVectorLabels = [];
    props.reciprocalVectors.forEach((vector, index) => {
        latticeVectors.push(
        <LatticeVectors
            vector={vector}
            vectorLength={props.reciprocalVectorLengths[index]}
        />
        );
        latticeVectorLabels.push(
            <Label 
                position={[
                    props.reciprocalVectorLengths[index]*vector[0],
                    props.reciprocalVectorLengths[index]*vector[1],
                    props.reciprocalVectorLengths[index]*vector[2]
                ]}
                quaternion={props.quaternion}
                scale={1.05}
            >
                {vectorLabels[index]}
            </Label>
        )
    });

    let highSymmPoints = [];
    let highSymmLabels = [];
    props.kpointCartCoords.forEach((vector, index) => {
        highSymmPoints.push(
            <HighSymmPoint 
                position={vector}
                color="black"
                radius={0.05}
            />
        );
        highSymmLabels.push(
            <Label 
                position={vector}
                quaternion={props.quaternion}
                scale={1.15}
            >
                {props.kpointLabels[index]}
            </Label>
        )
    });

    return (
            <group position={props.translation} >
            <mesh>
                <bufferGeometry attach="geometry" onUpdate={self => self.computeVertexNormals()}>
                    <bufferAttribute
                        attach='attributes-position'
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach='attributes-normal'
                        array={normals}
                        count={normals.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="index"
                        array={indices}
                        count={indices.length}
                        itemSize={1}
                    />
                </bufferGeometry>
                <Edges
                    scale={1.0}
                    threshold={1} 
                    color="black"
                    side={THREE.DoubleSide}
                />
                {props.showVectors && latticeVectors}
                {props.showVectorLabels && latticeVectorLabels}
                {props.showHighSymmPoints && highSymmPoints}
                {props.showHighSymmLabels &&  highSymmLabels}
                <meshPhysicalMaterial
                    attach="material"
                    color={props.color}
                    opacity={0.5}
                    transparent={props.transparent}
                    depthWrite={true}
                    side={THREE.DoubleSide}
                    flatShading={true}
                    roughness={0.6}
                    metalness={0.6}
                    reflectivity={0.6}
                    clearcoat={0.6}
                />
            </mesh>
            </group>
    );
}

export default BrillouinZone;
