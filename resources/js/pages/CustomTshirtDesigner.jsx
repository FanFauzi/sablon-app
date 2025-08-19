import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import Header from "../components/Header";
import { Head } from "@inertiajs/react";

export default function App() {
  const designCanvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [view, setView] = useState("front");
  const [isLoading, setIsLoading] = useState(true);

  const mockupImages = {
    front: "images/kaos-putih-depan.png",
    back: "images/kaos-putih-belakang.png",
    side: "images/kaos-putih-samping.png",
  };

  // Inisialisasi canvas
  useEffect(() => {
    const bgCanvas = new fabric.StaticCanvas("bg-canvas", {
      width: 500,
      height: 500,
      selection: false,
      isDrawingMode: false,
    });
    bgCanvasRef.current = bgCanvas;

    const designCanvas = new fabric.Canvas("design-canvas", {
      width: 500,
      height: 500,
      preserveObjectStacking: true,
      backgroundColor: "transparent",
    });
    designCanvasRef.current = designCanvas;

    loadShirtImage(view);

    return () => {
      bgCanvas.dispose();
      designCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (bgCanvasRef.current) loadShirtImage(view);
  }, [view]);

  const loadShirtImage = (side) => {
    if (!bgCanvasRef.current) return;
    const bgCanvas = bgCanvasRef.current;
    setIsLoading(true);

    fabric.Image.fromURL(
      mockupImages[side],
      (img) => {
        const scale = Math.min(
          (bgCanvas.width * 1.7) / img.width,
          (bgCanvas.height * 1.7) / img.height
        );

        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: "center",
          originY: "center",
          left: bgCanvas.width / 2,
          top: bgCanvas.height / 2,
          selectable: false,
          evented: false,
        });

        bgCanvas.clear();
        bgCanvas.add(img);
        bgCanvas.renderAll();
        setIsLoading(false);
      },
      { crossOrigin: "anonymous" }
    );
  };

  const addCustomControls = (obj) => {
    obj.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        designCanvasRef.current.remove(target);
        designCanvasRef.current.requestRenderAll();
        return true;
      },
      render: (ctx, left, top) => {
        ctx.save();
        ctx.translate(left, top);
        ctx.fillStyle = "#FF4444";
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(5, 5);
        ctx.moveTo(5, -5);
        ctx.lineTo(-5, 5);
        ctx.stroke();
        ctx.restore();
      },
      cornerSize: 24,
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !designCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(
        f.target.result,
        (img) => {
          if (!img) return;
          img.scaleToWidth(150);
          img.set({
            left: designCanvasRef.current.width / 2,
            top: designCanvasRef.current.height / 2,
            originX: "center",
            originY: "center",
          });

          addCustomControls(img);
          designCanvasRef.current.add(img);
          designCanvasRef.current.setActiveObject(img);
          designCanvasRef.current.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    if (!designCanvasRef.current) return;
    const text = new fabric.Textbox("Ketik teks disini", {
      width: 200,
      fontSize: 20,
      fill: "#000000",
      fontFamily: "Arial",
    });
    addCustomControls(text);
    designCanvasRef.current.add(text).centerObject(text).setActiveObject(text);
    designCanvasRef.current.renderAll();
  };

  const saveDesign = () => {
    if (!designCanvasRef.current || !bgCanvasRef.current) return;
    setIsLoading(true);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 500;
    finalCanvas.height = 500;
    const ctx = finalCanvas.getContext("2d");

    const bgImagePromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = bgCanvasRef.current.toDataURL({ format: "png", quality: 1 });
    });

    const designImagePromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = designCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
      });
    });

    Promise.all([bgImagePromise, designImagePromise]).then(([bgImg, designImg]) => {
      ctx.drawImage(bgImg, 0, 0);
      ctx.drawImage(designImg, 0, 0);

      const link = document.createElement("a");
      link.href = finalCanvas.toDataURL("image/png");
      link.download = `desain-kaos-${view}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-white text-white font-sans">
      <div className=" mx-auto">
        <Head title="Desain Kaos" />
        <Header child="Desain Kaos" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
          {/* Panel Kontrol */}
          <div className="bg-blue-500 p-8 rounded-xl shadow-xl shadow-indigo-500/50">
            <h2 className="text-xl font-semibold mb-6 border-b-2 border-white pb-3 text-white">
              Pengaturan Desain
            </h2>

            <div className="space-y-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors transform hover:scale-105"
              >
                Upload Gambar/Logo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />

              <button
                onClick={addText}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-colors transform hover:scale-105"
              >
                Tambah Teks
              </button>

              <div className="pt-4 border-t-2 border-white">
                <label className="block text-sm font-medium mb-2 text-white">
                  Tampilan Kaos
                </label>
                <select
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  className="w-full bg-white border border-gray-600 rounded-lg py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="front">Depan</option>
                  <option value="back">Belakang</option>
                  <option value="side">Samping</option>
                </select>
              </div>

              <button
                onClick={saveDesign}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition-colors transform hover:scale-105 mt-6"
              >
                Simpan Desain
              </button>
            </div>
          </div>

          {/* Tampilan Kanvas */}
          <div className="relative w-[500px] h-[500px] mx-auto lg:col-span-3 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-20">
                <div className="text-white text-lg animate-pulse">Memuat...</div>
              </div>
            )}
            <canvas id="bg-canvas" className="absolute top-0 left-0 z-0 bg-cover bg-gray-500" />
            <canvas
              id="design-canvas"
              className="absolute top-0 left-0 z-10 cursor-move"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
