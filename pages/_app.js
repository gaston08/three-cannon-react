import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import './globals.css';
import { createContext } from 'react';
import DatGui, { DatButton } from 'react-dat-gui';
import Lights from '../components/Lights';

const CanvasContext = createContext(null);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default function App({ Component, pageProps }) {

  const [state, setState] = useState({
    spheres: []
  });

  const addSpheres = () => {
    setState(prev => {
      let newSpheres = [...prev.spheres];

      const scale = getRandomArbitrary(0.1, 0.3);
      const position = [
        getRandomArbitrary(-1, 1),
        2,
        getRandomArbitrary(-1, 1),
      ];

      newSpheres.push({
        scale,
        position,
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
          fov: 45,
          near: 0.1,
          far: 200,
          position: [ 2.5, 4, 6 ]
        }}
      >
        <OrbitControls />
        {/* <Stats /> */}
        <Lights />
        <Physics>
          <Component {...pageProps} />
        </Physics>
      </Canvas>
    </CanvasContext.Provider>
  );
}

export { CanvasContext };