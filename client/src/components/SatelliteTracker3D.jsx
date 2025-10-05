import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { motion } from 'framer-motion';

// Earth component with realistic textures
function Earth({ radius = 1 }) {
  const earthRef = useRef();
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Earth rotation
    }
  });

  // Simulated earth texture using gradients
  const earthGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);
  
  return (
    <group ref={earthRef}>
      <mesh geometry={earthGeometry}>
        <meshStandardMaterial 
          color="#4A90E2"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Earth atmosphere */}
      <mesh geometry={earthGeometry} scale={1.02}>
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Satellite component
function SatelliteObject({ position, name, type, onClick, isSelected }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0); // Always face Earth
    }
  });

  const color = type === 'debris' ? '#ff4444' : 
                type === 'station' ? '#44ff44' : '#ffaa44';

  return (
    <group position={position} onClick={() => onClick && onClick(name)}>
      <mesh ref={meshRef} scale={isSelected ? 0.08 : 0.05}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {isSelected && (
        <Html>
          <div className="badge bg-primary p-2" style={{transform: 'translate(-50%, -100%)'}}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Orbital path component
function OrbitalPath({ radius, inclination = 0, color = '#ffffff' }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius);
    const points = curve.getPoints(100);
    return points.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
}

// Main 3D Scene
function Scene({ selectedSatellite, onSatelliteSelect, satellites }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Stars radius={300} depth={50} count={1000} factor={4} />
      
      <Earth />
      
      {/* LEO orbital zones */}
      <OrbitalPath radius={1.3} color="#44ff44" />
      <OrbitalPath radius={1.5} color="#ffaa44" />
      <OrbitalPath radius={1.8} color="#ff4444" />
      
      {/* Satellites */}
      {satellites.map((sat) => (
        <SatelliteObject
          key={sat.id}
          position={sat.position}
          name={sat.name}
          type={sat.type}
          isSelected={selectedSatellite?.id === sat.id}
          onClick={onSatelliteSelect}
        />
      ))}
      
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
}

const SatelliteTracker3D = ({ onBack }) => {
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [satellites, setSatellites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingMode, setTrackingMode] = useState('realtime'); // realtime, simulation, historical
  const [filterType, setFilterType] = useState('all'); // all, active, debris, stations

  // Generate realistic satellite data
  useEffect(() => {
    const generateSatellites = () => {
      const sats = [];
      
      // ISS
      sats.push({
        id: 'iss',
        name: 'International Space Station',
        type: 'station',
        altitude: 408,
        inclination: 51.6,
        position: [1.3, 0.2, 0.8],
        velocity: 7.66,
        country: 'International',
        launchDate: '1998-11-20',
        mass: 420000
      });

      // Starlink constellation
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 1.4 + Math.random() * 0.3;
        sats.push({
          id: `starlink-${i}`,
          name: `Starlink-${4000 + i}`,
          type: 'communication',
          altitude: 550 + Math.random() * 50,
          position: [
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.4,
            Math.sin(angle) * radius
          ],
          velocity: 7.5,
          country: 'USA',
          launchDate: '2023-03-15'
        });
      }

      // OneWeb satellites
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.6;
        sats.push({
          id: `oneweb-${i}`,
          name: `OneWeb-${600 + i}`,
          type: 'communication',
          altitude: 1200,
          position: [
            Math.cos(angle + Math.PI/4) * radius,
            (Math.random() - 0.5) * 0.3,
            Math.sin(angle + Math.PI/4) * radius
          ],
          velocity: 7.3,
          country: 'UK',
          launchDate: '2023-01-10'
        });
      }

      // Space debris
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.2 + Math.random() * 0.8;
        sats.push({
          id: `debris-${i}`,
          name: `Debris Object ${1000 + i}`,
          type: 'debris',
          altitude: 300 + Math.random() * 800,
          position: [
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.6,
            Math.sin(angle) * radius
          ],
          velocity: 7.4 + Math.random() * 0.5,
          country: 'Unknown',
          risk: 'High'
        });
      }

      // Earth observation satellites
      const earthObsSats = [
        'Landsat 9', 'Sentinel-2A', 'Sentinel-2B', 'Planet Dove', 'MODIS Terra'
      ];
      
      earthObsSats.forEach((name, i) => {
        const angle = (i / earthObsSats.length) * Math.PI * 2;
        const radius = 1.7;
        sats.push({
          id: `eo-${i}`,
          name,
          type: 'observation',
          altitude: 705,
          position: [
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.2,
            Math.sin(angle) * radius
          ],
          velocity: 7.2,
          country: 'Various'
        });
      });

      return sats;
    };

    setTimeout(() => {
      setSatellites(generateSatellites());
      setIsLoading(false);
    }, 1500);
  }, []);

  // Update satellite positions in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Animate satellite positions
      setSatellites(prev => prev.map(sat => {
        if (sat.type !== 'debris') {
          const time = Date.now() * 0.0001;
          const radius = Math.sqrt(sat.position[0]**2 + sat.position[2]**2);
          const newAngle = Math.atan2(sat.position[2], sat.position[0]) + 0.01;
          
          return {
            ...sat,
            position: [
              Math.cos(newAngle) * radius,
              sat.position[1] + (Math.random() - 0.5) * 0.02,
              Math.sin(newAngle) * radius
            ]
          };
        }
        return sat;
      }));
    }, trackingMode === 'realtime' ? 100 : 1000);

    return () => clearInterval(interval);
  }, [trackingMode]);

  const filteredSatellites = satellites.filter(sat => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return sat.type !== 'debris';
    if (filterType === 'debris') return sat.type === 'debris';
    if (filterType === 'stations') return sat.type === 'station';
    return true;
  });

  const stats = {
    total: satellites.length,
    active: satellites.filter(s => s.type !== 'debris').length,
    debris: satellites.filter(s => s.type === 'debris').length,
    stations: satellites.filter(s => s.type === 'station').length
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 100%)'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <h4 className="text-light">Loading Satellite Data...</h4>
          <p className="text-muted">Connecting to tracking networks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-100" style={{background: '#000'}}>
      {/* Header Panel */}
      <div className="position-absolute top-0 start-0 end-0 p-3 text-white" style={{zIndex: 1000, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'}}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-light me-3" onClick={onBack}>
              <i className="fas fa-arrow-left me-2"></i>Back
            </button>
            <h4 className="mb-0">
              <i className="fas fa-satellite me-2 text-primary"></i>
              LEO Satellite Tracker 3D
            </h4>
          </div>
          
          <div className="d-flex align-items-center">
            <span className="badge bg-success me-3">
              <i className="fas fa-circle me-1"></i>
              LIVE {currentTime.toLocaleTimeString()}
            </span>
            
            <div className="btn-group me-3" role="group">
              <button 
                className={`btn btn-sm ${trackingMode === 'realtime' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTrackingMode('realtime')}
              >
                Real-time
              </button>
              <button 
                className={`btn btn-sm ${trackingMode === 'simulation' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTrackingMode('simulation')}
              >
                Simulation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D View */}
      <Canvas
        camera={{ position: [3, 2, 3], fov: 60 }}
        style={{ width: '100%', height: '100vh' }}
      >
        <Scene 
          selectedSatellite={selectedSatellite}
          onSatelliteSelect={(satId) => {
            const sat = satellites.find(s => s.name === satId);
            setSelectedSatellite(sat);
          }}
          satellites={filteredSatellites}
        />
      </Canvas>

      {/* Left Sidebar - Satellite List */}
      <motion.div 
        className="position-absolute top-0 start-0 h-100 bg-dark text-white"
        style={{width: '320px', zIndex: 1001, marginTop: '80px'}}
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-3 border-bottom border-secondary">
          <h6>Satellite Filters</h6>
          <div className="btn-group w-100" role="group">
            <button 
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterType('all')}
            >
              All ({stats.total})
            </button>
            <button 
              className={`btn btn-sm ${filterType === 'active' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterType('active')}
            >
              Active ({stats.active})
            </button>
            <button 
              className={`btn btn-sm ${filterType === 'debris' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilterType('debris')}
            >
              Debris ({stats.debris})
            </button>
          </div>
        </div>

        <div className="overflow-auto" style={{height: 'calc(100vh - 200px)'}}>
          {filteredSatellites.map((sat) => (
            <div 
              key={sat.id}
              className={`p-3 border-bottom border-secondary cursor-pointer hover-bg-secondary ${selectedSatellite?.id === sat.id ? 'bg-primary' : ''}`}
              onClick={() => setSelectedSatellite(sat)}
              style={{cursor: 'pointer'}}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{sat.name}</h6>
                  <small className={`badge ${
                    sat.type === 'debris' ? 'bg-danger' : 
                    sat.type === 'station' ? 'bg-success' : 
                    'bg-info'
                  }`}>
                    {sat.type.toUpperCase()}
                  </small>
                </div>
                <small className="text-muted">{sat.altitude}km</small>
              </div>
              
              {sat.velocity && (
                <small className="text-info d-block mt-1">
                  <i className="fas fa-tachometer-alt me-1"></i>
                  {sat.velocity} km/s
                </small>
              )}
              
              {sat.country && (
                <small className="text-muted d-block">
                  <i className="fas fa-flag me-1"></i>
                  {sat.country}
                </small>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Sidebar - Satellite Details */}
      {selectedSatellite && (
        <motion.div 
          className="position-absolute top-0 end-0 h-100 bg-dark text-white border-start border-secondary"
          style={{width: '350px', zIndex: 1001, marginTop: '80px'}}
          initial={{ x: 350 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex justify-content-between align-items-start">
              <h5>{selectedSatellite.name}</h5>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedSatellite(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <span className={`badge ${
              selectedSatellite.type === 'debris' ? 'bg-danger' : 
              selectedSatellite.type === 'station' ? 'bg-success' : 
              'bg-info'
            }`}>
              {selectedSatellite.type.toUpperCase()}
            </span>
          </div>

          <div className="p-3">
            <h6 className="text-primary mb-3">Orbital Parameters</h6>
            
            <div className="row mb-2">
              <div className="col-6">
                <small className="text-muted">Altitude</small>
                <div className="text-info">{selectedSatellite.altitude} km</div>
              </div>
              <div className="col-6">
                <small className="text-muted">Velocity</small>
                <div className="text-info">{selectedSatellite.velocity} km/s</div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <small className="text-muted">Inclination</small>
                <div className="text-info">{selectedSatellite.inclination || 'N/A'}°</div>
              </div>
              <div className="col-6">
                <small className="text-muted">Period</small>
                <div className="text-info">~90 min</div>
              </div>
            </div>

            <hr className="border-secondary" />

            <h6 className="text-primary mb-3">Mission Details</h6>
            
            {selectedSatellite.country && (
              <div className="mb-2">
                <small className="text-muted">Country/Operator</small>
                <div>{selectedSatellite.country}</div>
              </div>
            )}

            {selectedSatellite.launchDate && (
              <div className="mb-2">
                <small className="text-muted">Launch Date</small>
                <div>{new Date(selectedSatellite.launchDate).toLocaleDateString()}</div>
              </div>
            )}

            {selectedSatellite.mass && (
              <div className="mb-2">
                <small className="text-muted">Mass</small>
                <div>{selectedSatellite.mass.toLocaleString()} kg</div>
              </div>
            )}

            {selectedSatellite.risk && (
              <div className="mb-2">
                <small className="text-muted">Collision Risk</small>
                <div className="text-danger">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {selectedSatellite.risk}
                </div>
              </div>
            )}

            <hr className="border-secondary" />

            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-crosshairs me-2"></i>
                Track Satellite
              </button>
              <button className="btn btn-outline-info btn-sm">
                <i className="fas fa-chart-line me-2"></i>
                View Predictions
              </button>
              <button className="btn btn-outline-warning btn-sm">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Collision Analysis
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Stats Bar */}
      <div className="position-absolute bottom-0 start-0 end-0 p-2" style={{background: 'rgba(0,0,0,0.8)', zIndex: 1000}}>
        <div className="row text-center text-white">
          <div className="col-3">
            <small className="text-muted d-block">Total Objects</small>
            <strong className="text-primary">{stats.total}</strong>
          </div>
          <div className="col-3">
            <small className="text-muted d-block">Active Satellites</small>
            <strong className="text-success">{stats.active}</strong>
          </div>
          <div className="col-3">
            <small className="text-muted d-block">Space Debris</small>
            <strong className="text-danger">{stats.debris}</strong>
          </div>
          <div className="col-3">
            <small className="text-muted d-block">Last Update</small>
            <strong className="text-info">{currentTime.toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteTracker3D;