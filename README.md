تجزیه و تحلیل ساختار کد - برنامه نقاشی لویی
🔧 بخش 1: Import ها و تنظیمات اولیه
```
import React, { useState, useRef, useCallback } from 'react';
import { Download, Upload, Square, Circle, Triangle } from 'lucide-react';
```

توضیح:
React Hooks: useState برای مدیریت state، useRef برای دسترسی به DOM، useCallback برای بهینه‌سازی
Lucide Icons: آیکون‌های مورد نیاز برای رابط کاربری

🎯 بخش 2: تعریف State ها
```
const PaintApp = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedTool, setSelectedTool] = useState('circle');
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const [draggedTool, setDraggedTool] = useState(null);
  const [dragPreview, setDragPreview] = useState({ x: 0, y: 0, visible: false });
  const [draggedShape, setDraggedShape] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
```

توضیح هر State:
shapes: آرایه‌ای از اشکال رسم شده روی کانواس
selectedTool: ابزار فعلی انتخاب شده (circle, square, triangle)
isDraggingFromSidebar: وضعیت کشیدن از سایدبار
draggedTool: نوع ابزاری که در حال کشیده شدن است
dragPreview: موقعیت و وضعیت نمایش پیش‌نمایش هنگام drag
draggedShape: شناسه شکلی که در حال جابجایی است
dragOffset: فاصله موس از مرکز شکل هنگام drag
fileInputRef: مرجع به المان input فایل مخفی

🎨 بخش 3: تعریف استایل‌ها
```
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif'
  },
  // ... سایر استایل‌ها
```
ویژگی‌های مهم:
RTL Direction: پشتیبانی از راست به چپ
Responsive Design: طراحی منعطف
Color Scheme: پالت رنگی یکپارچه
CSS-in-JS: استایل‌دهی داخل کامپوننت

🖱️ بخش 4: مدیریت Drag & Drop از سایدبار
```
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
```

عملکرد:
شروع Drag: ثبت نوع ابزار و نمایش پیش‌نمایش
حین Drag: به‌روزرسانی موقعیت پیش‌نمایش
بهینه‌سازی: استفاده از useCallback برای جلوگیری از re-render

🎯 بخش 5: افزودن شکل جدید
```
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
```

مراحل کار:
بررسی وضعیت: اگر در حال drag باشد، عمل انجام نمی‌شود
محاسبه موقعیت: تبدیل مختصات mouse به مختصات کانواس
ایجاد شکل: تعریف object جدید با خصوصیات مورد نیاز
اضافه کردن: افزودن به آرایه shapes با spread operator






🎪 بخش 6: مدیریت Drop روی کانواس
```
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
  
  // پاکسازی وضعیت drag
  setIsDraggingFromSidebar(false);
  setDraggedTool(null);
  setDragPreview({ x: 0, y: 0, visible: false });
}, [isDraggingFromSidebar, draggedTool]);
```

ویژگی‌های مهم:
Boundary Check: محدود کردن شکل در مرزهای کانواس
Math.max/min: اطمینان از عدم خروج از محدوده
State Cleanup: پاکسازی تمام state های مربوط به drag

🗑️ بخش 7: حذف شکل
```
const deleteShape = useCallback((shapeId, e) => {
  e.preventDefault();
  e.stopPropagation();
  setShapes(prev => prev.filter(shape => shape.id !== shapeId));
}, []);
```

عملکرد:
Event Prevention: جلوگیری از propagation و default behavior
Filter: حذف شکل با شناسه مشخص از آرایه
Immutable Update: به‌روزرسانی غیرمخرب state

🔄 بخش 8: جابجایی اشکال
```
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
```

