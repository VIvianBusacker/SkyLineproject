"use client";
import React from "react";
import * as ReactGoogleMaps from "@/libraries/react-google-maps";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function RoundedButton({ text, onClick }) {
  return (
    <button
      className="bg-[#E4E2DF] text-[#161616] rounded-[8px] px-4 py-2 font-nunito-sans text-sm hover:bg-[#CDCBC8] transition-colors duration-300"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function RoundedButtonStory() {
  return (
    <div className="p-4 space-y-4">
      <RoundedButton text="Click me" onClick={() => alert("Button clicked!")} />
      <RoundedButton text="Submit" onClick={() => alert("Form submitted!")} />
      <RoundedButton text="Cancel" onClick={() => alert("Action cancelled!")} />
    </div>
  );
}

export default RoundedButton;