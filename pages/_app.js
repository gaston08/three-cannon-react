import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { Physics, Debug } from '@react-three/cannon';
import './globals.css';
import { createContext } from 'react';
import DatGui, { DatButton } from 'react-dat-gui';
import Lights from '../components/Lights';

const CanvasContext = createContext(null);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const MATERIAL_BALLS_COUNT = 3;

export default function App({ Component, pageProps }) {

  useEffect(() => {
    console.clear();
  }, []);

  const [state, setState] = useState({
    spheres: [],
    materials: [],
    hitSound: undefined,
  });

  const addSpheres = () => {
    setState(prev => {
      let newSpheres = [...prev.spheres];

      const materialIndex = Math.floor(Math.random() * MATERIAL_BALLS_COUNT);
      const scale = getRandomArbitrary(0.1, 0.3);
      const position = [
        getRandomArbitrary(-1, 1),
        2,
        getRandomArbitrary(-1, 1),
      ];

      newSpheres.push({
        scale,
        position,
        materialIndex,
      });

      return {
        ...prev,
        spheres: newSpheres,
      }
    });
  }  

  return (
    <CanvasContext.Provider value={{state, setState}}>
      <DatGui data={state} >
        <DatButton label="add spheres" onClick={addSpheres}/>
      </DatGui>
      <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.1,
          far: 200,
          position: [1.5, 1.5, 0]
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls />
          {/* <Stats /> */}
          <Lights />
          <Physics 
            allowSleep
            gravity={[0, -9.82, 0]}
            broadphase='SAP'
            defaultContactMaterial={{
              friction: 0.1,
              restitution: 0.7
            }}
          >
            {/* <Debug color="black" scale={1.1}> */}
              <Component {...pageProps} />
            {/* </Debug> */}
          </Physics>
        </Suspense>
      </Canvas>
    </CanvasContext.Provider>
  );
}

export { CanvasContext };