فرآیند جابجایی:
شروع Drag: ذخیره offset موس نسبت به شکل
حین حرکت: محاسبه موقعیت جدید با در نظر گیری offset
Boundary Check: محدود کردن حرکت در مرزهای کانواس
Update Shape: به‌روزرسانی موقعیت شکل مورد نظر
🌐 بخش 9: مدیریت رویدادهای Global
```
const handleGlobalMouseMove = useCallback((e) => {
  if (isDraggingFromSidebar) {
    handleSidebarDragMove(e);
  }
}, [isDraggingFromSidebar, handleSidebarDragMove]);

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
```

هدف:
Global Event Handling: پردازش رویدادها در سطح document
Cleanup: حذف event listener ها هنگام unmount
Performance: فقط هنگام ضرورت event listener اضافه می‌شود

💾 بخش 10: Export و Import
```
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
```

فرآیند Export:
JSON Stringify: تبدیل shapes به رشته JSON
Blob Creation: ایجاد فایل در مرورگر
Download Trigger: شبیه‌سازی کلیک برای دانلود
Memory Cleanup: آزادسازی URL object
فرآیند Import:
File Reading: خواندن فایل انتخاب شده
JSON Parse: تبدیل رشته به object
Error Handling: مدیریت خطاهای احتمالی
State Update: جایگزینی shapes فعلی

🎭 بخش 11: رندر اشکال
```
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
    onClick: (e) => { e.preventDefault(); e.stopPropagation(); },
    onMouseDown: (e) => handleShapeMouseDown(e, shape),
    onDoubleClick: (e) => deleteShape(shape.id, e)
  };

  switch (shape.type) {
    case 'circle':
      return <div {...commonProps} style={{...commonProps.style, backgroundColor: shape.color, borderRadius: '50%', border: '2px solid #1f2937'}} />;
    case 'square':
      return <div {...commonProps} style={{...commonProps.style, backgroundColor: shape.color, border: '2px solid #1f2937'}} />;
    case 'triangle':
      return <div {...commonProps} style={{...commonProps.style, width: 0, height: 0, borderLeft: `${shape.size/2}px solid transparent`, borderRight: `${shape.size/2}px solid transparent`, borderBottom: `${shape.size}px solid ${shape.color}`, backgroundColor: 'transparent'}} />;
    default:
      return null;
  }
};
```

ویژگی‌ها:
Common Props: خصوصیات مشترک همه اشکال
Dynamic Styling: استایل بر اساس نوع شکل
CSS Tricks: استفاده از border برای ایجاد مثلث
Event Binding: اتصال رویدادهای مورد نیاز

🏗️ بخش 12: JSX اصلی و رندر نهایی
```
return (
  <div style={styles.container}>
    <header style={styles.header}>
      {/* Header content */}
    </header>

    <div style={styles.mainContainer}>
      <aside style={styles.sidebar}>
        {/* Sidebar tools */}
      </aside>

      <main style={styles.mainContent}>
        <div style={styles.canvasContainer}>
          <div style={styles.canvas} onClick={addShape} onMouseMove={handleMouseMove}>
            {shapes.map(renderShape)}
            {/* Empty state */}
          </div>
        </div>
        
        <div style={styles.statusBar}>
          {/* Status information */}
        </div>
      </main>
    </div>

    {/* Drag preview */}
  </div>
);
```

ساختار Layout:
Header: عنوان و دکمه‌های Import/Export
Sidebar: ابزارهای رسم
Main Content: کانواس و نوار وضعیت
Drag Preview: نمایش موقت هنگام کشیدن




🧠 نکات کلیدی معماری:
1. State Management Pattern:
استفاده از useState برای state های محلی
Immutable updates با spread operator
State lifting برای اشتراک داده
2. Event Handling Strategy:
Separation of concerns برای رویدادهای مختلف
Event delegation برای بهینه‌سازی
Global event handling برای drag & drop
3. Performance Optimizations:
useCallback برای پیشگیری از re-render
Conditional rendering برای UI
Efficient array operations
4. Code Organization:
Functional components با hooks
Custom event handlers
Reusable style objects
Modular function design

