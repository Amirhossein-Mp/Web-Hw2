import React, { useState, useRef, useCallback } from 'react';
import { Download, Upload, Square, Circle, Triangle } from 'lucide-react';

const PaintApp = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, setSelectedTool] = useState('circle');
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const [draggedTool, setDraggedTool] = useState(null);
  const [dragPreview, setDragPreview] = useState({ x: 0, y: 0, visible: false });
  const [draggedShape, setDraggedShape] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      direction: 'rtl',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1152px',
      margin: '0 auto'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      color: 'white',
      fontSize: '14px'
    },
    importButton: {
      backgroundColor: '#10b981'
    },
    exportButton: {
      backgroundColor: '#3b82f6'
    },
    mainContainer: {
      display: 'flex',
      maxWidth: '1152px',
      margin: '0 auto'
    },
    sidebar: {
      width: '256px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '1px solid #e5e7eb',
      padding: '16px',
      minHeight: '100vh'
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1f2937'
    },
    toolsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    toolButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid',
      cursor: 'grab',
      transition: 'all 0.2s',
      backgroundColor: 'white'
    },
    toolButtonActive: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8'
    },
    toolButtonInactive: {
      borderColor: '#e5e7eb',
      color: '#374151'
    },
    mainContent: {
      flex: 1,
      padding: '16px'
    },
    canvasContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      minHeight: '384px',
      position: 'relative',
      overflow: 'hidden'
    },
    canvas: {
      width: '100%',
      height: '384px',
      position: 'relative'
    },
    emptyState: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      pointerEvents: 'none',
      textAlign: 'center'
    },
    statusBar: {
      marginTop: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '16px'
    },
    statusGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px'
    },
    statusItem: {
      fontSize: '14px',
      color: '#4b5563'
    },
    statsContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '8px',
      flexWrap: 'wrap'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    dragPreview: {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 50,
      opacity: 0.7
    }
  };

  const handleSidebarDragStart = useCallback((e, toolType) => {
    e.preventDefault();
    setIsDraggingFromSidebar(true);
    setDraggedTool(toolType);
    setDragPreview({ x: e.clientX, y: e.clientY, visible: true });
  }, []);

  const handleSidebarDragMove = useCallback((e) => {
    if (isDraggingFromSidebar) {
      setDragPreview({ x: e.clientX, y: e.clientY, visible: true });
    }
  }, [isDraggingFromSidebar]);

  const addShape = useCallback((e) => {
    if (isDraggingFromSidebar) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newShape = {
      id: Date.now(),
      type: selectedTool,
      x: x - 25,
      y: y - 25,
      size: 50,
      color: '#3b82f6'
    };
    
    setShapes(prev => [...prev, newShape]);
  }, [selectedTool, isDraggingFromSidebar]);

  const handleCanvasDrop = useCallback((e) => {
    if (!isDraggingFromSidebar || !draggedTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newShape = {
      id: Date.now(),
      type: draggedTool,
      x: Math.max(0, Math.min(x - 25, rect.width - 50)),
      y: Math.max(0, Math.min(y - 25, rect.height - 50)),
      size: 50,
      color: '#3b82f6'
    };
    
    setShapes(prev => [...prev, newShape]);
    
    setIsDraggingFromSidebar(false);
    setDraggedTool(null);
    setDragPreview({ x: 0, y: 0, visible: false });
  }, [isDraggingFromSidebar, draggedTool]);

  const deleteShape = useCallback((shapeId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setShapes(prev => prev.filter(shape => shape.id !== shapeId));
  }, []);

  const handleShapeMouseDown = useCallback((e, shape) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedShape(shape.id);
    setDragOffset({ x: offsetX, y: offsetY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (draggedShape) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      setShapes(prev => prev.map(shape => 
        shape.id === draggedShape 
          ? { ...shape, x: Math.max(0, Math.min(x, rect.width - shape.size)), 
              y: Math.max(0, Math.min(y, rect.height - shape.size)) }
          : shape
      ));
    }
  }, [draggedShape, dragOffset]);

  const handleMouseUp = useCallback((e) => {
    if (isDraggingFromSidebar) {
      handleCanvasDrop(e);
    } else {
      setDraggedShape(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isDraggingFromSidebar, handleCanvasDrop]);

  const handleGlobalMouseMove = useCallback((e) => {
    if (isDraggingFromSidebar) {
      handleSidebarDragMove(e);
    }
  }, [isDraggingFromSidebar, handleSidebarDragMove]);

  const handleGlobalMouseUp = useCallback(() => {
    setIsDraggingFromSidebar(false);
    setDraggedTool(null);
    setDragPreview({ x: 0, y: 0, visible: false });
    setDraggedShape(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    if (isDraggingFromSidebar) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDraggingFromSidebar, handleGlobalMouseMove, handleGlobalMouseUp]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(shapes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'painting.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [shapes]);

  const importData = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedShapes = JSON.parse(event.target.result);
          setShapes(importedShapes);
        } catch (error) {
          alert('خطا در خواندن فایل!');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const renderShape = (shape) => {
    const commonProps = {
      key: shape.id,
      style: {
        position: 'absolute',
        left: shape.x,
        top: shape.y,
        width: shape.size,
        height: shape.size,
        cursor: 'move',
        userSelect: 'none'
      },
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      onMouseDown: (e) => handleShapeMouseDown(e, shape),
      onDoubleClick: (e) => deleteShape(shape.id, e)
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              backgroundColor: shape.color,
              borderRadius: '50%',
              border: '2px solid #1f2937'
            }}
          />
        );
      case 'square':
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              backgroundColor: shape.color,
              border: '2px solid #1f2937'
            }}
          />
        );
      case 'triangle':
        return (
          <div
            {...commonProps}
            style={{
              ...commonProps.style,
              width: 0,
              height: 0,
              borderLeft: `${shape.size/2}px solid transparent`,
              borderRight: `${shape.size/2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              backgroundColor: 'transparent'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>برنامه نقاشی لویی</h1>
          
          <div style={styles.buttonGroup}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{...styles.button, ...styles.importButton}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <Upload size={18} />
              Import
            </button>
            
            <button
              onClick={exportData}
              style={{...styles.button, ...styles.exportButton}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importData}
          style={{display: 'none'}}
        />
      </header>

      <div style={styles.mainContainer}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>ابزارها</h2>
          
          <div style={styles.toolsContainer}>
            <button
              onClick={() => setSelectedTool('circle')}
              onMouseDown={(e) => handleSidebarDragStart(e, 'circle')}
              style={{
                ...styles.toolButton,
                ...(selectedTool === 'circle' ? styles.toolButtonActive : styles.toolButtonInactive)
              }}
            >
              <Circle size={20} />
              دایره
            </button>
            
            <button
              onClick={() => setSelectedTool('square')}
              onMouseDown={(e) => handleSidebarDragStart(e, 'square')}
              style={{
                ...styles.toolButton,
                ...(selectedTool === 'square' ? styles.toolButtonActive : styles.toolButtonInactive)
              }}
            >
              <Square size={20} />
              مربع
            </button>
            
            <button
              onClick={() => setSelectedTool('triangle')}
              onMouseDown={(e) => handleSidebarDragStart(e, 'triangle')}
              style={{
                ...styles.toolButton,
                ...(selectedTool === 'triangle' ? styles.toolButtonActive : styles.toolButtonInactive)
              }}
            >
              <Triangle size={20} />
              مثلث
            </button>
          </div>
        </aside>

        <main style={styles.mainContent}>
          <div style={styles.canvasContainer}>
            <div
              style={{
                ...styles.canvas,
                cursor: isDraggingFromSidebar ? 'copy' : 'crosshair'
              }}
              onClick={addShape}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleCanvasDrop}
            >
              {shapes.map(renderShape)}
              
              {shapes.length === 0 && (
                <div style={styles.emptyState}>
                  <div>
                    <p style={{fontSize: '18px', marginBottom: '8px'}}>برای شروع یک ابزار انتخاب کنید</p>
                    <p style={{fontSize: '14px'}}>سپس روی Canvas کلیک کنید یا از سمت راست بکشید</p>
                    <p style={{fontSize: '12px', marginTop: '8px'}}>برای حذف: دوبار کلیک • برای جابجایی: کشیدن</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.statusBar}>
            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <span style={{fontWeight: '500'}}>ابزار انتخاب شده: </span>
                <span style={{color: '#1d4ed8', fontWeight: '600'}}>
                  {selectedTool === 'circle' ? 'دایره' :
                   selectedTool === 'square' ? 'مربع' : 'مثلث'}
                </span>
              </div>
              
              <div style={styles.statusItem}>
                <span style={{fontWeight: '500'}}>آمار اشکال:</span>
                <div style={styles.statsContainer}>
                  <div style={styles.statItem}>
                    <Circle size={14} style={{color: '#3b82f6'}} />
                    <span>دایره: {shapes.filter(s => s.type === 'circle').length}</span>
                  </div>
                  <div style={styles.statItem}>
                    <Square size={14} style={{color: '#10b981'}} />
                    <span>مربع: {shapes.filter(s => s.type === 'square').length}</span>
                  </div>
                  <div style={styles.statItem}>
                    <Triangle size={14} style={{color: '#8b5cf6'}} />
                    <span>مثلث: {shapes.filter(s => s.type === 'triangle').length}</span>
                  </div>
                  <div style={{fontWeight: '700', color: '#1f2937'}}>
                    جمع: {shapes.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {dragPreview.visible && (
        <div
          style={{
            ...styles.dragPreview,
            left: dragPreview.x - 25,
            top: dragPreview.y - 25,
            width: 50,
            height: 50
          }}
        >
          {draggedTool === 'circle' && (
            <div style={{
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              backgroundColor: '#3b82f6', 
              border: '2px solid #1f2937'
            }} />
          )}
          {draggedTool === 'square' && (
            <div style={{
              width: '100%', 
              height: '100%', 
              backgroundColor: '#3b82f6', 
              border: '2px solid #1f2937'
            }} />
          )}
          {draggedTool === 'triangle' && (
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '25px solid transparent',
              borderRight: '25px solid transparent',
              borderBottom: '50px solid #3b82f6'
            }} />
          )}
        </div>
      )}
    </div>
  );
};

export default PaintApp;
