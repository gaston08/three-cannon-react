import React, { useContext, useMemo, useEffect, useState } from 'react';
import { CanvasContext } from './_app';
import { usePlane, useSphere } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';

const lapisLazuli = 'balls/lapis_lazuli';
const malachite = 'balls/malachite';
const tigerEyeGem = 'balls/tiger_eye_gem';


export default function Home() {

  const { state, setState } = useContext(CanvasContext);

  const materials = useMemo(() => {
    const arr = [
      getMaterial(lapisLazuli),
      getMaterial(malachite),
      getMaterial(tigerEyeGem),
    ];
    return arr;
  }, [lapisLazuli, malachite, tigerEyeGem]);

  const materials_length = materials.length;

  useEffect(() => {
    setState(prev => {
      return {
        ...prev,
        materials,
      }
    });
  }, [materials_length]);

  useEffect(() => {
    setState(prev => {
      return {
        ...prev,
        hitSound: new Audio('/sounds/hit.mp3')
      }
    });
  }, []);

  return state.hitSound && (
    <>
      {/* <gridHelper args={[10, 10]} /> */}
      <Plane position={[0, 0, 0]} />
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

function Plane(props) {
  const rotation = [-Math.PI / 2, 0, 0];
  const [ref] = usePlane(() => ({ rotation, ...props }));

  const material = getMaterial('floor');
  return (
    <mesh
      ref={ref}
      {...props}
      rotation={rotation}
      receiveShadow
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial {...material} />
    </mesh>
  )
}

function Sphere(props) {

  const { state } = useContext(CanvasContext);
  const { scale, position, materialIndex } = props;
  const [ref] = useSphere(() => ({ 
    ...props,
    args: [scale, 10, 10],
    mass: scale,
    position,
    onCollide: (args) => {
      playSound(args, state.hitSound)
    },
  }));

  return (
    <mesh
      ref={ref}
      scale={[scale, scale, scale]}
      position={position}
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial {...state.materials[materialIndex]} />
    </mesh>
  );
}

function getMaterial(name) {
  const [colorMap, normal, roughness, ao, height] = useLoader(TextureLoader, [
    `/${name}/basecolor.jpg`,
    `/${name}/normal.jpg`,
    `/${name}/roughness.jpg`,
    `/${name}/ao.jpg`,
    `/${name}/height.png`,
  ]);

  colorMap.repeat.set(4, 4);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  colorMap.generateMipmaps = false;
  colorMap.minFilter = THREE.NearestFilter;
  colorMap.magFilter = THREE.NearestFilter;

  const material = new THREE.MeshStandardMaterial({ 
    map: colorMap,
  });

  material.normalMap = normal;
  material.roughnessMap = roughness;
  material.aoMap = ao;
  material.bumpMap = height;

  return material;
}

function playSound(collision, hitSound) {
  const impactStrength = collision.contact.impactVelocity;

  let int = parseInt(impactStrength);
  let min = 0, max = 0;

  switch(int) {
      case 6:
          min = 0.8;
          max = 1;
          break;
      case 5:
          min = 0.6;
          max = 0.8;
          break;
      case 4:
          min = 0.4;
          max = 0.6;
          break;
      case 3:
          min = 0.2;
          max = 0.4;
          break;
      case 2:
          min = 0.1;
          max = 0.2;
          break;
      case 1:
          min = 0.01;
          max = 0.04;
  }

  let volume = getRandomArbitrary(min, max);
  hitSound.volume = volume;
  hitSound.currentTime = 0;
  hitSound.play();
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}