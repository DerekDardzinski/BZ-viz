import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from "three"
import { Edges } from '@react-three/drei'

function Plane(props) {
    // const positions = new Float32Array(props.vertexCoords)
    const positions = new Float32Array([
        1, 0, 0,
        1/2, 0, Math.sqrt(3) / 2,
        -1/2, 0, Math.sqrt(3) / 2,
        -1, 0, 0,
        -1/2, 0, -Math.sqrt(3) / 2,
        1/2, 0, -Math.sqrt(3) / 2,
    ])
    // const normals = new Float32Array(props.planeNormals)
    const normals = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ])

    // const indices = new Uint16Array(props.vertexInds)
    const indices = new Uint16Array([
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7
    ])
    return (
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
            <meshPhysicalMaterial
                attach="material"
                color={props.color}
                opacity={1.0}
                transparent={false}
                depthWrite={true}
                side={THREE.DoubleSide}
                flatShading={true}
                roughness={0.1}
                metalness={0.1}
                reflectivity={0.1}
                clearcoat={0.1}
            />
        </mesh>
    )
}

Plane.propTypes = {}

export default Plane
