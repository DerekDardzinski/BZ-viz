// Importing modules
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber'
import { softShadows, OrbitControls, Edges, Stage, Center, Sphere } from '@react-three/drei'
import "./App.css";
import Display from "./components/Display/Display.js"
import BrillouinZone from "./components/BrillouinZone/BrillouinZone.js"
import * as THREE from "three";
import LatticeVectors from "./components/LatticeVector/LatticeVectors";
import HomePage from "./pages/HomePage/HomePage";
import FigurePage from "./pages/FigurePage/FigurePage";
import FilePicker from "./components/FilePicker/FilePicker";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function App() {
	const [bulkData, setBulkData] = useState({
		vertexInds: [],
		vertexCoords: [],
        shifts: [],
        planeNormals: [],
        reciprocalVectors: [],
        reciprocalVectorLengths: [],
        kpointFracCoords: [],
        kpointCartCoords: [],
        kpointLabels: [],
        rotationVector1: [],
        rotationVector2: [],
	});

	useEffect(() => {
		fetch("/bulkData").then((res) =>
			res.json().then((bulkData) => {
				setBulkData({
					vertexCoords: bulkData.vertexCoords,
					vertexInds: bulkData.vertexInds,
                    shifts: bulkData.shifts,
                    planeNormals: bulkData.planeNormals,
                    reciprocalVectors: bulkData.reciprocalVectors,
                    reciprocalVectorLengths: bulkData.reciprocalVectorLengths,
                    kpointFracCoords: bulkData.kpointFracCoords,
                    kpointCartCoords: bulkData.kpointCartCoords,
                    kpointLabels: bulkData.kpointLabels,
                    rotationVector1: bulkData.rotationVector1,
                    rotationVector2: bulkData.rotationVector2
				});
			})
		);
	}, []);

    const [surfData, setSurfData] = useState({
		vertexInds: [],
		vertexCoords: [],
        shifts: [],
        planeNormals: [],
        reciprocalVectors: [],
        reciprocalVectorLengths: [],
        kpointFracCoords: [],
        kpointCartCoords: [],
        kpointLabels: [],
        rotationVector1: [],
        rotationVector2: [],
	});

	useEffect(() => {
		fetch("/surfData").then((res) =>
			res.json().then((surfData) => {
				setSurfData({
					vertexCoords: surfData.vertexCoords,
					vertexInds: surfData.vertexInds,
                    shifts: surfData.shifts,
                    planeNormals: surfData.planeNormals,
                    reciprocalVectors: surfData.reciprocalVectors,
                    reciprocalVectorLengths: surfData.reciprocalVectorLengths,
                    kpointFracCoords: surfData.kpointFracCoords,
                    kpointCartCoords: surfData.kpointCartCoords,
                    kpointLabels: surfData.kpointLabels,
                    rotationVector1: surfData.rotationVector1,
                    rotationVector2: surfData.rotationVector2
				});
			})
		);
	}, []);

    softShadows();

    // let colors = ["hotpink"];
    // let brillouinZones = [];
    // data.shifts.forEach((shift, index) => {
    //     brillouinZones.push(
    //     <BrillouinZone
    //         vertexCoords={data.vertexCoords}
    //         vertexInds={data.vertexInds}
    //         color={getRandomColor()} 
    //         translation={shift} 
    //         planeNormals={data.planeNormals} 
    //         reciprocalVectors={data.reciprocalVectors}
    //         reciprocalVectorLengths={data.reciprocalVectorLengths}
    //         kpointCartCoords={data.kpointCartCoords}
    //         kpointLabels={data.kpointLabels}
    //         showVectors={true}
    //         showVectorLabels={true}
    //         showHighSymmPoints={true}
    //         showHighSymmLabels={true}
    //     />
    //     );
    // });

	return (
		<div className="App">
        {/* <FilePicker/> */}
        <Canvas
            shadows
            colorManagement
            shadowMap
        >
            <Stage
                adjustCamera={2.0}
                intensity={0.5}
                shadows="contact"
                environment="studio"
                preset="soft"
            >
            <Center top left>
                <FigurePage bulkData={bulkData} surfData={surfData}/>
            </Center>
            </Stage>
            <OrbitControls makeDefault />
        </Canvas>
		</div>
	);
}

export default App;
