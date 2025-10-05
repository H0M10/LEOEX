import React from 'react';

export default function Tutorial({ onClose }){
  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tutorial: LEO Decisions</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h6>¿Qué es LEO Decisions?</h6>
            <p>Es un simulador que te pone en el rol de un tomador de decisiones en el espacio. Gestionas satélites en órbita baja terrestre (LEO) y tomas decisiones que afectan el presupuesto, la sostenibilidad y la seguridad.</p>
            
            <h6>Escenarios:</h6>
            <ul>
              <li><strong>Operador Satelital:</strong> Gestionas una constelación de satélites. Debes decidir cuándo retirarlos (EOL) o agruparlos para maniobras eficientes.</li>
              <li><strong>Inmobiliaria:</strong> Monitoreas terrenos usando datos satelitales. La deforestación afecta el valor de las propiedades.</li>
              <li><strong>ONG:</strong> Proteges bosques amazónicos. El monitoreo satelital ayuda a prevenir la deforestación ilegal.</li>
            </ul>

            <h6>Conceptos Clave:</h6>
            <ul>
              <li><strong>Riesgo:</strong> Probabilidad de colisión. Aumenta con la edad del satélite y altitud baja.</li>
              <li><strong>Δv (Delta-V):</strong> Cambio de velocidad necesario para maniobras. Consume combustible.</li>
              <li><strong>EOL (End of Life):</strong> Retiro planificado del satélite para reducir riesgo de basura espacial.</li>
              <li><strong>Group Maneuver:</strong> Maniobra conjunta de múltiples satélites para ahorrar costos.</li>
              <li><strong>Monitoring:</strong> Compra de datos adicionales para detectar problemas temprano.</li>
            </ul>

            <h6>Cómo Jugar:</h6>
            <ol>
              <li>Selecciona un escenario.</li>
              <li>En cada turno, elige acciones para tus satélites.</li>
              <li>Observa cómo cambian los KPIs: presupuesto, colisiones, Δv total, score ESG.</li>
              <li>Eventos aleatorios pueden ocurrir (colisiones, deforestación).</li>
              <li>Después de 6 turnos, genera un reporte PDF con tu desempeño.</li>
            </ol>

            <h6>Ejemplo de Decisión:</h6>
            <p>Imagina que tienes un satélite viejo (edad 3 años) en altitud baja (550km). Su riesgo es alto (0.3). 
            Si eliges EOL, reduces el riesgo a 0.02, pero gastas $1,050 + combustible. 
            Si no haces nada, el riesgo aumenta y puede colisionar, costando $22,000 en daños.</p>

            <div className="alert alert-info">
              <strong>Consejo:</strong> Balancea costos a corto plazo con beneficios a largo plazo. La sostenibilidad importa para el score ESG.
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>¡Entendido, empezar a jugar!</button>
          </div>
        </div>
      </div>
    </div>
  );
}