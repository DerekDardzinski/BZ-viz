import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BrillouinZone from '../../components/BrillouinZone/BrillouinZone';
import * as THREE from "three"
import Plane from '../../components/Plane/Plane';
import StructureContext from '../../components/StructureContext/StructureContext';

function FigurePage(props) {
    const data = useContext(StructureContext);
    let bulk = data.bulk;
    let surf001 = props.surf;
    // let surf110 = data.surf110;
    // let surf111 = data.surf111;

    // console.log(surf001)
    const shift = new THREE.Vector3().fromArray(surf001.surfaceNormal).multiplyScalar(1.1 * bulk.reciprocalVectorLengths[0]);
    const V1 = new THREE.Vector3().fromArray(surf001.surfaceNormal).multiplyScalar(1)
    const V2 = new THREE.Vector3().fromArray([0,1,0])
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors( V1, V2 );
    var invQuaternion = new THREE.Quaternion();
    invQuaternion.setFromUnitVectors( V2, V1 );

    return (
        <mesh>
        <group
            quaternion={quaternion}
        >
        <BrillouinZone
            vertexCoords={bulk.vertexCoords}
            vertexInds={bulk.vertexInds}
            color="grey"
            translation={bulk.shifts[0]} 
            planeNormals={bulk.planeNormals} 
            reciprocalVectors={bulk.reciprocalVectors}
            reciprocalVectorLengths={bulk.reciprocalVectorLengths}
            kpointCartCoords={bulk.initKpointCartCoords}
            kpointLabels={bulk.initKpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={true}
            quaternion={invQuaternion}
        />
        <BrillouinZone
            vertexCoords={surf001.vertexCoords}
            vertexInds={surf001.vertexInds}
            color="blue"
            translation={shift} 
            planeNormals={surf001.planeNormals} 
            reciprocalVectors={surf001.reciprocalVectors}
            reciprocalVectorLengths={surf001.reciprocalVectorLengths}
            kpointCartCoords={surf001.allKpointCartCoords}
            kpointLabels={surf001.allKpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={true}
            quaternion={invQuaternion}
        />
        {/* <BrillouinZone
            vertexCoords={surf110.vertexCoords}
            vertexInds={surf110.vertexInds}
            color="green"
            translation={surf110.surfaceNormal} 
            planeNormals={surf110.planeNormals} 
            reciprocalVectors={surf110.reciprocalVectors}
            reciprocalVectorLengths={surf110.reciprocalVectorLengths}
            kpointCartCoords={surf110.initKpointCartCoords}
            kpointLabels={surf110.initKpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={false}
            quaternion={invQuaternion}
        />
        <BrillouinZone
            vertexCoords={surf111.vertexCoords}
            vertexInds={surf111.vertexInds}
            color="blue"
            translation={surf111.surfaceNormal} 
            planeNormals={surf111.planeNormals} 
            reciprocalVectors={surf111.reciprocalVectors}
            reciprocalVectorLengths={surf111.reciprocalVectorLengths}
            kpointCartCoords={surf111.initKpointCartCoords}
            kpointLabels={surf111.initKpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={false}
            quaternion={invQuaternion}
        />             */}
        </group>
        </mesh>
    )
}

FigurePage.propTypes = {}

export default FigurePage