import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Trophy,
  Users,
  Target,
  BookOpen,
  Terminal,
  Calendar,
  GitBranch,
  MessageCircle,
  Mail,
  Heart,
  Lightbulb,
  GraduationCap,
  Rocket,
  Monitor,
  Globe,
  CheckCircle,
  ArrowRight,
  User,
  Sparkles,
  Handshake,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─── data ─── */
const activities = [
  { icon: <Terminal className="w-6 h-6" />, title: "Weekly DSA Practice", desc: "Structured sessions to sharpen problem-solving skills every week." },
  { icon: <Trophy className="w-6 h-6" />, title: "Hackathons & Contests", desc: "Compete in coding competitions and hackathons to test your skills." },
  { icon: <Code className="w-6 h-6" />, title: "Technical Workshops", desc: "Hands-on workshops covering C, C++, Python, and Web Development." },
  { icon: <Rocket className="w-6 h-6" />, title: "Project Building Sprints", desc: "Collaborate on full-stack projects in intensive build sprints." },
  { icon: <Users className="w-6 h-6" />, title: "Peer Mentorship", desc: "Learn from experienced peers in a supportive mentorship model." },
  { icon: <BookOpen className="w-6 h-6" />, title: "Learning Resources", desc: "Curated roadmaps, tutorials, and cheat sheets for every level." },
];

const technologies = [
  { label: "C / C++", icon: <Terminal className="w-4 h-4" /> },
  { label: "Python", icon: <Code className="w-4 h-4" /> },
  { label: "Data Structures & Algorithms", icon: <Brain className="w-4 h-4" /> },
  { label: "React", icon: <Monitor className="w-4 h-4" /> },
  { label: "Node.js", icon: <Globe className="w-4 h-4" /> },
  { label: "Git & GitHub", icon: <GitBranch className="w-4 h-4" /> },
];

const meetingFormats = [
  { icon: <Calendar className="w-5 h-5 text-primary" />, text: "Weekly offline meetups" },
  { icon: <Monitor className="w-5 h-5 text-primary" />, text: "Online problem-solving sessions" },
  { icon: <MessageCircle className="w-5 h-5 text-primary" />, text: "Collaborative coding discussions" },
];

const achievements = [
  { icon: <Trophy className="w-7 h-7 text-primary" />, title: "Competitive Coding", desc: "Members participated in national and international competitive coding contests." },
  { icon: <Rocket className="w-7 h-7 text-primary" />, title: "Project Builds", desc: "Internal project builds including full-stack applications and open-source tools." },
  { icon: <GitBranch className="w-7 h-7 text-primary" />, title: "GitHub Culture", desc: "Active GitHub collaboration culture with real-world contribution practices." },
  { icon: <Handshake className="w-7 h-7 text-primary" />, title: "Peer Mentorship", desc: "Strong peer mentorship model bridging the gap between juniors and seniors." },
];

const teamMembers = [
  { role: "President", name: "To Be Announced" },
  { role: "Vice President", name: "To Be Announced" },
  { role: "Technical Lead", name: "To Be Announced" },
  { role: "Event Coordinator", name: "To Be Announced" },
  { role: "Faculty Advisor", name: "To Be Announced" },
];

const values = [
  { icon: <Heart className="w-5 h-5 text-primary" />, text: "Inclusive environment for all branches" },
  { icon: <Users className="w-5 h-5 text-primary" />, text: "Collaborative learning culture" },
  { icon: <Target className="w-5 h-5 text-primary" />, text: "Focus on consistency and discipline" },
  { icon: <Sparkles className="w-5 h-5 text-primary" />, text: "Encouraging beginners to take the first step" },
];

/* ─── component ─── */
export default function AboutDSAC() {
  return (
    <div className="flex flex-col pb-20">
      {/* ── Hero Header ── */}
      <section className="py-16 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          About the Club
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground mb-6">
          About <span className="text-primary italic">DSAC</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Data Structures and Algorithms Club — a student-led technical community founded in 2024, united by a shared love for technology and problem-solving.
        </p>
      </section>

      {/* ── Club Overview ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 bg-card rounded-3xl px-8 md:px-16 my-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-background/50 to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center">
            Who We Are
          </motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6 text-muted-foreground leading-relaxed text-lg text-left md:text-center">
            <p>
              DSAC (Data Structures and Algorithms Club) is a student-led technical club founded in 2024. It is a community of passionate learners, developers, and problem-solvers united by a shared love for technology. DSAC focuses on strengthening problem-solving skills and fostering a strong coding culture within the college.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Mission ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 my-6"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div variants={fadeUp} custom={0} className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lightbulb className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground">
            Our Mission
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Making coding accessible to all students while nurturing curiosity, encouraging collaboration, and helping students develop strong analytical and technical abilities. Through peer learning, mentorship, and hands-on practice, we create a supportive space where students explore technology beyond academics and continuously grow.
          </motion.p>
          <motion.p variants={fadeUp} custom={3} className="font-serif text-2xl text-secondary mt-8 italic max-w-3xl mx-auto">
            "DSAC is more than a club — it's a community that believes in learning together, building confidence, and developing the mindset needed to thrive in the evolving world of technology."
          </motion.p>
        </div>
      </motion.section>

      {/* ── Affiliation ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        custom={0}
        className="bg-card rounded-3xl px-8 md:px-16 py-10 my-6 flex flex-col md:flex-row items-center gap-6"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Affiliation</h3>
          <p className="text-muted-foreground text-lg">
            Proudly affiliated with <span className="text-foreground font-semibold">Vasavi College of Engineering</span>, Hyderabad.
          </p>
        </div>
      </motion.section>

      {/* ── Activities ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 my-6"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Do</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From weekly practice to hackathons, here's how we keep the momentum going.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((a, idx) => (
            <motion.div key={idx} variants={fadeUp} custom={idx + 1}>
              <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {a.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{a.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Technologies ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 bg-card rounded-3xl px-8 md:px-16 my-6"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          Technologies We Focus On
        </motion.h2>
        <motion.div variants={fadeUp} custom={1} className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {technologies.map((t, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="bg-background border border-border/50 text-foreground px-5 py-3 text-base font-medium rounded-full flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-default"
            >
              {t.icon} {t.label}
            </Badge>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Meeting Format ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 my-6"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          How We Meet
        </motion.h2>
        <motion.div variants={fadeUp} custom={1} className="max-w-2xl mx-auto">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-8 space-y-6">
              {meetingFormats.map((m, idx) => (
                <div key={idx} className="flex items-center gap-4 text-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {m.icon}
                  </div>
                  <span className="text-foreground font-medium">{m.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* ── Achievements ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 my-6"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Achievements & Highlights</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What our community has accomplished so far.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {achievements.map((a, idx) => (
            <motion.div key={idx} variants={fadeUp} custom={idx + 1}>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                <CardContent className="p-8 flex gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {a.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{a.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Team / Leadership ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 bg-card rounded-3xl px-8 md:px-16 my-6"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The people who keep the community thriving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, idx) => (
            <motion.div key={idx} variants={fadeUp} custom={idx + 1} className="flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-full bg-background border-2 border-border/50 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
                <User className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">{member.name}</h3>
              <span className="text-sm font-medium text-primary">{member.role}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Community & Values ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 my-6"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {values.map((v, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx + 1}
              className="flex items-center gap-4 bg-card/50 border border-border/50 rounded-2xl p-6 hover:bg-card hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {v.icon}
              </div>
              <span className="text-foreground font-medium">{v.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
