// PropertyCard.jsx
import { Ruler, Calendar, ListOrdered, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function PropertyCard({ house }) {
  const imageUrl = useQuery(api.storage.getUrl, {
    storageId: house.house_image_url,
  });

  const tanggal = new Date(house.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-md border bg-white">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Rumah"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-3">
        <h2 className="text-base font-semibold text-gray-800">
          {house.village}, {house.district}, {house.city}
        </h2>

        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <Ruler className="h-4 w-4" />
          <span>{house.land_area} m²</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <Landmark className="h-4 w-4" />
          <span>Rp {house.price?.toLocaleString("id-ID")}</span>
        </div>

        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 font-medium text-gray-800">
            <ListOrdered className="h-4 w-4" />
            <span>Fasilitas:</span>
          </div>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-0.5">
            {house.facilities?.slice(0, 3).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{tanggal}</span>
        </div>

        <div className="flex justify-between pt-2">
          <Link
            to={`/teraproperti/detail-properti/${house._id}`}
            className="text-sm text-blue-600 underline"
          >
            Detail Property
          </Link>
          
        </div>
      </div>
    </div>
  );
}
