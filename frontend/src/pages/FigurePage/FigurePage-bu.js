import React from 'react'
import PropTypes from 'prop-types'
import BrillouinZone from '../../components/BrillouinZone/BrillouinZone';
import * as THREE from "three"
import Plane from '../../components/Plane/Plane';

function FigurePage(props) {
    const bulkV1 = new THREE.Vector3().fromArray(props.bulkData.rotationVector1)
    const bulkV2 = new THREE.Vector3().fromArray(props.bulkData.rotationVector2)
    var bulkQuaternion = new THREE.Quaternion();
    bulkQuaternion.setFromUnitVectors( bulkV1, bulkV2 )
    var invBulkQuaternion = new THREE.Quaternion();
    invBulkQuaternion.setFromUnitVectors( bulkV2, bulkV1 )

    const surfV1 = new THREE.Vector3().fromArray(props.surfData.rotationVector1)
    const surfV2 = new THREE.Vector3().fromArray(props.surfData.rotationVector2)
    var surfQuaternion = new THREE.Quaternion();
    surfQuaternion.setFromUnitVectors( surfV1, surfV2 )
    var invSurfQuaternion = new THREE.Quaternion();
    invSurfQuaternion.setFromUnitVectors( surfV2, surfV1 )

    let bulkBrillouinZones = [];
    props.bulkData.shifts.forEach((shift, index) => {
        bulkBrillouinZones.push(
        <BrillouinZone
            vertexCoords={props.bulkData.vertexCoords}
            vertexInds={props.bulkData.vertexInds}
            color="grey"
            translation={shift} 
            planeNormals={props.bulkData.planeNormals} 
            reciprocalVectors={props.bulkData.reciprocalVectors}
            reciprocalVectorLengths={props.bulkData.reciprocalVectorLengths}
            kpointCartCoords={props.bulkData.kpointCartCoords}
            kpointLabels={props.bulkData.kpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={true}
            quaternion={invSurfQuaternion}
        />
        );
    });

    let surfBrillouinZones = [];
    props.surfData.shifts.forEach((shift, index) => {
        surfBrillouinZones.push(
        <BrillouinZone
            vertexCoords={props.surfData.vertexCoords}
            vertexInds={props.surfData.vertexInds}
            color="red"
            translation={shift} 
            planeNormals={props.surfData.planeNormals} 
            reciprocalVectors={props.surfData.reciprocalVectors}
            reciprocalVectorLengths={props.surfData.reciprocalVectorLengths}
            kpointCartCoords={props.surfData.kpointCartCoords}
            kpointLabels={props.surfData.kpointLabels}
            showVectors={true}
            showVectorLabels={true}
            showHighSymmPoints={true}
            showHighSymmLabels={true}
            transparent={true}
            quaternion={invSurfQuaternion}
        />
        );
    });

    return (
        <mesh>
            <group 
            quaternion={surfQuaternion}
            >
                {bulkBrillouinZones}
            </group>
            <group 
                quaternion={surfQuaternion} 
                position={[0, 1.5, 0]}
            >
                <group>
                    {surfBrillouinZones}
                </group>
            </group>
            {/* <group quaternion={surfQuaternion} position={[0, 3.0, 0]}>
                <group rotation={[0, 0, Math.PI / 4 + (2 * Math.PI / 6)]}>
                    {surfBrillouinZones}
                </group>
            </group> */}
            {/* <group rotation={[0, Math.PI / 4 + (2 * Math.PI / 6), 0]}>
                <Plane color="blue"/>
            </group> */}
        </mesh>
    )
}

FigurePage.propTypes = {}

export default FigurePage