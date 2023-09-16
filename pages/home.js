import React from 'react';
import { useContext } from 'react';
import { CanvasContext } from './_app';

function createSphere() {
  console.log("HOLA")
}

export default function Home() {

  const { state } = useContext(CanvasContext);

  return (
    <>
      <gridHelper args={[10, 10]} />
      <Floor position={[0, 0, 0]} />
      <>
        {
          state.spheres.map((sphere, i) => {
            return (
              <Sphere
                key={i}
                {...sphere}
              />
            );
          })
        }
      </>
    </>
  );
}

function Floor(props) {
  return (
    <mesh
      {...props}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial />
    </mesh>
  )
}

function Sphere(props) {

  const { scale, position } = props;

  return (
    <mesh
      scale={[scale, scale, scale]}
      position={position}
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}