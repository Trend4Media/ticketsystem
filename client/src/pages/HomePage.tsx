import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TicketIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  const { user, userType } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <TicketIcon className="h-20 w-20 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen beim Ticketsystem
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Ihr professioneller Kundensupport - schnell, effizient und zuverlässig
        </p>

        {!user && (
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Jetzt registrieren
            </Link>
            <Link
              to="/login"
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Anmelden
            </Link>
          </div>
        )}

        {user && userType === 'user' && (
          <div className="flex justify-center space-x-4">
            <Link
              to="/create-ticket"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Neues Ticket erstellen
            </Link>
            <Link
              to="/dashboard"
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Meine Tickets
            </Link>
          </div>
        )}

        {user && userType === 'support' && (
          <Link
            to="/support/dashboard"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
          >
            Support Dashboard öffnen
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Schnelle Hilfe
          </h3>
          <p className="text-gray-600">
            Erhalten Sie schnelle und professionelle Unterstützung für alle Ihre Anliegen.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Einfache Verwaltung
          </h3>
          <p className="text-gray-600">
            Verwalten Sie alle Ihre Support-Anfragen an einem zentralen Ort.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sicher & Zuverlässig
          </h3>
          <p className="text-gray-600">
            Ihre Daten sind bei uns sicher und werden vertraulich behandelt.
          </p>
        </div>
      </div>

      {/* Ticket Categories */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Unsere Support-Kategorien
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💡 Ich benötige Hilfe
            </h3>
            <p className="text-gray-600">
              Allgemeine Fragen und Unterstützung bei der Nutzung unserer Dienste.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔒 Ich wurde gesperrt
            </h3>
            <p className="text-gray-600">
              Probleme mit dem Zugang zu Ihrem Account oder gesperrte Funktionen.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎉 Ich habe etwas gewonnen
            </h3>
            <p className="text-gray-600">
              Informationen zu Gewinnen, Preisen oder Belohnungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};