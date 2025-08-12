import React, { useRef, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import * as fabric from 'fabric';

export default function CustomDesign() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        const c = new fabric.Canvas(canvasRef.current, {
            width: 500,
            height: 600,
            backgroundColor: '#fff',
        });

        // Load kaos default dari public/images
        fabric.Image.fromURL('/images/tshirt-black.png', (img) => {
            img.scaleToWidth(400);
            img.set({
                selectable: false,
                evented: false,
                left: 50,
                top: 0,
            });
            c.add(img);
            c.sendToBack(img);
        }, { crossOrigin: 'anonymous' });

        setCanvas(c);

        return () => {
            c.dispose();
        };
    }, []);

    const addText = () => {
        if (!canvas) return;
        const text = new fabric.Textbox('Teks kamu di sini', {
            left: 50,
            top: 50,
            fontSize: 24,
            fill: '#000',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const uploadImage = (e) => {
        if (!canvas) return;
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Hanya file gambar yang diperbolehkan!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (f) => {
            fabric.Image.fromURL(f.target.result, (img) => {
                img.scaleToWidth(200);
                img.set({
                    left: 150,
                    top: 200,
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        };
        reader.readAsDataURL(file);
    };

    const zoomIn = () => {
        if (!canvas) return;
        canvas.setZoom(canvas.getZoom() + 0.1);
    };

    const zoomOut = () => {
        if (!canvas) return;
        const newZoom = canvas.getZoom() - 0.1;
        if (newZoom > 0.1) canvas.setZoom(newZoom);
    };

    const saveDesign = () => {
        if (!canvas) return;
        const json = canvas.toJSON();
        const png = canvas.toDataURL({ format: 'png' });
        console.log('Design JSON:', json);
        console.log('Design PNG:', png);
        alert('Desain berhasil disimpan! (Lihat console)');
    };

    return (
        <div className="p-6">
            <Head title="Custom Design" />
            <h1 className="text-2xl font-bold mb-4">Custom Design - Sablon App</h1>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Toolbar */}
                <div className="space-y-3 w-full md:w-1/3">
                    <button
                        onClick={addText}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                    >
                        Tambah Teks
                    </button>

                    <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full text-center cursor-pointer">
                        Upload Gambar
                        <input type="file" className="hidden" onChange={uploadImage} />
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={zoomIn}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded w-1/2"
                        >
                            Zoom In
                        </button>
                        <button
                            onClick={zoomOut}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded w-1/2"
                        >
                            Zoom Out
                        </button>
                    </div>

                    <button
                        onClick={saveDesign}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full"
                    >
                        Simpan Desain
                    </button>
                </div>

                {/* Canvas */}
                <div className="flex justify-center items-center w-full md:w-2/3 bg-gray-100 p-4 rounded overflow-auto">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
}
