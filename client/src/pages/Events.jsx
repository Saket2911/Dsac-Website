import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, Users, ExternalLink, Trophy, Sparkles, Play, History, Loader2 } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { useState, useEffect } from "react";
import API_BASE from "../config/api.js";

const tabDefs = [{
  key: "flagship",
  label: "Flagship",
  icon: <Trophy className="w-4 h-4" />
}, {
  key: "ongoing",
  label: "Ongoing",
  icon: <Play className="w-4 h-4" />
}, {
  key: "upcoming",
  label: "Upcoming",
  icon: <CalendarIcon className="w-4 h-4" />
}, {
  key: "past",
  label: "Past",
  icon: <History className="w-4 h-4" />
}];

const getBadgeStyle = type => {
  switch (type) {
    case "Flagship Event":
      return "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100";
    case "National Level":
      return "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-100";
    default:
      return "bg-secondary/10 text-secondary";
  }
};
const getBadgeIcon = type => {
  switch (type) {
    case "Flagship Event":
      return <Trophy className="w-3 h-3 mr-1" />;
    case "National Level":
      return <Sparkles className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

/* ── Shared Event Card ── */
function EventCard({ event, isFlagship }) {
  const eventDate = new Date(event.date);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthStr = monthNames[eventDate.getMonth()];
  const dayStr = eventDate.getDate();

  return <Card className={`border-border/50 shadow-sm transition-all duration-300 ${isFlagship ? "hover:shadow-lg hover:border-primary/30" : "hover:shadow-md"}`}>
    <CardContent className="p-0 flex flex-col md:flex-row">
      {/* Date Column */}
      <div className={`md:border-r border-b md:border-b-0 border-border/50 p-6 flex md:flex-col items-center justify-center gap-2 md:gap-0 md:min-w-[140px] shrink-0 ${isFlagship ? "bg-gradient-to-b from-amber-50 to-card/50 dark:from-amber-950/20 dark:to-card/50" : "bg-card/50"}`}>
        <span className={`text-sm font-bold uppercase ${isFlagship ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>
          {monthStr}
        </span>
        <span className="text-3xl md:text-4xl font-bold text-foreground">
          {dayStr}
        </span>
      </div>

      {/* Content Column */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          {isFlagship ? <Badge className={`${getBadgeStyle(event.type)} mb-2 flex items-center`}>
            {getBadgeIcon(event.type)}
            {event.type}
          </Badge> : <Badge variant="secondary" className="bg-secondary/10 text-secondary mb-2">
            {event.type}
          </Badge>}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium text-foreground/80 mb-6">
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> {event.time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {event.location}
            </div>
          )}
          {event.attendees > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />{" "}
              {isFlagship ? `${event.attendees}+ Expected` : `${event.attendees} Attending`}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-auto">
          {event.redirectUrl ? (
            <a href={event.redirectUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-secondary text-white gap-2">
                {isFlagship ? "Learn More" : "Register / Details"} <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          ) : (
            <Button className="bg-primary hover:bg-secondary text-white" disabled>
              {isFlagship ? "Learn More" : "Details Coming Soon"}
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>;
}

/* ── Empty State ── */
function EmptyState({ category }) {
  return <Card className="border-border/50 border-dashed shadow-none">
    <CardContent className="py-16 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        {category === "ongoing" ? <Play className="w-6 h-6 text-muted-foreground" /> : category === "upcoming" ? <CalendarIcon className="w-6 h-6 text-muted-foreground" /> : <History className="w-6 h-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        No {category} events
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        {category === "ongoing"
          ? "There are no events currently in progress. Check back soon!"
          : category === "upcoming"
            ? "No upcoming events yet. Check back soon!"
            : "Past events will appear here once they've concluded."}
      </p>
    </CardContent>
  </Card>;
}

/* ── Main Component ── */
export default function Events() {
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("flagship");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/events`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Categorize events by their stored category
  const eventsByCategory = {
    flagship: events.filter(e => e.category === "flagship"),
    ongoing: events.filter(e => e.category === "ongoing"),
    upcoming: events.filter(e => e.category === "upcoming"),
    past: events.filter(e => e.category === "past"),
  };

  // Get dates that have events (for calendar highlighting)
  const eventDates = events.map(e => {
    const d = new Date(e.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  // Filter events when a date is clicked on the calendar
  const handleDateSelect = (newDate) => {
    setDate(newDate);
    if (!newDate) {
      setSelectedDateFilter(null);
      return;
    }
    // Check if clicked date has events
    const clickedDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const hasEvents = eventDates.some(d => d.getTime() === clickedDate.getTime());
    if (hasEvents) {
      setSelectedDateFilter(clickedDate);
    } else {
      setSelectedDateFilter(null);
    }
  };

  // Get events to display (either filtered by date or by tab)
  const getDisplayEvents = () => {
    if (selectedDateFilter) {
      return events.filter(e => {
        const d = new Date(e.date);
        const eventDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return eventDate.getTime() === selectedDateFilter.getTime();
      });
    }
    return eventsByCategory[activeTab] || [];
  };

  const currentEvents = getDisplayEvents();

  return <div className="pt-6 pb-10 space-y-8 animate-in fade-in duration-500">
    <div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">Club Events</h1>
      <p className="text-muted-foreground mt-2 text-lg">
        Workshops, meetups, and talks to accelerate your learning.
      </p>
    </div>

    {/* ── Tab Navigation ── */}
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabDefs.map(tab => <button key={tab.key} onClick={() => {
        setActiveTab(tab.key);
        setSelectedDateFilter(null);
      }} className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              whitespace-nowrap transition-all duration-300 border
              ${activeTab === tab.key && !selectedDateFilter ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-card text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground hover:border-border"}
            `}>
        {tab.icon}
        {tab.label}
        {eventsByCategory[tab.key].length > 0 && <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === tab.key && !selectedDateFilter ? "bg-white/20 text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}>
          {eventsByCategory[tab.key].length}
        </span>}
      </button>)}
      {selectedDateFilter && (
        <button onClick={() => setSelectedDateFilter(null)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border bg-primary text-white border-primary shadow-md shadow-primary/20">
          <CalendarIcon className="w-4 h-4" />
          {selectedDateFilter.toLocaleDateString()}
          <span className="ml-1 text-xs">✕</span>
        </button>
      )}
    </div>

    {/* ── Content Grid ── */}
    {loading ? (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading events...</span>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div key={selectedDateFilter ? "date-filter" : activeTab} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {selectedDateFilter && (
              <div className="text-sm text-muted-foreground mb-2">
                Showing events on <span className="font-semibold text-foreground">{selectedDateFilter.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            )}
            {currentEvents.length > 0
              ? currentEvents.map(event => <EventCard key={event._id} event={event} isFlagship={event.category === "flagship"} />)
              : <EmptyState category={selectedDateFilter ? "matching" : activeTab} />}
          </div>
        </div>

        {/* ── Calendar Sidebar ── */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} className="rounded-md border-border/50" modifiers={{
                event: eventDates
              }} modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary)/0.2)",
                  color: "hsl(var(--primary))"
                }
              }} />
            </CardContent>
            <div className="bg-card/50 p-4 border-t border-border/50 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
                <span className="text-muted-foreground">Event Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground border border-foreground"></div>
                <span className="text-muted-foreground">Selected Date</span>
              </div>
              {selectedDateFilter && (
                <Button variant="ghost" size="sm" className="mt-3 w-full text-xs" onClick={() => setSelectedDateFilter(null)}>
                  Clear date filter
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    )}
  </div>;
}