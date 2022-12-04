import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, softShadows, Stage, Center } from "@react-three/drei";
import "./Display.css";

function Display(props) {
  softShadows();
  return (
    <Canvas>
    <Stage
        adjustCamera={1.5}
        intensity={0.5}
        shadows="contact"
        environment="studio"
        preset="soft"
    >
    <Center top left>
      {props.children}
    </Center>
    </Stage>
    <OrbitControls makeDefault />
  </Canvas>
  );
}

export default Display;
