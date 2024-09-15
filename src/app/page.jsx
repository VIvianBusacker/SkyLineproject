"use client";
import React from "react";
import RoundedButton from "../components/rounded-button";
import * as ReactGoogleMaps from "@/libraries/react-google-maps";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MainComponent() {
  const [currentScreen, setCurrentScreen] = React.useState("onboarding");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userType, setUserType] = React.useState(null);
  const [viewMode, setViewMode] = React.useState("list");
  const [center, setCenter] = React.useState({ lat: 37.7749, lng: -122.4194 });

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleSignUp = () => {
    setCurrentScreen("registration");
  };

  const handleRegistration = (type) => {
    setUserType(type);
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "map" : "list");
  };

  const translateText = async (text, targetLang) => {
    const response = await fetch(
      "/integrations/google-translate/language/translate/v2",
      {
        method: "POST",
        body: new URLSearchParams({
          q: text,
          target: targetLang,
        }),
      }
    );
    const data = await response.json();
    return data.data.translations[0].translatedText;
  };

  const createQRCode = async (data) => {
    const response = await fetch(
      `/integrations/qr-code/generatebasicbase64?data=${encodeURIComponent(
        data
      )}`,
      {
        method: "GET",
      }
    );
    const qrCode = await response.text();
    return qrCode;
  };

  const transcribeAudio = async (file) => {
    const response = await fetch("/integrations/transcribe-audio-2/listen", {
      method: "POST",
      body: file,
    });
    const data = await response.json();
    return data.results.channels[0].alternatives[0].transcript;
  };

  return (
    <div className="font-nunito-sans text-[#161616] min-h-screen bg-white">
      <header className="bg-[url('https://images.pexels.com/photos/9993872/pexels-photo-9993872.jpeg')] bg-cover bg-center h-64 rounded-b-lg flex items-end">
        <nav className="w-full p-4">
          <h1 className="font-pt-serif text-white text-3xl">Skyline</h1>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentScreen === "onboarding" && (
          <div className="text-center">
            <h2 className="font-pt-serif text-2xl mb-4">Welcome to Skyline</h2>
            <p className="mb-6">
              Streamline your property rental experience with ease
            </p>
            <div className="space-x-4">
              <RoundedButton
                text="Log In"
                onClick={() => setCurrentScreen("login")}
              />
              <RoundedButton text="Sign Up" onClick={handleSignUp} />
            </div>
          </div>
        )}

        {currentScreen === "login" && (
          <div className="max-w-md mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Log In</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="email"
                placeholder="Email or Phone"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <div className="flex justify-between items-center">
                <RoundedButton text="Log In" onClick={handleLogin} />
                <a href="#" className="text-sm text-blue-600">
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        )}

        {currentScreen === "registration" && (
          <div className="max-w-md mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Sign Up</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
                required
              />
              <div className="space-x-4">
                <RoundedButton
                  text="Register as Renter"
                  onClick={() => handleRegistration("renter")}
                />
                <RoundedButton
                  text="Register as Landlord"
                  onClick={() => handleRegistration("landlord")}
                />
              </div>
            </form>
          </div>
        )}

        {currentScreen === "dashboard" && (
          <div>
            <h2 className="font-pt-serif text-2xl mb-4">Dashboard</h2>
            <div className="mb-4 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search properties..."
                className="w-3/4 p-2 border border-[#E4E2DF] rounded-[8px]"
              />
              <RoundedButton
                text={viewMode === "list" ? "Map View" : "List View"}
                onClick={toggleViewMode}
              />
            </div>
            {viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="border border-[#E4E2DF] rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/300/200?random=${item}`}
                      alt={`Property ${item}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-pt-serif text-lg mb-2">
                        Property {item}
                      </h3>
                      <p className="text-sm mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <RoundedButton
                        text="View Details"
                        onClick={() => setCurrentScreen("propertyDetails")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ReactGoogleMaps.APIProvider
                apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                libraries={["places"]}
                onLoad={() => {}}
              >
                <ReactGoogleMaps.Map
                  id="map"
                  mapId="map"
                  center={center}
                  onCenterChanged={(e) => setCenter(e.detail.center)}
                  zoom={12}
                  className="w-full h-[400px] rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <ReactGoogleMaps.AdvancedMarker
                      key={item}
                      position={{
                        lat: center.lat + (Math.random() - 0.5) * 0.1,
                        lng: center.lng + (Math.random() - 0.5) * 0.1,
                      }}
                      onClick={() => setCurrentScreen("propertyDetails")}
                    />
                  ))}
                </ReactGoogleMaps.Map>
              </ReactGoogleMaps.APIProvider>
            )}
          </div>
        )}

        {currentScreen === "propertyDetails" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Property Details</h2>
            <img
              src="https://picsum.photos/800/400"
              alt="Detailed Property View"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="space-x-4 mb-4">
              <RoundedButton
                text="Schedule Viewing"
                onClick={() => setCurrentScreen("booking")}
              />
              <RoundedButton
                text="Message Landlord"
                onClick={() => setCurrentScreen("messaging")}
              />
              <RoundedButton
                text="Make Payment"
                onClick={() => setCurrentScreen("payments")}
              />
            </div>
          </div>
        )}

        {currentScreen === "messaging" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Messages</h2>
            <div className="border border-[#E4E2DF] rounded-lg p-4 mb-4 h-64 overflow-y-auto">
              <div className="mb-2">
                <strong>Landlord:</strong> Hello, how can I help you?
              </div>
              <div className="mb-2">
                <strong>You:</strong> Hi, I'm interested in viewing the
                property.
              </div>
            </div>
            <form className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 border border-[#E4E2DF] rounded-[8px]"
              />
              <RoundedButton text="Send" onClick={() => {}} />
            </form>
          </div>
        )}

        {currentScreen === "booking" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Schedule Viewing</h2>
            <div className="mb-4">
              <input
                type="date"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
              />
            </div>
            <div className="mb-4">
              <input
                type="time"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
              />
            </div>
            <RoundedButton
              text="Confirm Booking"
              onClick={() => setCurrentScreen("dashboard")}
            />
          </div>
        )}

        {currentScreen === "payments" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-pt-serif text-2xl mb-4">Make Payment</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                className="w-full p-2 border border-[#E4E2DF] rounded-[8px]"
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  className="w-1/2 p-2 border border-[#E4E2DF] rounded-[8px]"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  className="w-1/2 p-2 border border-[#E4E2DF] rounded-[8px]"
                />
              </div>
              <div className="flex items-center space-x-4">
                <RoundedButton
                  text="Pay Now"
                  onClick={() => setCurrentScreen("dashboard")}
                />
                <span>Other options: PayPal, Venmo, Apple Pay</span>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#E4E2DF] mt-8 py-4 text-center">
        <p>&copy; 2024 Skyline. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainComponent;