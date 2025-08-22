import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProdukJadiPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const produkJadi = [
    {
      id: 1,
      nama: "Kaos Volunteer",
      harga: "Rp 120.000",
      kategori: "Event",
      gambar: "/images/produk1.jpg",
    },
    {
      id: 2,
      nama: "Kaos Komunitas",
      harga: "Rp 135.000",
      kategori: "Komunitas",
      gambar: "/images/produk2.jpg",
    },
    {
      id: 3,
      nama: "Kaos Premium",
      harga: "Rp 150.000",
      kategori: "Premium",
      gambar: "/images/produk3.jpg",
    },
  ];

  // Filter berdasarkan pencarian & kategori
  const filteredProduk = produkJadi.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) &&
      (kategori === "Semua" || p.kategori === kategori)
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Produk Jadi Siap Pakai</h1>
        <p className="mt-4 text-lg sm:px-4 ">
          Pilihan kaos sablon yang sudah tersedia dengan desain eksklusif dan siap dikirim.
        </p>
        <a href="/" className="inline-block mt-6">
          <Button variant="secondary">⬅ Kembali ke Home</Button>
        </a>
      </section>

      {/* Filter & Search */}
      <section className="py-10 px-10 mx-auto bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-lg focus:ring focus:ring-blue-400 text-white bg-blue-500"
          />

          {/* Filter Dropdown */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 rounded-lg focus:ring focus:ring-blue-400 text-white bg-blue-500"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Event">Event</option>
            <option value="Komunitas">Komunitas</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Produk Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProduk.length > 0 ? (
            filteredProduk.map((produk) => (
              <div
                key={produk.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden text-center"
              >
                <img
                  src={produk.gambar}
                  alt={produk.nama}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-700">{produk.nama}</h3>
                  <p className="text-gray-600 mt-2">{produk.harga}</p>
                  <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white">Lihat Detail</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              Produk tidak ditemukan
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
