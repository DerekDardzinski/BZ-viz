import React from 'react'
import * as THREE from 'three'

function LatticeVectors(props) {
  console.log(props.x)
  // const dir = new THREE.Vector3( props.vector[0], props.vector[1], props.vector[2] );
  const dir = new THREE.Vector3().fromArray(props.vector);
  const origin = new THREE.Vector3( 0, 0, 0 );
  const length = props.vectorLength
  const hex = 0x000000
  const headLength = 0.1 * length
  const headWidth = 0.3 * headLength
  return (
    <mesh>
      <arrowHelper args={[dir, origin, length, hex, headLength, headWidth]} />
    </mesh>
  )
}

export default LatticeVectors