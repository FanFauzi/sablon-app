import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import Header from "../components/Header";
import { Head } from "@inertiajs/react";

export default function App() {
  const designCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [harga, setHarga] = useState(0);
  const [size, setSize] = useState("M");
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeColor, setActiveColor] = useState("putih");

  const tshirtColors = {
    putih: "#FFFFFF",
    hitam: "#000000",
    merah: "#E53E3E",
    biru: "#3182CE",
    hijau: "#38A169",
    abu: "#A0AEC0"
  };

  const mockupImages = {
    putih: {
      front: "images/kaos-putih-depan.png",
      back: "images/kaos-putih-belakang.png",
      side: "images/kaos-putih-samping.png",
    },
    hitam: {
      front: "images/kaos-hitam-depan.png",
      back: "images/kaos-hitam-belakang.png",
      side: "images/kaos-hitam-samping.png",
    },
    merah: {
      front: "images/kaos-merah-depan.png",
      back: "images/kaos-merah-belakang.png",
      side: "images/kaos-merah-samping.png",
    },
    biru: {
      front: "images/kaos-biru-depan.png",
      back: "images/kaos-biru-belakang.png",
      side: "images/kaos-biru-samping.png",
    },
    hijau: {
      front: "images/kaos-hijau-depan.png",
      back: "images/kaos-hijau-belakang.png",
      side: "images/kaos-hijau-samping.png",
    },
    abu: {
      front: "images/kaos-abu-depan.png",
      back: "images/kaos-abu-belakang.png",
      side: "images/kaos-abu-samping.png",
    }
  };

  const sizePrices = {
    S: 50000,
    M: 55000,
    L: 60000,
    XL: 65000,
    XXL: 70000,
  };

  const hitungHarga = () => {
    let total = sizePrices[size];

    if (!designCanvasRef.current) return;

    const allObjects = designCanvasRef.current.getObjects();

    allObjects.forEach(obj => {
      if (obj.type === "image" && !obj.isBackground) {
        const width = obj.scaleX * obj.width;
        const height = obj.scaleY * obj.height;
        const area = width * height;

        if (area < 10000) total += 20000;
        else if (area < 30000) total += 35000;
        else total += 50000;
      }
    });

    setHarga(total);
  };

  // Initialize canvas on first load
  useEffect(() => {
    const mainDesignCanvas = new fabric.Canvas("design-canvas", {
      width: 500,
      height: 1500,
      preserveObjectStacking: true,
      backgroundColor: "#f8fafc",
    });
    designCanvasRef.current = mainDesignCanvas;

    // Load all three mockup images
    loadTshirtImages();

    // Event listeners for the main design canvas
    mainDesignCanvas.on("object:added", hitungHarga);
    mainDesignCanvas.on("object:modified", hitungHarga);
    mainDesignCanvas.on("object:removed", hitungHarga);

    return () => {
      mainDesignCanvas.dispose();
    };
  }, []);

  const loadTshirtImages = () => {
    if (!designCanvasRef.current) return;

    const mainDesignCanvas = designCanvasRef.current;

    // Clear existing background images and design objects
    mainDesignCanvas.clear();

    // Load all three mockup images
    const loadImagesPromises = Object.keys(mockupImages[activeColor]).map((viewKey, index) => {
      return new Promise((resolve) => {
        fabric.Image.fromURL(mockupImages[activeColor][viewKey], (img) => {
          const scale = 0.5;
          let top = 0;

          // Position each t-shirt view
          if (viewKey === 'front') top = 250;
          else if (viewKey === 'back') top = 750;
          else if (viewKey === 'side') top = 1250;

          img.set({
            scaleX: scale,
            scaleY: scale,
            originX: "center",
            originY: "center",
            left: mainDesignCanvas.width / 2,
            top: top,
            selectable: false,
            evented: false,
            isBackground: true,
            name: viewKey,
          });
          mainDesignCanvas.add(img);
          mainDesignCanvas.sendToBack(img);
          resolve();
        }, { crossOrigin: "anonymous" });
      });
    });

    Promise.all(loadImagesPromises).then(() => {
      setIsLoading(false);
      mainDesignCanvas.renderAll();
    });
  };

  // Update the price when the size changes.
  useEffect(() => {
    hitungHarga();
  }, [size]);

  // Reload t-shirt images when color changes
  useEffect(() => {
    if (designCanvasRef.current) {
      setIsLoading(true);
      loadTshirtImages();
    }
  }, [activeColor]);

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
        hitungHarga();
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
            left: 250, // Position on front t-shirt by default
            top: 250,
            originX: "center",
            originY: "center",
          });

          addCustomControls(img);
          designCanvasRef.current.add(img);
          designCanvasRef.current.setActiveObject(img);
          designCanvasRef.current.renderAll();
          hitungHarga();
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
  };

  const saveDesign = async () => {
    setIsLoading(true);

    try {
      const link = document.createElement("a");
      link.href = designCanvasRef.current.toDataURL("image/png");
      link.download = "desain-kaos-lengkap.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const designData = designCanvasRef.current.toJSON();

    const orderData = {
      ...userData,
      size: size,
      totalPrice: harga,
      design: designData,
    };

    try {
      const response = await fetch('http://backend-api-url/submit-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Pesanan berhasil dikirim!');
        setUserData({ name: '', email: '' });
      } else {
        alert('Gagal mengirim pesanan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Terjadi kesalahan saat mengirim pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans">
      <div className="mx-auto">
        <Head title="Desain Kaos" />
        <Header child="Desain Kaos" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4">
              {/* Panel Kontrol */}
              <div className="bg-gradient-to-b from-blue-600 to-indigo-700 p-6 lg:p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-blue-500">
                  <i className="fas fa-paint-brush mr-2"></i>
                  Editor Desain
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fas fa-upload mr-2"></i>
                      Upload Desain
                    </h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center"
                    >
                      <i className="fas fa-image mr-2"></i>
                      Upload Gambar/Logo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div className="pt-4 border-t border-blue-500">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fas fa-tshirt mr-2"></i>
                      Warna Kaos
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(tshirtColors).map(([color, hex]) => (
                        <button
                          key={color}
                          onClick={() => setActiveColor(color)}
                          className={`h-10 rounded-lg border-2 transition-all ${activeColor === color ? 'border-white scale-110 shadow-lg' : 'border-blue-400'}`}
                          style={{ backgroundColor: hex }}
                          title={color.charAt(0).toUpperCase() + color.slice(1)}
                        >
                          {activeColor === color && (
                            <i className="fas fa-check text-white"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-500">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <i className="fas fa-ruler mr-2"></i>
                      Ukuran Kaos
                    </h3>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-white/10 border border-blue-400 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors"
                    >
                      {Object.keys(sizePrices).map((s) => (
                        <option key={s} value={s}>
                          {s} - Rp {sizePrices[s].toLocaleString("id-ID")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl shadow-inner">
                    <p className="text-sm font-semibold">Total Harga:</p>
                    <p className="text-2xl font-bold text-white">
                      Rp {harga.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    onClick={saveDesign}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Simpan Desain
                  </button>

                  <form onSubmit={handleSubmit} className="pt-4 border-t border-blue-500 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <i className="fas fa-paper-plane mr-2"></i>
                      Kirim Pesanan
                    </h3>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Nama</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-blue-400 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors"
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-blue-400 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors"
                        placeholder="alamat@email.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle mr-2"></i>
                          Kirim Pesanan
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Tampilan Kanvas */}
              <div className="lg:col-span-3 flex flex-col items-center p-6 lg:p-8">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex items-center space-x-3 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg border border-gray-700 animate-fade-in">
                      {/* Spinner modern */}
                      <svg
                        className="animate-spin h-5 w-5 text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                        />
                      </svg>

                      {/* Text */}
                      <span className="text-sm font-medium">Memuat data...</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Desain Kaos Custom</h1>
                  <p className="text-gray-600 max-w-2xl">
                    Desain kaos impianmu dengan mudah! Seret dan lepas gambar ke area kaos yang diinginkan.
                  </p>
                </div>

                <div className="w-full bg-white p-6 mb-6">
                  <div className="relative w-full h-[1500px] mx-auto rounded-xl overflow-hidden border-4 border-white shadow-lg">
                    <canvas
                      id="design-canvas"
                      className="absolute top-0 left-0 z-10 cursor-move"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center max-w-2xl">
                  <p className="text-blue-700 flex items-center justify-center">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Tips: Gunakan tool panel di sebelah kiri untuk menambahkan gambar dan mengubah warna kaos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}