function Hero() {
  return (
    <div className="relative bg-background min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="absolute top-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="absolute bottom-0 left-0 bg-[url(/bg-banner.png)] h-1/3 w-[101px] bg-contain bg-no-repeat"></div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Hassle-Free Home Cleaning at Your Fingertips
        </h1>
        <p className="text-gray-500">
          Book a professional cleaner in just a few taps. Sit back and relax while we take care of your home.
        </p>

        <div className="mt-6 bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto">
          <div className="flex items-center border-b pb-2">
            <span className="text-purple-600 text-xl mr-2">🔍</span>
            <input
              type="text"
              placeholder="What service do you need?"
              className="w-full outline-none text-gray-600"
            />
          </div>
          <div className="flex items-center mt-4">
            <span className="text-purple-600 text-xl mr-2">📍</span>
            <input
              type="text"
              placeholder="Enter your location"
              className="w-full outline-none text-gray-600"
            />
          </div>
          <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg w-full">
            Find a Housekeeper
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
