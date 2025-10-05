
import React, { useState, useRef, useEffect } from 'react';
import '../styles/dark-theme.css';

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm LEO Assistant, your expert guide to the LEO Decisions platform. I can help you with information about LEO satellites, space data analytics, and all platform features. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Gemini API key - En producción esto debería estar en variables de entorno
  const GEMINI_API_KEY = 'AIzaSyBJRGs8Y8H8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y'; // Reemplaza con tu API key real

  // LEO Decisions context (for future API use, not shown to user)
  const LEO_CONTEXT = `
  You are LEO Assistant, an expert in the LEO Decisions platform and Low Earth Orbit (LEO) satellites.

  LEO Decisions is a professional platform that includes:

  1. MISSION CONTROL - Main mission control panel
  2. 3D TRACKER - Real-time satellite tracker with 3D visualization
  3. DASHBOARD - Real-time satellite data dashboard with live NASA/ESA APIs
  4. LEO ANALYTICS - Professional satellite analytics by sector (agriculture, environment, disaster, maritime, urban, energy)
  5. INDUSTRY GUIDE - Guide to industry sectors and satellite applications
  6. LEO EXCHANGE - Marketplace for satellite data providers

  TECHNICAL FEATURES:
  - Real data from APIs: NASA, ESA, N2YO, Launch Library, Space-Track
  - 3D visualization with Three.js
  - Sector-specific analytics with real coordinates
  - Satellite provider marketplace
  - Space mission simulation game

  SATELLITE DATA:
  - Active LEO satellites: ~6,543
  - Tracked debris: ~34,700
  - Global real-time coverage
  - Resolution: 10m - 1km depending on sensor
  - Data latency: 2-6 hours

  Always respond in English, be technical but accessible, and focus on LEO Decisions capabilities.
  `;

  // Respuestas predefinidas para preguntas comunes
  const getQuickResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('what is leo') || lowerText.includes('leo decisions')) {
      return "🛰️ LEO Decisions is the most advanced professional platform for Low Earth Orbit (LEO) satellite analytics. We integrate real data from NASA, ESA, N2YO, and Space-Track to provide:\n\n✨ Real-time analytics of 6,543+ active satellites\n🌍 3D tracking with Three.js\n📊 Sector-based analytics (agriculture, environment, maritime)\n💱 LEO Exchange marketplace\n🎯 Professional Mission Control\n\nOur platform processes data with 2-6 hour latency and 10m-1km resolution. Which area would you like to explore?";
    }
    
    if (lowerText.includes('dashboard') || lowerText.includes('panel') || lowerText.includes('mission control')) {
      return "📊 The LEO Decisions Dashboard is your space command center:\n\n🔴 LIVE DATA (updates every 30s):\n• Active LEO satellites: ~6,543\n• Tracked space debris: ~34,700\n• Daily launches: 2-5\n• Conjunctions detected: 15-25/day\n\n🌐 DATA SOURCES:\n• NASA LARC, GSFC\n• ESA Earth Observation\n• Space-Track.org\n• Launch Library API\n\n📡 KEY METRICS:\n• Orbital altitude: 160-2000km\n• Average speed: 7.8 km/s\n• Orbital period: 88-127 min\n\nAre you interested in any specific metric?";
    }
    
    if (lowerText.includes('analytics') || lowerText.includes('analysis') || lowerText.includes('sector')) {
      return "🔬 LEO Analytics: Professional satellite analytics by sector\n\n🌱 AGRICULTURE:\n• NDVI: 0.2-0.9 (Sentinel-2)\n• Soil moisture: 10-50%\n• Drought stress detection\n\n🌍 ENVIRONMENT:\n• Atmospheric CO2: 415±2 ppm (OCO-2)\n• Air quality: PM2.5, NO2\n• Deforestation detection\n\n⚠️ DISASTER MANAGEMENT:\n• Real-time seismic alerts\n• Fire monitoring (MODIS)\n• Flood analysis (Sentinel-1)\n\n🚢 MARITIME:\n• AIS traffic: 400K+ ships\n• Ocean temperature (±0.1°C)\n• Spill detection\n\n🏙️ URBAN:\n• Real-time AQI\n• Urban heat islands\n• Urban growth\n\n⚡ ENERGY:\n• Solar irradiance (W/m²)\n• Panel efficiency\n\nWhich sector are you most interested in?";
    }
    
    if (lowerText.includes('exchange') || lowerText.includes('marketplace')) {
      return "LEO Exchange is our satellite data marketplace where you can explore real providers, compare reputation and sustainability, filter by services (Earth Observation, Communications, Navigation), and request quotes. It includes LEO certification and quality metrics for informed decisions.";
    }
    
    if (lowerText.includes('3d') || lowerText.includes('tracker') || lowerText.includes('tracking')) {
      return "The 3D Tracker visualizes satellites in real time using Three.js. It shows current positions, orbital paths, and allows individual satellite tracking. Data comes from APIs like N2YO and Space-Track with continuous updates. Perfect for coverage analysis and mission planning.";
    }
    
    if (lowerText.includes('game') || lowerText.includes('simulation')) {
      return "LEO Decisions includes a space mission simulator where you can manage satellites, make strategic decisions about imaging, communications, and navigation, handle budgets, and face random events like solar storms. It's an interactive way to learn real mission management.";
    }
    
    if (lowerText.includes('industry') || lowerText.includes('sector')) {
      return "Our Industry Guide covers key sectors: 🚜 Precision agriculture, 🌊 Water resource management, 🏭 Industrial monitoring, 🌆 Smart urban development, ⛽ Energy resources, 🚢 Maritime operations, and 📡 Telecommunications. Each sector includes real use cases and specific metrics.";
    }
    
    return null;
  };

  // Simulación de llamada a Gemini API
  const callGeminiAPI = async (message) => {
    // En una implementación real, aquí harías la llamada a la API de Gemini
    // Por ahora simularemos una respuesta inteligente
    
    const quickResponse = getQuickResponse(message);
    if (quickResponse) return quickResponse;
    
    // Respuesta genérica inteligente basada en el contexto
    const responses = [
      "Great question about LEO Decisions. Our platform integrates real satellite data for professional analytics. Are you interested in any specific sector like agriculture, environment, or disaster management?",
      
      "LEO Decisions processes data from over 6,500 active satellites using official APIs from NASA, ESA, and other agencies. We offer real-time analytics with 2-6 hour latency. Would you like to explore any specific feature?",
      
      "Our platform is designed for space professionals and decision-making based on satellite data. It includes 3D visualization, sector-based analytics, and a provider marketplace. Which area can I help you with?",
      
      "LEO Decisions data comes from verified sources: N2YO for tracking, NASA/ESA for science data, Launch Library for missions, and Space-Track for space objects. All integrated in a professional interface. Would you like to know more about any data type?",
      
      "LEO Decisions combines technical analytics with intuitive visualization. From NDVI for agriculture to space debris detection, we offer tools for multiple sectors. Is there a specific use case you'd like to explore?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = await callGeminiAPI(inputText);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having technical issues. Meanwhile, you can explore the Dashboard, LEO Analytics, or LEO Exchange sections to learn more about our platform.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What is LEO Decisions?",
    "How does the Dashboard work?", 
    "Which sectors does LEO Analytics cover?",
    "What is LEO Exchange?",
    "How to use the 3D Tracker?"
  ];

  if (!isOpen) {
    return (
      <div className="position-fixed bottom-0 end-0 p-4 chatbot-container">
        <button
          className="btn btn-primary rounded-circle p-3 shadow-lg chatbot-fab"
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(58, 160, 255, 0.4)',
            position: 'relative'
          }}
          title="LEO Assistant - Ask me about LEO Decisions"
        >
          <i className="fas fa-robot" style={{fontSize: '24px'}}></i>
          <div 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{fontSize: '10px', animation: 'pulse 2s infinite'}}
          >
            ?
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="position-fixed bottom-0 end-0 p-4" style={{zIndex: 1050}}>
      <div className="card dark-theme" style={{
        width: '400px',
        height: '600px',
        background: 'rgba(255,255,255,0.1)',
        border: '2px solid rgba(58,160,255,0.3)',
        borderRadius: '20px',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        color: '#ffffff'
      }}>
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center" style={{
          background: 'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)',
          borderBottom: '2px solid rgba(58,160,255,0.3)',
          borderRadius: '18px 18px 0 0',
          color: '#ffffff'
        }}>
          <div className="d-flex align-items-center">
            <div className="me-3" style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-robot" style={{fontSize: '20px'}}></i>
            </div>
            <div>
              <h6 className="mb-0" style={{fontWeight: 'bold'}}>LEO Assistant</h6>
              <small style={{opacity: 0.9}}>LEO satellite expert</small>
            </div>
          </div>
          <button 
            className="btn btn-sm"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="card-body p-3 chatbot-messages" style={{
          height: '420px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(58,160,255,0.5) rgba(255,255,255,0.1)'
        }}>
          {messages.map((message) => (
            <div key={message.id} className={`mb-3 d-flex ${message.isBot ? 'justify-content-start' : 'justify-content-end'} chatbot-message`}>
              <div className={`p-3 rounded-3 max-w-75`} style={{
                maxWidth: '75%',
                background: message.isBot 
                  ? 'rgba(58,160,255,0.2)' 
                  : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: message.isBot 
                  ? '1px solid rgba(58,160,255,0.3)' 
                  : '1px solid rgba(40,167,69,0.3)',
                borderRadius: message.isBot ? '18px 18px 18px 5px' : '18px 18px 5px 18px',
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.4',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                {message.text}
                <div className="mt-1" style={{fontSize: '10px', opacity: 0.7}}>
                  {message.timestamp.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-3 d-flex justify-content-start">
              <div className="p-3 rounded-3" style={{
                background: 'rgba(58,160,255,0.2)',
                border: '1px solid rgba(58,160,255,0.3)',
                borderRadius: '18px 18px 18px 5px',
                color: '#ffffff'
              }}>
                <div className="d-flex align-items-center">
                  <div className="spinner-grow spinner-grow-sm me-2" style={{width: '12px', height: '12px'}}></div>
                  <span style={{fontSize: '14px'}}>LEO Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-3 pb-2">
            <small style={{color: '#cccccc', fontSize: '11px'}}>Frequently asked questions:</small>
            <div className="mt-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-outline-info me-1 mb-1"
                  onClick={() => setInputText(question)}
                  style={{
                    fontSize: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(23,162,184,0.5)',
                    color: '#17a2b8'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="card-footer" style={{
          background: 'rgba(255,255,255,0.05)',
          border: 'none',
          borderRadius: '0 0 18px 18px'
        }}>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Ask me about LEO Decisions..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(58,160,255,0.3)',
                borderRadius: '25px',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={isTyping || !inputText.trim()}
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3aa0ff 0%, #1976d2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(58,160,255,0.4)'
              }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatbot;