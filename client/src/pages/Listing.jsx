import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const [contact, setContact] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);
  return (
    <main className="relative min-h-screen bg-gray-50">
  {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
  {error && (
    <p className="text-center my-7 text-2xl text-red-600">Something went wrong!</p>
  )}
  {listing && !loading && !error && (
    <div className="max-w-6xl mx-auto p-4">
      {/* Swiper for Listing Images */}
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
        <Swiper navigation loop>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[550px] w-full"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Share Button */}
        <div className="absolute top-4 right-4 z-10 p-3 bg-white shadow-md rounded-full cursor-pointer hover:bg-gray-100 transition-all">
          <FaShare
            className="text-gray-600"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          />
        </div>
        {copied && (
          <p className="absolute top-14 right-4 z-10 bg-green-100 text-green-800 px-3 py-1 rounded-lg">
            Link copied!
          </p>
        )}
      </div>

      {/* Listing Info Section */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          {listing.name} - ${' '}
          {listing.offer
            ? listing.discountPrice.toLocaleString('en-US')
            : listing.regularPrice.toLocaleString('en-US')}
          {listing.type === 'rent' && ' / month'}
        </h1>

        <p className="flex items-center text-gray-500 mb-4">
          <FaMapMarkerAlt className="text-green-500 mr-2" />
          {listing.address}
        </p>

        {/* Badges for Sale/Rent and Offer */}
        <div className="flex gap-4 mb-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${listing.type === 'rent' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {listing.offer && (
            <span className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-full">
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">
          <span className="font-semibold text-gray-900">Description: </span>
          {listing.description}
        </p>

        {/* Features List */}
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-600 text-sm font-semibold">
          <li className="flex items-center gap-2">
            <FaBed className="text-lg text-blue-500" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Beds`
              : `${listing.bedrooms} Bed`}
          </li>
          <li className="flex items-center gap-2">
            <FaBath className="text-lg text-blue-500" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Baths`
              : `${listing.bathrooms} Bath`}
          </li>
          <li className="flex items-center gap-2">
            <FaParking className="text-lg text-blue-500" />
            {listing.parking ? 'Parking Spot' : 'No Parking'}
          </li>
          <li className="flex items-center gap-2">
            <FaChair className="text-lg text-blue-500" />
            {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>

        {/* Contact Landlord Button */}
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="mt-6 w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Contact Landlord
          </button>
        )}

        {contact && <Contact listing={listing} />}
      </div>
    </div>
  )}
</main>

  );
}