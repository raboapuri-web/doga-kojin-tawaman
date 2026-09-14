import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const {camera} = useThree();
  const t = clamp(frame / 359);

  const p1 = new THREE.Vector3(7.5, 4.4, 9.5);
  const p2 = new THREE.Vector3(3.2, 3.0, 6.6);
  const p3 = new THREE.Vector3(0.9, 2.15, 4.25);
  const target1 = new THREE.Vector3(0, 1.3, 0);
  const target2 = new THREE.Vector3(0, 1.0, 0);

  const phase1 = clamp(frame / 130);
  const phase2 = clamp((frame - 130) / 120);
  const phase3 = clamp((frame - 250) / 110);

  let pos = p1.clone().lerp(p2, phase1);
  if (frame >= 130) pos = p2.clone().lerp(new THREE.Vector3(-2.8, 2.8, 5.7), phase2);
  if (frame >= 250) pos = new THREE.Vector3(-2.8, 2.8, 5.7).lerp(p3, phase3);

  const micro = Math.sin(frame * 0.035) * 0.035;
  pos.y += micro;
  camera.position.copy(pos);
  camera.lookAt(target1.clone().lerp(target2, t));
  camera.updateProjectionMatrix();
  return null;
};

const Person: React.FC<{
  position: [number, number, number];
  rotationY: number;
  color: string;
  phase: number;
}> = ({position, rotationY, color, phase}) => {
  const frame = useCurrentFrame();
  const nod = Math.sin(frame * 0.045 + phase) * 0.035;
  const hand = Math.sin(frame * 0.04 + phase * 2) * 0.08;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.75 + nod, 0]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color="#b88469" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.42, 0.88, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[-0.48, 1.05 + hand, 0.08]} rotation={[0.2, 0, 0.4]}>
        <capsuleGeometry args={[0.11, 0.62, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[0.5, 0.98 - hand * 0.5, 0.14]} rotation={[0.15, 0, -0.48]}>
        <capsuleGeometry args={[0.11, 0.64, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[-0.2, 0.02, 0.02]} rotation={[0.08, 0, 0]}>
        <capsuleGeometry args={[0.13, 0.8, 6, 12]} />
        <meshStandardMaterial color="#1f2428" />
      </mesh>
      <mesh position={[0.2, 0.02, 0.02]} rotation={[0.08, 0, 0]}>
        <capsuleGeometry args={[0.13, 0.8, 6, 12]} />
        <meshStandardMaterial color="#1f2428" />
      </mesh>
    </group>
  );
};

const Glass: React.FC<{position: [number, number, number]}> = ({position}) => (
  <group position={position}>
    <mesh>
      <cylinderGeometry args={[0.13, 0.11, 0.52, 24]} />
      <meshPhysicalMaterial color="#e5c270" transparent opacity={0.7} roughness={0.16} transmission={0.18} />
    </mesh>
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.125, 0.11, 0.28, 24]} />
      <meshStandardMaterial color="#c89431" transparent opacity={0.75} />
    </mesh>
  </group>
);

const ScoreSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [180, 250], [0, 0.84], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lift = interpolate(frame, [250, 359], [0.03, 0.48], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 0.5 + Math.sin(frame * 0.05) * 0.08;
  return (
    <group position={[0, 1.55 + lift, 0]} rotation={[-Math.PI / 2 + 0.07, 0, 0]}>
      <mesh>
        <planeGeometry args={[5.2, 3.2]} />
        <meshBasicMaterial color="#d8e8ff" transparent opacity={reveal * 0.075} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({length: 7}, (_, i) => (
        <mesh key={`v${i}`} position={[-2.25 + i * 0.75, 0, 0.006]}>
          <boxGeometry args={[0.012, 2.8, 0.01]} />
          <meshBasicMaterial color="#b8d8ff" transparent opacity={reveal * pulse} />
        </mesh>
      ))}
      {Array.from({length: 5}, (_, i) => (
        <mesh key={`h${i}`} position={[0, -1.15 + i * 0.58, 0.006]}>
          <boxGeometry args={[4.8, 0.012, 0.01]} />
          <meshBasicMaterial color="#b8d8ff" transparent opacity={reveal * pulse} />
        </mesh>
      ))}
    </group>
  );
};

const IzakayaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lampFlicker = 0.92 + Math.sin(frame * 0.17) * 0.035 + Math.sin(frame * 0.047) * 0.02;
  const smoke = Math.sin(frame * 0.025) * 0.25;
  return (
    <>
      <color attach="background" args={['#120e0c']} />
      <fog attach="fog" args={['#120e0c', 7, 18]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[4, 8, 4]} intensity={0.35} color="#8ca6ba" />
      <pointLight position={[0, 4.7, 0]} intensity={85 * lampFlicker} distance={11} color="#ffba6a" />
      <pointLight position={[-4, 2.5, 2]} intensity={28} distance={7} color="#be5a42" />

      <CameraRig />

      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#2b2521" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.5, -5.2]}>
        <boxGeometry args={[16, 7, 0.25]} />
        <meshStandardMaterial color="#241b17" roughness={1} />
      </mesh>
      <mesh position={[-7.8, 3.5, 0]}>
        <boxGeometry args={[0.25, 7, 11]} />
        <meshStandardMaterial color="#211915" />
      </mesh>

      {Array.from({length: 5}, (_, i) => (
        <group key={i} position={[-5.6 + i * 2.7, 3.4, -5.02]}>
          <mesh>
            <boxGeometry args={[1.7, 1.15, 0.08]} />
            <meshStandardMaterial color={i % 2 ? '#473127' : '#3b2e25'} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[1.45, 0.9]} />
            <meshBasicMaterial color={i % 2 ? '#d29b65' : '#b98d5f'} transparent opacity={0.14} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[5.4, 0.23, 3.4]} />
        <meshStandardMaterial color="#5a3a24" roughness={0.72} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[0.34, 1.0, 0.34]} />
        <meshStandardMaterial color="#2a211b" />
      </mesh>

      <Person position={[-2.4, 0.1, -0.45]} rotationY={1.2} color="#384d62" phase={0.2} />
      <Person position={[2.35, 0.1, -0.45]} rotationY={-1.2} color="#58473f" phase={1.1} />
      <Person position={[-1.2, 0.1, 2.25]} rotationY={0.25} color="#4f5b45" phase={2.0} />
      <Person position={[1.25, 0.1, 2.2]} rotationY={-0.25} color="#5d4a63" phase={2.9} />

      <Glass position={[-1.35, 1.42, -0.65]} />
      <Glass position={[1.45, 1.42, -0.5]} />
      <Glass position={[-0.65, 1.42, 1.0]} />
      <Glass position={[0.85, 1.42, 1.05]} />

      {Array.from({length: 9}, (_, i) => (
        <mesh key={i} position={[-3.8 + i * 0.95, 2.7 + Math.sin(i) * 0.2 + smoke, -1.4 + (i % 3) * 0.75]}>
          <sphereGeometry args={[0.17 + (i % 2) * 0.08, 16, 16]} />
          <meshBasicMaterial color="#d9c6ad" transparent opacity={0.025 + (i % 3) * 0.012} />
        </mesh>
      ))}

      <ScoreSheet />
    </>
  );
};

export const FriendsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const titleIn = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const subtitleOpacity = interpolate(frame, [155, 185, 330, 355], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#0d0b0a'}}>
      <ThreeCanvas width={width} height={height} camera={{fov: 42, near: 0.1, far: 50}}>
        <IzakayaScene />
      </ThreeCanvas>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(circle at 50% 48%, transparent 40%, rgba(0,0,0,.55) 100%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 64,
          fontFamily: 'Noto Sans CJK JP, sans-serif',
          color: 'rgba(255,255,255,.75)',
          fontSize: 22,
          letterSpacing: 4,
          opacity: titleIn * 0.7,
        }}
      >
        REMOTION + REACT THREE FIBER / TEST SCENE
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 66,
          transform: 'translateX(-50%)',
          maxWidth: 1180,
          padding: '11px 22px',
          borderRadius: 9,
          background: 'rgba(0,0,0,.42)',
          backdropFilter: 'blur(8px)',
          color: '#f6f3ec',
          fontFamily: 'Noto Sans CJK JP, sans-serif',
          fontWeight: 600,
          fontSize: 29,
          letterSpacing: 1.4,
          lineHeight: 1.45,
          textAlign: 'center',
          opacity: subtitleOpacity,
          textShadow: '0 2px 8px rgba(0,0,0,.8)',
        }}
      >
        会話の下に、透明な成績表が敷かれている。
      </div>
    </AbsoluteFill>
  );
};
