import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Detail() {
  const { props } = usePage();
  const { id } = props;

  const produkJadi = [
    {
      id: 1,
      nama: "Kaos Volunteer",
      harga: "Rp 120.000",
      kategori: "Event",
      gambar: "/images/product/produk1.jpg",
      deskripsi:
        "Kaos Volunteer dibuat dari bahan premium yang nyaman dipakai seharian. Cocok untuk acara sosial, event, maupun komunitas.",
    },
    {
      id: 2,
      nama: "Kaos Komunitas",
      harga: "Rp 135.000",
      kategori: "Komunitas",
      gambar: "/images/product/produk2.jpg",
      deskripsi:
        "Kaos Komunitas cocok untuk memperkuat identitas kelompok atau organisasi Anda. Bahan adem, sablon awet, dan nyaman.",
    },
    {
      id: 3,
      nama: "Kaos Premium",
      harga: "Rp 150.000",
      kategori: "Premium",
      gambar: "/images/product/produk3.jpg",
      deskripsi:
        "Kaos Premium dengan desain eksklusif untuk Anda yang ingin tampil stylish. Menggunakan bahan katun combed halus dan sablon berkualitas tinggi.",
    },
  ];

  const produk = produkJadi.find((p) => p.id === parseInt(id));

  if (!produk) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Produk tidak ditemukan</h2>
        <Link href={route("produk-jadi.index")} as="button">
          <Button className="mt-6">⬅ Kembali ke Produk Jadi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full md:h-screen py-16 px-4 bg-white">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gambar Produk */}
        <div className="flex justify-center">
          <img
            src={produk.gambar}
            alt={produk.nama}
            className="w-auto h-[400px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Info Produk */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-700">{produk.nama}</h1>
          <p className="text-gray-600 mb-2">Kategori: {produk.kategori}</p>
          <p className="text-2xl font-semibold text-blue-600 mb-6">{produk.harga}</p>
          <p className="text-gray-700 leading-relaxed">{produk.deskripsi}</p>

          <div className="flex gap-4 mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">🛒 Pesan Sekarang</Button>
            <Link href={route("product.index")} as="button">
              <Button variant="secondary">⬅ Kembali</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
