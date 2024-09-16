import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
  <div className="p-7 bg-white shadow-md md:w-1/4 border-b-2 md:border-r-2">
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap font-semibold text-slate-700">
          Search Term:
        </label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-blue-300"
          value={sidebardata.searchTerm}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="font-semibold text-slate-700">Type:</label>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="all"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.type === "all"}
            />
            <span className="text-slate-600">Rent & Sale</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="rent"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.type === "rent"}
            />
            <span className="text-slate-600">Rent</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="sale"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.type === "sale"}
            />
            <span className="text-slate-600">Sale</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="offer"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.offer}
            />
            <span className="text-slate-600">Offer</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="font-semibold text-slate-700">Amenities:</label>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="parking"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.parking}
            />
            <span className="text-slate-600">Parking</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="furnished"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={sidebardata.furnished}
            />
            <span className="text-slate-600">Furnished</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="font-semibold text-slate-700">Sort:</label>
        <select
          onChange={handleChange}
          defaultValue={"created_at_desc"}
          id="sort_order"
          className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 w-full"
        >
          <option value="regularPrice_desc">Price high to low</option>
          <option value="regularPrice_asc">Price low to high</option>
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
        </select>
      </div>

      <button className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition duration-200">
        Search
      </button>
    </form>
  </div>

  <div className="flex-1 bg-white shadow-md">
    <h1 className="text-3xl font-semibold border-b p-5 text-slate-700">
      Listing results:
    </h1>
    <div className="p-7 flex flex-wrap gap-4">
      {!loading && listings.length === 0 && (
        <p className="text-xl text-slate-700">No listing found!</p>
      )}
      {loading && (
        <p className="text-xl text-slate-700 text-center w-full">
          Loading...
        </p>
      )}

      {!loading &&
        listings &&
        listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}

      {showMore && (
        <button
          onClick={onShowMoreClick}
          className="text-blue-600 hover:underline p-7 text-center w-full"
        >
          Show more
        </button>
      )}
    </div>
  </div>
</div>

  );
}
