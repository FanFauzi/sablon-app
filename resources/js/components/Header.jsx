import React from "react";

export default function Header({ child }) {
  return (
    <header className="mb-6 px-8 py-5 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <a href="/" className="text-white"><i>Kembali</i></a>
      <h1 className="text-2xl font-bold">{child} - Sablon App</h1>
    </header>
  );
};