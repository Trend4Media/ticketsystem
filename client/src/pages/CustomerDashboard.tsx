import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon, 
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: number;
  category: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const CustomerDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/my-tickets');
      setTickets(response.data);
    } catch (err: any) {
      setError('Fehler beim Laden der Tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'offen':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'in_bearbeitung':
        return <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'geschlossen':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <TicketIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'offen':
        return 'Offen';
      case 'in_bearbeitung':
        return 'In Bearbeitung';
      case 'geschlossen':
        return 'Geschlossen';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offen':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_bearbeitung':
        return 'bg-blue-100 text-blue-800';
      case 'geschlossen':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hilfe':
        return '💡';
      case 'gesperrt':
        return '🔒';
      case 'gewonnen':
        return '🎉';
      default:
        return '📋';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'hilfe':
        return 'Ich benötige Hilfe';
      case 'gesperrt':
        return 'Ich wurde gesperrt';
      case 'gewonnen':
        return 'Ich habe etwas gewonnen';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Willkommen, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Hier finden Sie alle Ihre Support-Tickets
          </p>
        </div>
        <Link
          to="/create-ticket"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Neues Ticket</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Tickets */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Noch keine Tickets
          </h3>
          <p className="text-gray-600 mb-6">
            Sie haben noch keine Support-Tickets erstellt.
          </p>
          <Link
            to="/create-ticket"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Erstes Ticket erstellen</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getCategoryTitle(ticket.category)} • Ticket #{ticket.id}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Erstellt: {new Date(ticket.created_at).toLocaleDateString('de-DE')}</span>
                    <span>Aktualisiert: {new Date(ticket.updated_at).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(ticket.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiken */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {tickets.length}
            </div>
            <div className="text-gray-600">Gesamt Tickets</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'offen' || t.status === 'in_bearbeitung').length}
            </div>
            <div className="text-gray-600">Aktive Tickets</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'geschlossen').length}
            </div>
            <div className="text-gray-600">Gelöste Tickets</div>
          </div>
        </div>
      )}
    </div>
  );
};