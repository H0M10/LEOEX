import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NDVIChart({ ndviSeries, name, currentTurn = 6 }){
  const labels = ndviSeries.slice(0, currentTurn + 1).map((_, i) => `Semana ${i+1}`);
  const data = {
    labels,
    datasets: [
      {
        label: `NDVI - ${name}`,
        data: ndviSeries.slice(0, currentTurn + 1),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monitoreo de Vegetación - ${name}`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            let status = 'Desconocido';
            if (value >= 0.7) status = 'Excelente - Bosque saludable';
            else if (value >= 0.5) status = 'Bueno - Vegetación moderada';
            else if (value >= 0.3) status = 'Regular - Degradación inicial';
            else status = 'Crítico - Alta deforestación';
            
            return [`NDVI: ${value.toFixed(2)}`, `Estado: ${status}`];
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Índice NDVI'
        }
      }
    }
  };

  const currentNDVI = ndviSeries[currentTurn] || ndviSeries[ndviSeries.length - 1];
  const trend = currentTurn > 0 ? 
    ((currentNDVI - ndviSeries[0]) / ndviSeries[0] * 100).toFixed(1) : 0;

  return (
    <div className="card p-3 mb-3">
      <Line data={data} options={options} />
      <div className="mt-2">
        <div className="row text-center">
          <div className="col-4">
            <div className="h5 text-primary">{currentNDVI?.toFixed(2) || 'N/A'}</div>
            <small className="text-muted">NDVI Actual</small>
          </div>
          <div className="col-4">
            <div className={`h5 ${trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-warning'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
            <small className="text-muted">Tendencia</small>
          </div>
          <div className="col-4">
            <div className="h5 text-info">{ndviSeries.length}</div>
            <small className="text-muted">Semanas</small>
          </div>
        </div>
        <small className="text-muted d-block mt-2">
          NDVI mide la salud de la vegetación. Valores altos indican vegetación densa, bajos sugieren deforestación.
          El monitoreo satelital ayuda a detectar cambios tempranos y prevenir pérdidas económicas/ambientales.
        </small>
      </div>
    </div>
  );
}