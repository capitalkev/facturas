import React from 'react';

const UserInfoStep = ({ formData, onFormChange, onFormSubmit }) => (
  <div className="text-center">
    <h2 className="text-xl md:text-3xl font-bold text-corporate-dark">
      ¡Bienvenido!
    </h2>
    <p className="mt-2 text-gray-600 text-sm md:text-base">
      Comencemos con tu información de contacto.
    </p>
    <form onSubmit={onFormSubmit} className="space-y-6 mt-8">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={onFormChange}
            className="appearance-none block w-full px-3 text-black bg-white py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-corporate-red focus:border-corporate-red sm:text-sm"
            placeholder="tu@empresa.com" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono / Celular</label>
        <div className="mt-1">
          <input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={onFormChange}
            className="appearance-none block w-full px-3 text-black bg-white py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-corporate-red focus:border-corporate-red sm:text-sm"
            placeholder="987 654 321" />
        </div>
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-corporate-red hover:bg-corporate-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transition-all transform hover:scale-105">
          Siguiente
        </button>
      </div>
    </form>
  </div>
);

export default UserInfoStep;