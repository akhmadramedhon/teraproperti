import {
  Ruler,
  Calendar,
  Landmark,
  Info,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Loading from "./Loading";

export default function PropertyDetail() {
  const { id } = useParams();
  const house = useQuery(api.houses.getHouseById, { id });
  const imageUrl = useQuery(api.storage.getUrl, {
    storageId: house?.house_image_url,
  });

  if (!house || !imageUrl) return <Loading />;

  const tanggal = new Date(house.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen">
      {/* Gambar utama */}
      <div className="rounded-xl overflow-hidden shadow">
        <img
          src={imageUrl}
          alt="Rumah"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Konten */}
      <div className="mt-6 space-y-6 bg-white p-6 rounded-xl shadow">
        {/* Judul */}
        <h1 className="text-xl font-bold text-gray-900">
          {house.title || `${house.village}, ${house.district}, ${house.city}`}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Info utama */}
          <div className="flex flex-col gap-4 text-sm w-full lg:w-1/4">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50">
              <Ruler className="h-4 w-4 text-gray-600" />
              <span>{house.land_area} m²</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50">
              <Landmark className="h-4 w-4 text-gray-600" />
              <span>Rp {house.price?.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span>{tanggal}</span>
            </div>
          </div>

          {/* Fasilitas */}
          <div className="bg-gray-100 rounded-xl p-4 text-sm w-full lg:w-1/3 border">
            <p className="font-semibold text-gray-800 mb-2">Fasilitas:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {house.facilities?.map((fasilitas, i) => (
                <li key={i}>{fasilitas}</li>
              ))}
            </ul>
          </div>

          {/* Peringatan & Tombol */}
          <div className="flex flex-col justify-between w-full lg:w-1/2 space-y-4">
            {/* Peringatan */}
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl text-sm flex items-start gap-2">
              <Info className="h-5 w-5 mt-0.5 shrink-0" />
              <p>
                Baca dengan saksama deskripsi produk dan pastikan barang yang ditawarkan
                sesuai dengan yang dijelaskan. Jika ada yang tidak jelas, tanyakan kepada
                penjual terlebih dahulu.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="px-4 py-2 border rounded-lg text-white bg-black hover:bg-gray-800 w-full sm:w-1/2">
                Booking Konsultan
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 w-full sm:w-1/2">
                <Link
                  to={`/teraproperti/chats/start/${house.user_id}`}
                >
                  Chat Pemilik
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
