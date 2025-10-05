import React, { useState } from 'react';

export default function MissionSetupModal({ show, onClose, onStart }){
  const [profile, setProfile] = useState('operator');
  const [budget, setBudget] = useState(50000);
  const [satellites, setSatellites] = useState(4);

  if (!show) return null;

  const minSats = 1;
  const maxSats = Math.max(1, Math.floor(budget / 10000));
  if (satellites > maxSats) setSatellites(maxSats);

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{position: 'fixed', inset:0, zIndex:2000}}>
      <div className="card p-3" style={{width: 520, maxWidth: '95%'}}>
        <h5>Setup Mission</h5>
        <div className="mb-3">
          <label className="form-label">Profile</label>
          <div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="profile" id="p1" value="operator" checked={profile==='operator'} onChange={()=>setProfile('operator')} />
              <label className="form-check-label" htmlFor="p1">Satellite Operator — Manage constellations, collision avoidance and deorbiting.</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="profile" id="p2" value="inmobiliaria" checked={profile==='inmobiliaria'} onChange={()=>setProfile('inmobiliaria')} />
              <label className="form-check-label" htmlFor="p2">Real Estate Monitor — NDVI data capture and economic analysis.</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="profile" id="p3" value="ong" checked={profile==='ong'} onChange={()=>setProfile('ong')} />
              <label className="form-check-label" htmlFor="p3">Environmental NGO — Monitor deforestation and protect areas with limited budget.</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Budget</label>
          <div className="btn-group w-100">
            <button className={`btn ${budget===30000? 'btn-primary':'btn-outline-primary'}`} onClick={()=>setBudget(30000)}>$30,000</button>
            <button className={`btn ${budget===50000? 'btn-primary':'btn-outline-primary'}`} onClick={()=>setBudget(50000)}>$50,000</button>
            <button className={`btn ${budget===100000? 'btn-primary':'btn-outline-primary'}`} onClick={()=>setBudget(100000)}>$100,000</button>
            <button className={`btn ${budget===200000? 'btn-primary':'btn-outline-primary'}`} onClick={()=>setBudget(200000)}>$200,000</button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Satellites ({satellites})</label>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>setSatellites(s=>Math.max(minSats, s-1))}>-</button>
            <div style={{minWidth: 80, textAlign: 'center'}}>{satellites}</div>
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>setSatellites(s=>Math.min(maxSats, s+1))}>+</button>
            <div className="text-muted small ms-2">Max: {maxSats} (based on budget)</div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onStart({ profile, budget, satellites })}>Start Mission</button>
        </div>
      </div>
    </div>
  );
}
