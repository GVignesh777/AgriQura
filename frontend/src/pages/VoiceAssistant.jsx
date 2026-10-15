import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIAssistant from './AIAssistant';

/**
 * Unified Voice + AI Chat redirect wrapper
 */
export default function VoiceAssistant() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/assistant', { replace: true });
  }, [navigate]);

  return <AIAssistant />;
}
