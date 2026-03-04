import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Trophy, Users, Terminal, BookOpen, Target, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section */}
      <section className="py-16 md:py-28 flex flex-col-reverse md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex-1 flex flex-col items-start gap-6 text-center md:text-left">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/15">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to the new platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground">
            Learn. Build. <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Elevate.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The Data Structures and Algorithms Club (DSAC) is your gateway to mastering problem-solving, collaborative coding, and building a strong technical mindset.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Button size="lg" className="gradient-blue text-white rounded-xl px-8 h-14 text-base font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.45)] transition-all hover:scale-[1.02]">
              Join the Community
            </Button>
            <Link href="/events">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-base border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-blue-400/10 to-transparent blur-3xl rounded-full w-3/4 h-3/4 m-auto -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <img
            src="/dsac-logo.png"
            alt="DSaC Large Logo"
            className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white rounded-2xl px-8 md:px-16 my-10 relative overflow-hidden card-shadow">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">About DSAC</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg text-left md:text-center">
            <p>
              DSAC is a student-led technical club of passionate learners, developers, and problem-solvers united by a shared love for technology. We are dedicated to strengthening problem-solving skills and fostering a strong coding culture within our college.
            </p>
            <p>
              Our mission is to nurture curiosity, encourage collaboration, and help students develop strong analytical and technical abilities. Through peer learning, mentorship, and hands-on practice, we create a supportive space where students can explore technology beyond academics and continuously grow.
            </p>
            <p className="text-xl text-primary/80 mt-8 italic font-medium">
              "DSAC is more than a club — it's a community that believes in learning together, building confidence, and developing the mindset needed to thrive in the evolving world of technology."
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Join Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Elevate your technical journey with our structured approach to learning and building.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Terminal className="w-7 h-7 text-primary" />,
              title: "Daily Challenges",
              desc: "Sharpen your logical thinking with our hand-picked daily coding questions.",
              gradient: "from-blue-500/10 to-blue-600/5"
            },
            {
              icon: <Trophy className="w-7 h-7 text-primary" />,
              title: "Competitive Contests",
              desc: "Participate in regular coding contests, climb the leaderboard, and win rewards.",
              gradient: "from-indigo-500/10 to-indigo-600/5"
            },
            {
              icon: <Target className="w-7 h-7 text-primary" />,
              title: "Skill Quests",
              desc: "Complete curated paths designed to take you from beginner to advanced in various tech stacks.",
              gradient: "from-cyan-500/10 to-cyan-600/5"
            },
            {
              icon: <Users className="w-7 h-7 text-primary" />,
              title: "Peer Mentorship",
              desc: "Learn from experienced seniors and collaborate with peers on real-world projects.",
              gradient: "from-sky-500/10 to-sky-600/5"
            },
            {
              icon: <Code className="w-7 h-7 text-primary" />,
              title: "Hands-on Workshops",
              desc: "Attend sessions on Web Development, AI/ML, Cloud, and competitive programming.",
              gradient: "from-violet-500/10 to-violet-600/5"
            },
            {
              icon: <BookOpen className="w-7 h-7 text-primary" />,
              title: "Resource Library",
              desc: "Access a curated collection of roadmaps, tutorials, and cheat sheets.",
              gradient: "from-blue-500/10 to-indigo-600/5"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-border/50 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group card-shadow"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-blue rounded-2xl px-8 text-center text-white relative overflow-hidden mt-10 card-shadow-lg">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Join 500+ Active Members</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to start your journey?</h2>
          <p className="text-lg md:text-xl text-white/75 mb-10">
            Join hundreds of other students who are building the future together at DSAC.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl px-10 h-14 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            Become a Member <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
