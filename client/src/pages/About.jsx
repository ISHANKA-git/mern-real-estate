import React from 'react'
import { FaUserTie, FaHome, FaSmile } from 'react-icons/fa';

export default function About() {
  return (
    <section className=" py-16 flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <div className="container mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Text and Stats */}
        <div>
          <h3 className='text-2xl text-gray-400 py-8'>About Us</h3>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Explore Your Real Estate Journey <span className="text-blue-600">With Us</span>
          </h2>
          <p className="text-lg text-slate-900 mb-8 py-2">
            Discover the perfect home or the ideal buyer with our expert services. Join our community of homeowners and buyers for a seamless and rewarding real estate experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            {/* Grid Item 1 */}
            <div className="flex flex-col items-center">
              <FaUserTie className="text-blue-600 text-5xl mb-4" />
              <h3 className="text-3xl font-bold text-blue-600">2100+</h3>
              <p className="text-slate-900 mt-2">Expert Agents</p>
            </div>
            {/* Grid Item 2 */}
            <div className="flex flex-col items-center">
              <FaHome className="text-blue-600 text-5xl mb-4" />
              <h3 className="text-3xl font-bold text-blue-600">50,000+</h3>
              <p className="text-slate-900 mt-2">Properties</p>
            </div>
            {/* Grid Item 3 */}
            <div className="flex flex-col items-center">
              <FaSmile className="text-blue-600 text-5xl mb-4" />
              <h3 className="text-3xl font-bold text-blue-600">56,000+</h3>
              <p className="text-slate-900 mt-2">Happy Clients</p>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="src/assets/images/1.png"
            alt="Real Estate Journey"
            className="w-80 h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>


  )
}
