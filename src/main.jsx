import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

class RootErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("ERP Fatal Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", fontFamily:"system-ui, sans-serif", padding:20}}>
          <div style={{background:"#fff", borderRadius:16, padding:"32px 28px", maxWidth:480, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:48, marginBottom:12}}>⚠️</div>
            <div style={{fontWeight:700, fontSize:18, color:"#0f172a", marginBottom:8}}>Something went wrong</div>
            <div style={{fontSize:12, color:"#64748b", marginBottom:16}}>
              The app hit an unexpected error and couldn't continue. This has been logged to the browser console.
            </div>
            <div style={{background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px", fontSize:11, color:"#dc2626", fontFamily:"monospace", textAlign:"left", marginBottom:18, maxHeight:120, overflow:"auto"}}>
              {String(this.state.error?.message || this.state.error || "Unknown error")}
            </div>
            <button onClick={() => window.location.reload()}
              style={{padding:"10px 24px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer", fontSize:14}}>
              🔄 Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
)
