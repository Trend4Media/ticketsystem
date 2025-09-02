import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';

const ticketCategories = [
  {
    id: 'hilfe',
    title: 'Ich benötige Hilfe',
    description: 'Allgemeine Fragen und Unterstützung bei der Nutzung unserer Dienste',
    icon: '💡',
    color: 'blue'
  },
  {
    id: 'gesperrt',
    title: 'Ich wurde gesperrt',
    description: 'Probleme mit dem Zugang zu Ihrem Account oder gesperrte Funktionen',
    icon: '🔒',
    color: 'red'
  },
  {
    id: 'gewonnen',
    title: 'Ich habe etwas gewonnen',
    description: 'Informationen zu Gewinnen, Preisen oder Belohnungen',
    icon: '🎉',
    color: 'green'
  }
];

export const CreateTicketPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory) {
      setError('Bitte wählen Sie eine Kategorie aus');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3001/api/tickets', {
        category: selectedCategory,
        title,
        description
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Erstellen des Tickets');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const baseClasses = 'border-2 rounded-lg p-4 cursor-pointer transition duration-200 ';
    
    if (selected) {
      switch (color) {
        case 'blue':
          return baseClasses + 'border-blue-500 bg-blue-50';
        case 'red':
          return baseClasses + 'border-red-500 bg-red-50';
        case 'green':
          return baseClasses + 'border-green-500 bg-green-50';
        default:
          return baseClasses + 'border-primary-500 bg-primary-50';
      }
    } else {
      return baseClasses + 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <PlusIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Neues Ticket erstellen</h2>
        <p className="text-gray-600">Wählen Sie die passende Kategorie für Ihr Anliegen</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kategorie-Auswahl */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Kategorie auswählen *
          </label>
          <div className="space-y-3">
            {ticketCategories.map((category) => (
              <div
                key={category.id}
                className={getColorClasses(category.color, selectedCategory === category.id)}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Titel */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titel *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Kurze Beschreibung Ihres Problems"
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Detaillierte Beschreibung *
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Beschreiben Sie Ihr Problem so detailliert wie möglich..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition duration-200"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                <span>Ticket erstellen</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};