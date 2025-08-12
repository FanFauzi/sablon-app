import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out'
        });
    }, []);

    return (
        <div className="bg-white text-gray-800 scroll-smooth">
            <Head title="Sablon-App" />

            {/* Navbar */}
            <nav
                className="fixed top-0 left-0 w-full bg-white shadow z-50"
                data-aos="fade-down"
            >
                <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
                    <a href="#" className="text-2xl font-bold text-blue-600">
                        Sablon-App
                    </a>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
                        <li><a href="#fitur" className="hover:text-blue-600 transition">Fitur</a></li>
                        <li><a href="#produk" className="hover:text-blue-600 transition">Produk</a></li>
                        <li><a href="#tentang" className="hover:text-blue-600 transition">Tentang</a></li>
                    </ul>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white shadow-inner border-t border-gray-200 animate-slide-down">
                        <ul className="flex flex-col py-4 space-y-3 text-gray-700 font-medium px-6">
                            <li>
                                <a href="#fitur" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Fitur</a>
                            </li>
                            <li>
                                <a href="#produk" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Produk</a>
                            </li>
                            <li>
                                <a href="#tentang" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Tentang</a>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 px-6 text-center mt-[64px]"
                data-aos="fade-up"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Selamat Datang di Sablon-App
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                    Platform terbaik untuk membuat kaos sablon berkualitas tinggi
                    dan desain custom sesuai keinginan Anda.
                </p>
                <a
                    href="#produk"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                >
                    Lihat Produk
                </a>
            </section>

            {/* Fitur Section */}
            <section
                id="fitur"
                className="py-16 px-6 max-w-6xl mx-auto"
                data-aos="fade-up"
            >
                <h2 className="text-3xl font-bold text-center mb-12">Kenapa Memilih Sablon-App?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition" data-aos-delay="100">
                        <h3 className="text-xl font-semibold mb-2">Desain Custom</h3>
                        <p>Buat desain kaos unik sesuai selera Anda dengan editor online kami.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition" data-aos-delay="200">
                        <h3 className="text-xl font-semibold mb-2">Bahan Premium</h3>
                        <p>Gunakan kaos dengan bahan premium yang nyaman dipakai dan awet.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition" data-aos-delay="300">
                        <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
                        <p>Pesanan Anda dikirim dengan cepat dan aman ke seluruh Indonesia.</p>
                    </div>
                </div>
            </section>

            {/* Produk Section */}
            <section id="produk" className="py-16 px-6 bg-gray-100" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-center mb-12">Produk Populer</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { name: 'Kaos Sablon Logo', img: './images/sablon-logo.jpg', link: '/sablon-logo' },
                        { name: 'Kaos Custom Desain', img: './images/tshirt-black.png', link: '/custom-desain' },
                        { name: 'Kaos Komunitas', img: './images/komunitas.jpg', link: '/komunitas-desain' },
                    ].map((produk, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                            data-aos="zoom-in"
                            data-aos-delay={idx * 150}
                        >
                            <img src={produk.img} alt={produk.name} className="w-full h-60 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{produk.name}</h3>
                                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                    <a href={produk.link}>
                                        Lihat Detail
                                    </a>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tentang Kami */}
            <section id="tentang" className="py-16 px-6 max-w-4xl mx-auto text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold mb-6">Tentang Sablon-App</h2>
                <p className="text-lg leading-relaxed mb-6">
                    Sablon-App adalah platform yang menyediakan layanan sablon kaos berkualitas tinggi
                    dengan berbagai pilihan desain dan bahan premium. Kami percaya setiap orang
                    berhak memiliki kaos yang merepresentasikan gaya dan identitas mereka.
                </p>
                <a href="#fitur" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
                    Pelajari Lebih Lanjut
                </a>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 text-center" data-aos="fade-up">
                <p>&copy; {new Date().getFullYear()} Sablon-App. All rights reserved.</p>
            </footer>

            {/* Extra CSS untuk animasi mobile menu */}
            <style>
                {`
                    @keyframes slide-down {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-down {
                        animation: slide-down 0.3s ease-out;
                    }
                `}
            </style>
        </div>
    );
}