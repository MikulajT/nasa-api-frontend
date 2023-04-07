import ReactDOM from 'react-dom/client';
import App from './application/App';
import "./application/styles/Layout.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
