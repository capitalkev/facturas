import React from 'react';

const Header = () => (
  <header className="w-full max-w-2xl mx-auto text-center mb-6 md:mb-8">
    <h1 className="text-3xl md:text-5xl font-bold text-corporate-dark">
      Capital<span className="text-corporate-red">Express</span>
    </h1>
    <p className="text-base md:text-lg text-gray-600 mt-2">El Analizador de Facturas Inteligente</p>
  </header>
);

export default Header;