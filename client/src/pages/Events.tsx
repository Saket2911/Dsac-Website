import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, Users, ExternalLink, Trophy, Sparkles, Play, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

type EventCategory = "flagship" | "ongoing" | "upcoming" | "past";

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  attendees: number;
  description: string;
  isRegistered?: boolean;
}

const tabs: { key: EventCategory; label: string; icon: React.ReactNode }[] = [
  { key: "flagship", label: "Flagship", icon: <Trophy className="w-4 h-4" /> },
  { key: "ongoing", label: "Ongoing", icon: <Play className="w-4 h-4" /> },
  { key: "upcoming", label: "Upcoming", icon: <CalendarIcon className="w-4 h-4" /> },
  { key: "past", label: "Past", icon: <History className="w-4 h-4" /> },
];

const eventsByCategory: Record<EventCategory, EventItem[]> = {
  flagship: [
    {
      id: 101,
      title: "Codezee – The Ultimate Coding Challenge",
      date: "Mar 22, 2026",
      time: "10:00 AM - 5:00 PM",
      location: "Main Auditorium",
      type: "Flagship Event",
      attendees: 200,
      description:
        "Codezee is DSAC's flagship coding competition exclusively for second-year students. It provides a platform to test and strengthen their understanding of data structures, algorithms, and problem-solving skills. With thoughtfully curated challenges, Codezee encourages logical thinking, time management, and competitive spirit. The event helps students gain confidence and prepares them for advanced coding contests, internships, and placements.",
    },
    {
      id: 102,
      title: "Tech Savishkaar – National Level Hackathon",
      date: "Apr 12, 2026",
      time: "9:00 AM - 9:00 PM",
      location: "Innovation Hub / Virtual",
      type: "National Level",
      attendees: 500,
      description:
        "Tech Savishkaar is DSAC's premier national-level hackathon that brings together innovative minds from across the country. Participants collaborate in teams to build impactful solutions to real-world problems within a limited timeframe. The event promotes creativity, teamwork, and rapid problem-solving, while providing exposure to mentorship, industry insights, and competitive innovation.",
    },
  ],
  ongoing: [],
  upcoming: [
    {
      id: 1,
      title: "Intro to System Design",
      date: "Oct 15, 2023",
      time: "4:00 PM - 6:00 PM",
      location: "Seminar Hall B / Virtual",
      type: "Workshop",
      attendees: 85,
      description: "Learn the fundamentals of designing scalable, distributed systems from industry experts.",
      isRegistered: false,
    },
    {
      id: 2,
      title: "Hackathon Prep Session",
      date: "Oct 18, 2023",
      time: "5:30 PM - 7:30 PM",
      location: "Lab 304",
      type: "Meetup",
      attendees: 42,
      description: "Brainstorming and team formation for the upcoming state-level hackathon.",
      isRegistered: true,
    },
    {
      id: 3,
      title: "Alumni AMA: Landing FAANG Internships",
      date: "Oct 22, 2023",
      time: "7:00 PM - 8:30 PM",
      location: "Virtual (Zoom)",
      type: "Talk",
      attendees: 156,
      description: "Q&A session with recent graduates who secured internships at top tech companies.",
      isRegistered: false,
    },
  ],
  past: [],
};

const getBadgeStyle = (type: string) => {
  switch (type) {
    case "Flagship Event":
      return "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 rounded-lg";
    case "National Level":
      return "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-50 rounded-lg";
    default:
      return "bg-primary/10 text-primary rounded-lg";
  }
};

const getBadgeIcon = (type: string) => {
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
function EventCard({ event, isFlagship }: { event: EventItem; isFlagship?: boolean }) {
  return (
    <Card
      className={`border-border/30 transition-all duration-300 rounded-2xl bg-white card-shadow ${isFlagship
        ? "hover:shadow-lg hover:border-primary/20"
        : "hover:shadow-md"
        }`}
    >
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Date Column */}
        <div
          className={`md:border-r border-b md:border-b-0 border-border/30 p-6 flex md:flex-col items-center justify-center gap-2 md:gap-0 md:min-w-[140px] shrink-0 rounded-l-2xl ${isFlagship
            ? "bg-gradient-to-b from-amber-50 to-white"
            : "bg-muted/30"
            }`}
        >
          <span
            className={`text-sm font-bold uppercase ${isFlagship
              ? "text-amber-600"
              : "text-primary"
              }`}
          >
            {event.date.split(",")[0].split(" ")[0]}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-foreground">
            {event.date.split(",")[0].split(" ")[1]}
          </span>
        </div>

        {/* Content Column */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            {isFlagship ? (
              <Badge className={`${getBadgeStyle(event.type)} mb-2 flex items-center`}>
                {getBadgeIcon(event.type)}
                {event.type}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-primary/10 text-primary mb-2 rounded-lg">
                {event.type}
              </Badge>
            )}
            {event.isRegistered && (
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 rounded-lg">
                Registered
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-1">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium text-foreground/80 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />{" "}
              {isFlagship ? `${event.attendees}+ Expected` : `${event.attendees} Attending`}
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            {isFlagship ? (
              <Button className="gradient-blue text-white rounded-xl shadow-sm hover:shadow-md transition-all">Learn More</Button>
            ) : (
              <Button
                variant={event.isRegistered ? "outline" : "default"}
                className={`rounded-xl transition-all ${!event.isRegistered ? "gradient-blue text-white shadow-sm hover:shadow-md" : "hover:border-primary/40"}`}
              >
                {event.isRegistered ? "Cancel RSVP" : "RSVP Now"}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="border border-border/50 rounded-xl hover:border-primary/30 hover:text-primary">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Empty State ── */
function EmptyState({ category }: { category: string }) {
  return (
    <Card className="border-border/30 border-dashed shadow-none rounded-2xl bg-white">
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
          {category === "ongoing" ? (
            <Play className="w-6 h-6 text-muted-foreground" />
          ) : (
            <History className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          No {category} events
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          {category === "ongoing"
            ? "There are no events currently in progress. Check back soon!"
            : "Past events will appear here once they've concluded."}
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Main Component ── */
export default function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<EventCategory>("flagship");

  const currentEvents = eventsByCategory[activeTab];

  return (
    <div className="pt-6 pb-10 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Club Events</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Workshops, meetups, and talks to accelerate your learning.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              whitespace-nowrap transition-all duration-300 border
              ${activeTab === tab.key
                ? "gradient-blue text-white border-primary shadow-md shadow-primary/20"
                : "bg-white text-muted-foreground border-border/50 hover:bg-muted/30 hover:text-foreground hover:border-border card-shadow"
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {eventsByCategory[tab.key].length > 0 && (
              <span
                className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
                  }`}
              >
                {eventsByCategory[tab.key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            key={activeTab}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFlagship={activeTab === "flagship"}
                />
              ))
            ) : (
              <EmptyState category={activeTab} />
            )}
          </div>
        </div>

        {/* ── Calendar Sidebar ── */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/30 card-shadow sticky top-24 rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="font-bold">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border-border/30"
                modifiers={{
                  event: [new Date(2023, 9, 15), new Date(2023, 9, 18), new Date(2023, 9, 22)],
                }}
                modifiersStyles={{
                  event: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary)/0.15)",
                    color: "hsl(var(--primary))",
                    borderRadius: "8px",
                  },
                }}
              />
            </CardContent>
            <div className="bg-muted/30 p-4 border-t border-border/30 text-sm rounded-b-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
                <span className="text-muted-foreground">Event Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground border border-foreground"></div>
                <span className="text-muted-foreground">Selected Date</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
