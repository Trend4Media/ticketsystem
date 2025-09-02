import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  CogIcon,
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: number;
  user_id: number;
  category: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  assignedFirstName: string | null;
  assignedLastName: string | null;
}

interface SupportStaff {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  author_type: string;
  comment: string;
  created_at: string;
  authorName: string;
}

export const SupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('alle');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
    fetchSupportStaff();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tickets');
      setTickets(response.data);
    } catch (err: any) {
      setError('Fehler beim Laden der Tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportStaff = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/support/staff');
      setSupportStaff(response.data);
    } catch (err: any) {
      console.error('Fehler beim Laden der Support-Mitarbeiter:', err);
    }
  };

  const fetchComments = async (ticketId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tickets/${ticketId}/comments`);
      setComments(response.data);
    } catch (err: any) {
      console.error('Fehler beim Laden der Kommentare:', err);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string, assignedTo?: number) => {
    try {
      await axios.put(`http://localhost:3001/api/tickets/${ticketId}/status`, {
        status,
        assignedTo
      });
      
      fetchTickets();
      
      // Aktualisiere selectedTicket falls es das gleiche ist
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = tickets.find(t => t.id === ticketId);
        if (updatedTicket) {
          setSelectedTicket({ ...updatedTicket, status, assigned_to: assignedTo || null });
        }
      }
    } catch (err: any) {
      setError('Fehler beim Aktualisieren des Ticket-Status');
    }
  };

  const addComment = async (ticketId: number) => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:3001/api/tickets/${ticketId}/comments`, {
        comment: newComment
      });
      
      setNewComment('');
      fetchComments(ticketId);
    } catch (err: any) {
      setError('Fehler beim Hinzufügen des Kommentars');
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

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'alle') return true;
    return ticket.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <CogIcon className="h-8 w-8 text-primary-600" />
            <span>Support Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Willkommen, {user?.firstName}! Verwalten Sie hier alle Support-Tickets.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
          <div className="text-gray-600">Gesamt Tickets</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {tickets.filter(t => t.status === 'offen').length}
          </div>
          <div className="text-gray-600">Offen</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {tickets.filter(t => t.status === 'in_bearbeitung').length}
          </div>
          <div className="text-gray-600">In Bearbeitung</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {tickets.filter(t => t.status === 'geschlossen').length}
          </div>
          <div className="text-gray-600">Geschlossen</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket-Liste */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Alle Tickets</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="alle">Alle</option>
              <option value="offen">Offen</option>
              <option value="in_bearbeitung">In Bearbeitung</option>
              <option value="geschlossen">Geschlossen</option>
            </select>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
                  selectedTicket?.id === ticket.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedTicket(ticket);
                  fetchComments(ticket.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                      <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      von {ticket.userFirstName} {ticket.userLastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ticket.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket-Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {selectedTicket ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ticket #{selectedTicket.id}
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedTicket.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(selectedTicket.category)}</span>
                    <span>{selectedTicket.title}</span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {getCategoryTitle(selectedTicket.category)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Beschreibung:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{selectedTicket.userFirstName} {selectedTicket.userLastName}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedTicket.userEmail}</span>
                </div>
              </div>

              {/* Status-Aktionen */}
              <div className="border-t pt-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Status ändern:</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, 'in_bearbeitung', user?.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-200"
                    disabled={selectedTicket.status === 'in_bearbeitung'}
                  >
                    In Bearbeitung
                  </button>
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, 'geschlossen')}
                    className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition duration-200"
                    disabled={selectedTicket.status === 'geschlossen'}
                  >
                    Schließen
                  </button>
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, 'offen')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition duration-200"
                    disabled={selectedTicket.status === 'offen'}
                  >
                    Wieder öffnen
                  </button>
                </div>
              </div>

              {/* Kommentare */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span>Kommentare</span>
                </h4>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-md ${
                        comment.author_type === 'support' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-gray-50 border-l-4 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">
                          {comment.authorName}
                          {comment.author_type === 'support' && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Support
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString('de-DE')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Neuer Kommentar */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Kommentar hinzufügen..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(selectedTicket.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => addComment(selectedTicket.id)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition duration-200"
                  >
                    Senden
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ticket auswählen
              </h3>
              <p className="text-gray-600">
                Wählen Sie ein Ticket aus der Liste aus, um Details anzuzeigen und zu bearbeiten.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};