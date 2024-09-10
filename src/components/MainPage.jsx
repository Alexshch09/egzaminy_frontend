// src/components/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Witaj na naszej stronie!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Nasza strona oferuje szereg testów przygotowanych z myślą o Twoim rozwoju. 
          Przede wszystkim możesz przetestować swoją wiedzę w różnych dziedzinach, takich jak JavaScript i inne technologie.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            to="/test"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Rozpocznij testy
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
