import React from 'react';
import {createRoot} from 'react-dom/client';
import {AuthGate} from './accounts';
import Workspace from './workspace';
import './styles.css';
createRoot(document.getElementById('root')!).render(<AuthGate><Workspace/></AuthGate>);
