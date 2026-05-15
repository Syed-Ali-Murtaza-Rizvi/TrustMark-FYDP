// src/pages/EventAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import CreateEventModal from "../components/events/CreateEventModal";
import EventModal from "../components/events/EventModal";
import "../styles/eventAdmin.css";
import { Calendar } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";


export default function EventAdminDashboard() {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await axiosInstance.get("/api/events/events/");
      const list = Array.isArray(data) ? data : data?.results || [];
      setEvents(list);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const { data } = await axiosInstance.post("/api/events/events/", payload);
      setEvents((prev) => [data, ...prev]);
      setShowCreate(false);
    } catch (error) {
      const message = error?.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : "Failed to create event.";
      alert(message || "Failed to create event.");
    }
  };

  const handleView = (ev) => setSelectedEvent(ev);
  const handleCloseModal = () => setSelectedEvent(null);

  const handleCopyLink = (ev) => {
    if (!ev.isUpcoming) {
      alert("This event is closed. Past events cannot be shared.");
      return;
    }
    
    // Fallback for non-secure contexts (HTTP + IP address)
    const link = ev.registrationLink;
    if (navigator.clipboard && window.location.protocol === 'https:') {
      navigator.clipboard.writeText(link).then(() => {
        alert("Link copied to clipboard");
      });
    } else {
      // Fallback for HTTP or IP address access
      const textArea = document.createElement("textarea");
      textArea.value = link;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Link copied to clipboard");
      } catch (err) {
        // Last resort - show the link so user can copy manually
        prompt("Copy this registration link:", link);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    

      <div className="event-admin">
        <div className="header-row">
          <div className="header-left">
            <div className="header-icon">
              <Calendar size={28} color="#6b7c93" strokeWidth={2.5} />
            </div>

            <div className="header-title">
              <h1>Event Admin Dashboard</h1>
              <p>Manage events and registrations</p>
            </div>
          </div>

          <div className="top-actions">
            <button
              className="btn create"
              onClick={() => setShowCreate(true)}
            >
              ＋ Create Event
            </button>
          </div>
        </div>

        <div className="card-grid">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onView={handleView}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>

        {showCreate && (
          <CreateEventModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreate}
          />
        )}

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}
      </div>

  );
}