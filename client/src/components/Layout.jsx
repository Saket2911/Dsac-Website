import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, Trophy, Code, Target, Calendar, FolderOpen, LayoutDashboard, Info, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "../hooks/useAuth";
import API_BASE from "../config/api.js";
export function Layout({
  children
}) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    isAuthenticated,
    logout,
    user
  } = useAuth();
  const profileImageUrl = user?.profileImage ? user.profileImage : null;
  const navLinks = [{
    name: "Home",
    path: "/"
  }, {
    name: "About",
    path: "/about",
    icon: <Info className="w-4 h-4 mr-2" />
  }, {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4 mr-2" />
  }, {
    name: "Daily",
    path: "/daily",
    icon: <Code className="w-4 h-4 mr-2" />
  }, {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: <Trophy className="w-4 h-4 mr-2" />
  }, {
    name: "Contests",
    path: "/contests",
    icon: <Trophy className="w-4 h-4 mr-2" />
  }, {
    name: "Quests",
    path: "/quests",
    icon: <Target className="w-4 h-4 mr-2" />
  }, {
    name: "Events",
    path: "/events",
    icon: <Calendar className="w-4 h-4 mr-2" />
  }, {
    name: "Resources",
    path: "/resources",
    icon: <FolderOpen className="w-4 h-4 mr-2" />
  }];
  return <div className="min-h-screen flex flex-col bg-background text-foreground">
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          {/* <a> */}
          <img src="/dsac-logo.png" alt="DSaC Logo" className="h-12 w-12 object-contain" />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary leading-none">DSaC</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">Data Structures and Algorithms Club</span>
          </div>
          {/* </a> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(link => <Link key={link.path} href={link.path}>
            <a className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${location === link.path ? "text-primary border-b-2 border-primary py-1" : "text-foreground/70"}`}>
              {link.name}
            </a>
          </Link>)}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 p-0 overflow-hidden">
                {profileImageUrl ? (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profileImageUrl} alt={user?.name} />
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <DropdownMenuItem className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/profile">
            <Button className="bg-primary hover:bg-secondary text-primary-foreground font-medium px-6 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(198,167,94,0.3)] hover:shadow-[0_6px_20px_rgba(168,137,61,0.4)]">
              Profile
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-foreground/70" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && <div className="lg:hidden border-t border-border bg-background py-4 px-4 shadow-lg absolute w-full left-0 max-h-[80vh] overflow-y-auto">
        <nav className="flex flex-col gap-2">
          {navLinks.map(link => <Link key={link.path} href={link.path}>
            <a onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium px-4 py-3 rounded-lg transition-colors flex items-center ${location === link.path ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-card hover:text-foreground"}`}>
              {link.icon} {link.name}
            </a>
          </Link>)}
          <div className="h-px bg-border my-2 w-full"></div>
          <Link href="/profile">
            <a onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium px-4 py-3 rounded-lg transition-colors flex items-center ${location === "/profile" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-card hover:text-foreground"}`}>
              <User className="w-4 h-4 mr-2" /> Profile
            </a>
          </Link>
          <Link href="/profile">
            <Button className="bg-primary w-full text-primary-foreground mt-2" onClick={() => setIsMobileMenuOpen(false)}>Profile</Button>
          </Link>
          {isAuthenticated && <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 mt-1 gap-2" onClick={() => {
            logout();
            setIsMobileMenuOpen(false);
          }}>
            <LogOut className="w-4 h-4" /> Log out
          </Button>}
        </nav>
      </div>}
    </header>

    <main className="flex-1 w-full max-w-7xl mx-auto px-4">
      {children}
    </main>

    <footer className="border-t border-border mt-auto bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/dsac-logo.png" alt="DSaC Logo" className="h-10 w-10 opacity-80" />
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} DSaC. Empowering students through technology.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>;
}