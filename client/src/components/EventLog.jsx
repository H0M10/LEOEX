import React from 'react';

export default function EventLog({ events }){
  if (!events || events.length === 0) return null;

  return (
    <div className="card p-2 mb-2" style={{maxHeight: '200px', overflowY: 'auto'}}>
      <h6>Eventos Recientes</h6>
      {events.slice(-5).map((event, i) => (
        <div key={i} className={`alert ${getAlertClass(event.event)} p-1 mb-1`}>
          <small>{event.event}</small>
        </div>
      ))}
    </div>
  );
}

function getAlertClass(eventText) {
  if (eventText.includes('Collision')) return 'alert-danger';
  if (eventText.includes('EOL') || eventText.includes('Group')) return 'alert-success';
  if (eventText.includes('Monitoring')) return 'alert-info';
  return 'alert-secondary';
}