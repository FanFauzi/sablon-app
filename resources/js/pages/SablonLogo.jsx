import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import html2canvas from 'html2canvas-pro';
import Header from '../../components/Header';

export default function SablonLogo() {
    const [logo, setLogo] = useState(null);
    const [size, setSize] = useState(100);
    const [view, setView] = useState('front');
    const fileInputRef = useRef();

    const designRef = useRef();

    const [logoPos, setLogoPos] = useState({ top: 50, left: 50 });
    const [dragging, setDragging] = useState(false);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => fileInputRef.current.click();
    const removeLogo = () => setLogo(null);

    const mockupImages = {
        front: '/images/kaos-putih-belakang.png',
        back: '/images/kaos-putih-depan.png',
        side: '/images/kaos-putih-samping.png'
    };

    const startDrag = () => setDragging(true);
    const stopDrag = () => setDragging(false);
    const onDrag = (e) => {
        if (!dragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setLogoPos({
            top: Math.min(Math.max(y, 0), 100),
            left: Math.min(Math.max(x, 0), 100)
        });
    };

    // Fungsi untuk simpan desain
    const saveDesign = () => {
        if (!designRef.current) return;
        html2canvas(designRef.current, { backgroundColor: null }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `desain-kaos-${view}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Head title="Sablon Logo - Sablon App" />
            <Header child="Sablon Logo" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {/* Panel Pengaturan */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Pengaturan Desain</h2>

                    <button
                        onClick={triggerFileUpload}
                        className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded mb-3"
                    >
                        Upload Logo
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                    />

                    {logo && (
                        <button
                            onClick={removeLogo}
                            className="w-full bg-red-500 hover:bg-red-600 py-2 px-4 rounded mb-3"
                        >
                            Hapus Logo
                        </button>
                    )}

                    <label className="block mb-2">Ukuran Logo</label>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full mb-4"
                    />

                    <label className="block mb-2">Tampilan Kaos</label>
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="w-full p-2 rounded text-black mb-4"
                    >
                        <option value="front">Depan</option>
                        <option value="back">Belakang</option>
                        <option value="side">Samping</option>
                    </select>

                    <button
                        onClick={saveDesign}
                        className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
                    >
                        Simpan Desain
                    </button>
                </div>

                {/* Preview */}
                <div className="md:col-span-2 flex justify-center items-center bg-gray-700 rounded-lg p-6">
                    <div
                        ref={designRef}
                        className="relative w-64 h-80"
                        onMouseMove={onDrag}
                        onMouseUp={stopDrag}
                        onMouseLeave={stopDrag}
                    >
                        <img
                            src={mockupImages[view]}
                            alt="Kaos"
                            className="w-full h-full object-cover"
                        />

                        {logo && (
                            <img
                                src={logo}
                                alt="Logo"
                                className="absolute cursor-move"
                                onMouseDown={startDrag}
                                style={{
                                    width: `${size}px`,
                                    height: 'auto',
                                    top: `${logoPos.top}%`,
                                    left: `${logoPos.left}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
