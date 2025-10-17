"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Trash2, Eraser, Pen, Undo, X, Eye } from 'lucide-react';

const COLORS = ['#FFFFFF', '#EF4444', '#F97316', '#84CC16', '#22C55E', '#06B6D4', '#8B5CF6', '#EC4899'];

interface SavedDrawing {
  src: string;
  createdAt: number;
}

export default function CanvasSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [drawings, setDrawings] = useState<SavedDrawing[]>([]);
  const [sortKey, setSortKey] = useState<'date' | 'name'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [selectedDrawingIndex, setSelectedDrawingIndex] = useState<number | null>(null);
  const [viewerMode, setViewerMode] = useState<'view' | 'edit'>('view');

  // Load drawings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('nebula-drawings');
      if (stored) {
        const parsed = JSON.parse(stored) as SavedDrawing[];
        setDrawings(parsed);
        console.log('Loaded', parsed.length, 'drawings from localStorage');
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  }, []);

  // Save drawings to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || drawings.length === 0) return;
    try {
      localStorage.setItem('nebula-drawings', JSON.stringify(drawings));
      console.log('Saved', drawings.length, 'drawings to localStorage');
    } catch (error) {
      console.error('Error saving drawings to localStorage:', error);
    }
  }, [drawings]);
  
  const getContext = useCallback(() => {
    return canvasRef.current?.getContext('2d');
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = getContext();
    if (!canvas || !container || !context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
  }, [brushColor, brushSize, getContext]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const context = getContext();
    if (context) {
      context.strokeStyle = brushColor;
    }
  }, [brushColor, getContext]);

  useEffect(() => {
    const context = getContext();
    if (context) {
      context.lineWidth = brushSize;
    }
  }, [brushSize, getContext]);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context) return;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev, imageData]);
  }, [getContext]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = getContext();
    if (!context) return;
    saveHistory();
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    const context = getContext();
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = getContext();
    if (!context) return;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    const context = getContext();
    if (!context || !lastState) return;
    context.putImageData(lastState, 0, 0);
  };
  
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    // Check if canvas has content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some(byte => byte !== 0);
    if (!hasContent) {
      console.warn('Canvas is empty');
      return;
    }

    try {
      // Compress and downscale image
      const MAX_DIM = 1200;
      const origW = canvas.width;
      const origH = canvas.height;
      let targetW = origW;
      let targetH = origH;

      if (Math.max(origW, origH) > MAX_DIM) {
        const scale = MAX_DIM / Math.max(origW, origH);
        targetW = Math.round(origW * scale);
        targetH = Math.round(origH * scale);
      }

      const tmp = document.createElement('canvas');
      tmp.width = targetW;
      tmp.height = targetH;
      const tctx = tmp.getContext('2d');
      if (!tctx) {
        console.error('Failed to get temp canvas context');
        return;
      }

      tctx.drawImage(canvas, 0, 0, targetW, targetH);
      const src = tmp.toDataURL('image/jpeg', 0.85);
      console.log('Image size:', src.length, 'bytes');

      // Add to drawings
      const newDrawing: SavedDrawing = {
        src,
        createdAt: Date.now(),
      };

      setDrawings(prev => [newDrawing, ...prev].slice(0, 10));
      clearCanvas();
      console.log('Drawing saved successfully');
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const deleteDrawing = (index: number) => {
    setDrawings(prev => prev.filter((_, i) => i !== index));
    if (selectedDrawingIndex === index) {
      setSelectedDrawingIndex(null);
    }
  };

  const loadDrawingForEdit = (index: number) => {
    setSelectedDrawingIndex(index);
    setViewerMode('edit');
  };

  const loadDrawingToCanvas = useCallback(() => {
    if (selectedDrawingIndex === null) return;
    const drawing = drawings[selectedDrawingIndex];
    if (!drawing || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      setHistory([]);
      console.log('Loaded drawing for editing');
    };
    img.src = drawing.src;
  }, [selectedDrawingIndex, drawings]);

  const closeViewer = () => {
    setSelectedDrawingIndex(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 flex flex-col gap-4 h-[70vh] lg:h-auto">
        <div ref={containerRef} className="flex-1 w-full h-full rounded-lg border border-border/30 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="w-full h-full bg-slate-800/50"
            style={{ cursor: 'crosshair' }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-4 bg-card/50 backdrop-blur-md border-border/30 rounded-lg">
          <div className="flex items-center gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                title={color}
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${brushColor === color ? 'border-accent' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-48">
            <Slider
              min={1} max={50} step={1} value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
            />
            <span className="text-sm font-medium w-6 text-center">{brushSize}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={undo} disabled={history.length === 0}>
              <Undo className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button variant="outline" onClick={clearCanvas}>
              <Eraser className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button onClick={saveDrawing} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Saved Drawings</h3>
        </div>
        {drawings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-lg p-8">
            <Pen className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your gallery is empty</h3>
            <p>Save a drawing to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(75vh-100px)] p-2 -mr-2 pr-4">
            {drawings.map((item, index) => (
              <Card key={`drawing-${index}`} className="relative group overflow-hidden bg-card/50 backdrop-blur-md border-border/30 aspect-square cursor-pointer">
                <CardContent className="p-0 w-full h-full relative" onClick={() => loadDrawingForEdit(index)}>
                  <img
                    src={item.src}
                    alt={`Drawing ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); loadDrawingForEdit(index); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); deleteDrawing(index); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Viewer/Editor Modal */}
      {selectedDrawingIndex !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-card/90 backdrop-blur-md border border-border/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/20">
              <h2 className="text-xl font-bold">
                {viewerMode === 'edit' ? 'Edit Drawing' : `Drawing ${selectedDrawingIndex + 1}`}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeViewer}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-0">
              {viewerMode === 'view' ? (
                <img
                  src={drawings[selectedDrawingIndex]?.src}
                  alt={`Drawing ${selectedDrawingIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex flex-col gap-4">
                  <canvas
                    ref={viewerCanvasRef}
                    className="flex-1 border border-border/30 rounded-lg bg-slate-800/50 cursor-crosshair"
                  />
                  <p className="text-sm text-muted-foreground">Click "Load to Canvas" to edit this drawing, or "Save as New" to keep it as is.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/20 p-4 flex items-center justify-end gap-2">
              {viewerMode === 'view' ? (
                <>
                  <Button variant="outline" onClick={() => setViewerMode('edit')}>
                    Edit
                  </Button>
                  <Button variant="outline" onClick={closeViewer}>
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      loadDrawingToCanvas();
                      closeViewer();
                    }}
                  >
                    Load to Canvas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setViewerMode('view')}
                  >
                    Back
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteDrawing(selectedDrawingIndex);
                      closeViewer();
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
