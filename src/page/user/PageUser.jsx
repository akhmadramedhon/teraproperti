import PropertyCard from "../../component/Card";
import Footer from "../../component/Footer";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Loading from "../../component/Loading";
import { useSearch } from "../../component/SearchContext";

export default function PageUser() {
  const { searchTerm } = useSearch();
  const houses = useQuery(
    searchTerm ? api.houses.searchHouses : api.houses.getApprovedHouses,
    searchTerm ? { search: searchTerm } : undefined
  );

  if (!houses) return <Loading />;
  if (houses.length === 0) return <p className="text-center">Belum ada rumah tersedia.</p>;

  return (
    <>
      <div className="min-h-screen px-6 space-y-6">
        {/* <PropertyDetail /> */}
        <div>
          <h1 className="text-3xl font-bold text-black ml-14">Property</h1>
          <p className="text-sm text-gray-500 ml-24 my-3">rumah tervalidasi</p>
        </div>

        
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-hide">
          <div className="flex gap-4 w-max">
            {houses.map((house) => (
              <PropertyCard key={house._id} house={house} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

