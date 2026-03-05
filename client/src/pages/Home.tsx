import { Button } from "@/components/ui/button";
import { Code, Trophy, Users, Terminal, BookOpen, Target } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo & College Branding */}
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full w-3/4 h-3/4 m-auto -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <img
            src="/dsac-logo.png"
            alt="DSaC Logo"
            className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_20px_50px_rgba(198,167,94,0.2)] mb-6"
          />
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-primary font-semibold">
            Vasavi College Of Engineering
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
            Data Structures &amp; Algorithms Club
          </h1>

          <p className="text-xl md:text-2xl font-medium text-primary/80 italic">
            Learn. Build. Elevate.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mt-2">
            Your gateway to mastering problem-solving, collaborative coding, and building a strong technical mindset.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
            <Link href="/about">
              <Button size="lg" className="bg-primary hover:bg-secondary text-white rounded-full px-8 h-14 text-base shadow-[0_4px_20px_rgba(198,167,94,0.3)] hover:shadow-[0_8px_30px_rgba(168,137,61,0.4)] transition-all">
                Learn More
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card rounded-3xl px-8 md:px-16 my-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-background/50 to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">About DSaC</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg text-left md:text-center">
            <p>
              DSaC is a student-led technical club of passionate learners, developers, and problem-solvers united by a shared love for technology. We are dedicated to strengthening problem-solving skills and fostering a strong coding culture within our college.
            </p>
            <p>
              Our mission is to nurture curiosity, encourage collaboration, and help students develop strong analytical and technical abilities. Through peer learning, mentorship, and hands-on practice, we create a supportive space where students can explore technology beyond academics and continuously grow.
            </p>
            <p className="font-serif text-2xl text-secondary mt-8 italic">
              "DSaC is more than a club — it's a community that believes in learning together, building confidence, and developing the mindset needed to thrive in the evolving world of technology."
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Join Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Elevate your technical journey with our structured approach to learning and building.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Terminal className="w-8 h-8 text-primary" />,
              title: "Daily Challenges",
              desc: "Sharpen your logical thinking with our hand-picked daily coding questions."
            },
            {
              icon: <Trophy className="w-8 h-8 text-primary" />,
              title: "Competitive Contests",
              desc: "Participate in regular coding contests, climb the leaderboard, and win rewards."
            },
            {
              icon: <Target className="w-8 h-8 text-primary" />,
              title: "Skill Quests",
              desc: "Complete curated paths designed to take you from beginner to advanced in various tech stacks."
            },
            {
              icon: <Users className="w-8 h-8 text-primary" />,
              title: "Peer Mentorship",
              desc: "Learn from experienced seniors and collaborate with peers on real-world projects."
            },
            {
              icon: <Code className="w-8 h-8 text-primary" />,
              title: "Hands-on Workshops",
              desc: "Attend sessions on Web Development, AI/ML, Cloud, and competitive programming."
            },
            {
              icon: <BookOpen className="w-8 h-8 text-primary" />,
              title: "Resource Library",
              desc: "Access a curated collection of roadmaps, tutorials, and cheat sheets."
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
