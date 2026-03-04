import { Link, useLocation } from "wouter";
import { Menu, X, User, Trophy, Code, Target, Calendar, FolderOpen, LayoutDashboard, Info, Search, Bell, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { name: "About", path: "/about", icon: <Info className="w-5 h-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Daily", path: "/daily", icon: <Code className="w-5 h-5" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy className="w-5 h-5" /> },
    { name: "Contests", path: "/contests", icon: <Trophy className="w-5 h-5" /> },
    { name: "Quests", path: "/quests", icon: <Target className="w-5 h-5" /> },
    { name: "Events", path: "/events", icon: <Calendar className="w-5 h-5" /> },
    { name: "Resources", path: "/resources", icon: <FolderOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 card-shadow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 transition-all hover:opacity-80 group">
              <img src="/dsac-logo.png" alt="DSaC Logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary leading-none tracking-tight">DSAC</span>
                <span className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold hidden sm:block">AI Coding</span>
              </div>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${location === link.path
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground/60 hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:w-56 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg text-foreground/50 hover:text-primary hover:bg-primary/5 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg text-foreground/50 hover:text-primary hover:bg-primary/5 transition-all">
              <Settings className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 ml-2 pl-3 pr-1 py-1 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border">
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-semibold text-foreground leading-none">Alex Rivera</p>
                    <p className="text-[11px] text-primary font-medium">Expert • 2,450 XP</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    A
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-border/50 card-shadow-lg rounded-xl">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer rounded-lg">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer rounded-lg">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive rounded-lg">
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-white py-3 px-4 card-shadow-lg absolute w-full left-0 max-h-[80vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contests, problems, users..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
              />
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <a
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${location === link.path
                        ? "bg-primary text-white shadow-sm"
                        : "text-foreground/60 hover:bg-primary/5 hover:text-primary"
                      }`}
                  >
                    {link.icon} {link.name}
                  </a>
                </Link>
              ))}
              <div className="h-px bg-border/50 my-2 w-full"></div>
              <Link href="/profile">
                <a
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${location === "/profile"
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground/60 hover:bg-primary/5 hover:text-primary"
                    }`}
                >
                  <User className="w-5 h-5" /> Profile
                </a>
              </Link>
              <Button className="bg-primary hover:bg-secondary text-white mt-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                Join Now
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-border/50 mt-auto bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/dsac-logo.png" alt="DSaC Logo" className="h-9 w-9 opacity-80" />
            <p className="text-sm text-muted-foreground font-medium">
              &copy; {new Date().getFullYear()} DSAC. Empowering students through technology.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
