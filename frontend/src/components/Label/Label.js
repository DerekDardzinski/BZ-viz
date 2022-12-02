import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, TrackballControls } from '@react-three/drei'

function Label(props) {
    // var position = props.position + [0.1, 0.1, 0.1]
    const vec = new THREE.Vector3().fromArray(props.position)
    // vec[0] += 0.1
    // const position = props.position.map(v => v + 0.2);
    // let position = [];
    if (vec.length() != 0) {
    //     // console.log(props.children, 'is zero')
        vec.multiplyScalar(props.scale)
    }
    //     position = props.position;
    // }

    // console.log(props.children, position, length)
    const ref = useRef()
    console.log(props.children, ref)
    useFrame(({ camera }) => {
        // console.log(camera.quaternion)
        // let new_quaterion = camera.quaternion.multiply(props.quaternion)
        const newQuat = new THREE.Quaternion();
        const invQuat = props.quaternion;
        newQuat.multiplyQuaternions(invQuat, camera.quaternion)

        ref.current.quaternion.copy(newQuat)
    })
    return (
        <group position={vec.toArray()} >
            <Text
                ref={ref} 
                color="black"
                // depthWrite={true}
            >
                {props.children}
                <meshBasicMaterial/>
            </Text>
        </group>
    )
  
}

Label.propTypes = {}

export default Label
