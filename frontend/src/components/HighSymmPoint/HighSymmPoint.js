import React from 'react'
import PropTypes from 'prop-types'
import { Sphere } from "@react-three/drei"
import * as THREE from "three"

function HighSymmPoint(props) {
    return (
        <group position={props.position}>
            <Sphere args={[props.radius, 32, 16]} >
                {/* <meshPhongMaterial
                    attach="material"
                    color={props.color}
                    side={THREE.DoubleSide}
                /> */}
                <meshPhysicalMaterial
                    attach="material"
                    color={props.color}
                    depthWrite={true}
                    side={THREE.DoubleSide}
                    flatShading={false}
                    roughness={0.6}
                    metalness={0.6}
                    reflectivity={0.6}
                    clearcoat={0.6}
                />
            </Sphere>
        </group>
    )
}

HighSymmPoint.propTypes = {}

export default HighSymmPoint
