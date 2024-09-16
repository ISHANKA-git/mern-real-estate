import { useEffect, useState } from "react";
import { FaQuoteLeft } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import johnSmithImage from '../assets/images/1c.png';
import janeDoeImage from '../assets/images/2c.png';
import sarahJohnsonImage from '../assets/images/3c.png';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Jane Doe",
      feedback:
        "HomeHorizon helped me find my dream home! The process was smooth, and the team was incredibly supportive.",
      image: janeDoeImage, 
    },
    {
      id: 2,
      name: "John Smith",
      feedback:
        "I highly recommend HomeHorizon. They made buying a home easy and stress-free.",
      image: johnSmithImage, 
    },
    {
      id: 3,
      name: "Sarah Johnson",
      feedback:
        "Amazing service! The agents were professional and guided me through every step.",
      image: sarahJohnsonImage, 
    },
  ];
  return (
    <div>
      {/* top */}
      <section
        className="bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            "url('https://assets.architecturaldesigns.com/plan_assets/366027347/large/95250RW-_Render_001_1722610880.webp')",
        }}
      >
        <div className="bg-black bg-opacity-80 h-full flex justify-center items-center px-4 md:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Dream Home
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8">
              Discover the best properties in the most desirable locations.
            </p>
            <Link to={"/search"}>
              <button className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg hover:bg-blue-700 transition duration-300">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>
      

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-4 flex flex-col gap-12 my-12">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-700">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-700">
                Recent Places for Rent
              </h2>
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-700">
                Recent Places for Sale
              </h2>
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* testimonials */}
      <section className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <FaQuoteLeft className="text-blue-600 text-3xl mb-4" />
              <p className="text-slate-700 mb-4">{testimonial.feedback}</p>
              <img
                className="w-16 h-16 rounded-full object-cover mb-4"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <h3 className="text-xl font-semibold text-slate-800">
                {testimonial.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* call to action */}
    <section
  className="text-white py-16"
  style={{
    backgroundImage: "url('https://assets.architecturaldesigns.com/plan_assets/324990769/large/95023RW_Photo-01_1683640423.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="max-w-6xl mx-auto px-4 text-center bg-black bg-opacity-50 py-8 rounded-lg">
    <h2 className="text-4xl font-bold mb-6">
      Ready to Find Your Dream Home?
    </h2>
    <p className="text-lg mb-8">
      Discover the best properties in your desired location. Whether you're
      looking to buy, rent, or invest, we've got you covered.
    </p>
    <div className="flex justify-center gap-4">
      <Link to={"/search"}>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300">
        Get Started
      </button>
      </Link>
      
      <button className="bg-transparent border-2 border-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
        Contact Us
      </button>
    </div>
  </div>
</section>

    </div>
  );
}
