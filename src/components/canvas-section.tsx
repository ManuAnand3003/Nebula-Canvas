"use client";

import React, { useRef, useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Download, Trash2, Eraser, Pen } from 'lucide-react';

const COLORS = ['#FFFFFF', '#EF4444', '#F97316', '#84CC16', '#22C55E', '#06B6D4', '#8B5CF6', '#EC4899'];

export default function CanvasSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [drawings, setDrawings] = useLocalStorage<string[]>('drawings', []);
  
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(dpr, dpr);

    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
    }
  }, [brushColor]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    setDrawings([image, ...drawings].slice(0, 10)); // Keep last 10
    clearCanvas();
  };

  const deleteDrawing = (index: number) => {
    setDrawings(drawings.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fade-in">
      <div className="lg:col-span-2 flex flex-col gap-4 h-[70vh] lg:h-auto">
        <div ref={containerRef} className="flex-1 w-full h-full rounded-lg border border-border/30 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="w-full h-full bg-slate-800/50 cursor-crosshair"
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
        <h3 className="text-xl font-bold">Saved Drawings</h3>
        {drawings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-lg p-8">
            <Pen className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your gallery is empty</h3>
            <p>Save a drawing to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(75vh-100px)] p-2 -mr-2 pr-4">
            {drawings.map((drawing, index) => (
              <Card key={index} className="relative group overflow-hidden bg-card/50 backdrop-blur-md border-border/30 aspect-w-4 aspect-h-3">
                <CardContent className="p-0">
                  <Image src={drawing} alt={`Drawing ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => deleteDrawing(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
