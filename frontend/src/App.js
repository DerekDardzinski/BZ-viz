// Importing modules
import React, { useState, useEffect, useRef, createContext } from "react";
import { Canvas, useFrame } from '@react-three/fiber'
import { softShadows, OrbitControls, Edges, Stage, Center, Sphere } from '@react-three/drei'
import "./App.css";
import * as THREE from "three";
import FigurePage from "./pages/FigurePage/FigurePage";
import FilePicker from "./components/FilePicker/FilePicker";
import StructureContext from "./components/StructureContext/StructureContext";
import Display from "./components/Display/Display";
// import Card from "./components/Card/Card";
// import { Card } from "@mui/material"


function App() {
    // softShadows();
    // const Context = createContext();
    const [data, setData] = useState('');
    // const data = {
    //     "name": "Derek Dardzinski"
    // }
    let page;
    if (data !== '') {
        page = (
        <>
        <div className="left">
        <Display>
            <FigurePage surf={data.surf001}/>
        </Display>
        </div>
        <div className="middle">
        <Display>
            <FigurePage surf={data.surf110}/>
        </Display>
        </div>
        <div className="right">
        <Display>
            <FigurePage surf={data.surf111}/>
        </Display>
        </div>
        </>
    )} else {
        page = <></>
    }

	return (
        <StructureContext.Provider value={data}>
        <div className="App">
        <FilePicker
            state={data}
            setState={setData}
        />
        {page}
        </div>
        </StructureContext.Provider>
	);
}

export default App;
