import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import '../styles/dark-theme.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import RealStatsService from '../services/RealStatsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = ({ onBack }) => {
  const [realTimeData, setRealTimeData] = useState({
    activeSatellites: null,
    debrisObjects: null,
    collisionAlerts: null,
    conjunctions: null
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsService] = useState(() => new RealStatsService());

  // Load real satellite data
  const loadRealTimeData = async () => {
    try {
      const stats = await statsService.getRealSatelliteStats();

      if (stats.error || stats.dataQuality === 'error') {
        throw new Error(stats.error || 'Could not fetch real satellite data');
      }

      return {
        activeSatellites: stats.activeSatellites,
        debrisObjects: stats.debrisTracked,
        collisionAlerts: null, // Not available in current APIs
        conjunctions: stats.conjunctions
      };
    } catch (error) {
      console.error('Error loading real-time data:', error);
      throw error;
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await loadRealTimeData();
        setRealTimeData(data);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError(error.message);
      }
      
      setLoading(false);
    };

    loadInitialData();

    // Actualizar datos cada 30 segundos
    const interval = setInterval(async () => {
      try {
        const data = await loadRealTimeData();
        setRealTimeData(data);
        setError(null); // Limpiar error si se recupera
      } catch (error) {
        console.error('Error updating real-time data:', error);
        // No mostrar error en actualización automática
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'white' } }
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  return (
    <div className="min-vh-100 dark-theme" style={{
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f3a 50%, #2d1b69 100%)',
      color: '#ffffff'
    }}>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
        }}>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-light me-4" onClick={onBack} style={{
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-arrow-left me-2"></i>Back to Home
            </button>
            <h2 className="mb-0" style={{
              color: '#ffffff',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              textShadow: '0 0 15px rgba(58,160,255,0.8)'
            }}>
              <i className="fas fa-satellite-dish me-3" style={{color: '#3aa0ff'}}></i>
              LEO Operations Dashboard
            </h2>
          </div>
          <span className="badge px-4 py-2" style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            fontSize: '14px',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(40,167,69,0.4)'
          }}>
            <i className="fas fa-circle me-2" style={{
              animation: 'pulse 2s infinite',
              color: '#ffffff'
            }}></i>
            LIVE - {new Date().toLocaleTimeString()}
          </span>
        </div>
        {/* Stats Cards */}
        <div className="row mb-5 g-4">
          <div className="col-md-3">
            <motion.div className="card text-white h-100" whileHover={{ scale: 1.05, y: -5 }} style={{
              background: 'linear-gradient(135deg, rgba(40,167,69,0.3) 0%, rgba(32,201,151,0.3) 100%)',
              border: '2px solid #28a745',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(40,167,69,0.3)'
            }}>
              <div className="card-body text-center p-4">
                <i className="fas fa-satellite mb-3" style={{ fontSize: '3rem', color: '#28a745', textShadow: '0 0 20px rgba(40,167,69,0.8)' }}></i>
                <h2 className="mb-2" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '2.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{realTimeData.activeSatellites?.toLocaleString() || 'N/A'}</h2>
                <p className="mb-0" style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Active Satellites</p>
              </div>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card text-white h-100" whileHover={{ scale: 1.05, y: -5 }} style={{
              background: 'linear-gradient(135deg, rgba(220,53,69,0.3) 0%, rgba(255,68,68,0.3) 100%)',
              border: '2px solid #dc3545',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(220,53,69,0.3)'
            }}>
              <div className="card-body text-center p-4">
                <i className="fas fa-exclamation-triangle mb-3" style={{ fontSize: '3rem', color: '#dc3545', textShadow: '0 0 20px rgba(220,53,69,0.8)' }}></i>
                <h2 className="mb-2" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '2.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{realTimeData.debrisObjects?.toLocaleString() || 'N/A'}</h2>
                <p className="mb-0" style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Space Debris</p>
              </div>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card text-white h-100" whileHover={{ scale: 1.05, y: -5 }} style={{
              background: 'linear-gradient(135deg, rgba(255,193,7,0.3) 0%, rgba(255,170,0,0.3) 100%)',
              border: '2px solid #ffc107',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(255,193,7,0.3)'
            }}>
              <div className="card-body text-center p-4">
                <i className="fas fa-bell mb-3" style={{ fontSize: '3rem', color: '#ffc107', textShadow: '0 0 20px rgba(255,193,7,0.8)' }}></i>
                <h2 className="mb-2" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '2.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{realTimeData.collisionAlerts || 'N/A'}</h2>
                <p className="mb-0" style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Active Alerts</p>
              </div>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card text-white h-100" whileHover={{ scale: 1.05, y: -5 }} style={{
              background: 'linear-gradient(135deg, rgba(13,202,240,0.3) 0%, rgba(0,212,255,0.3) 100%)',
              border: '2px solid #0dcaf0',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(13,202,240,0.3)'
            }}>
              <div className="card-body text-center p-4">
                <i className="fas fa-crosshairs mb-3" style={{ fontSize: '3rem', color: '#0dcaf0', textShadow: '0 0 20px rgba(13,202,240,0.8)' }}></i>
                <h2 className="mb-2" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '2.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{realTimeData.conjunctions || 'N/A'}</h2>
                <p className="mb-0" style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Conjunctions</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;