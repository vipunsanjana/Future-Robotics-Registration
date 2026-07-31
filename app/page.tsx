import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Cpu,
  Code,
  ShieldCheck,
  BrainCircuit,
  Wrench,
  Radio,
  Boxes,
  PlayCircle,
  Rocket, 
  GraduationCap,
  ArrowRight,
  Clock,
} from "lucide-react";

function getCourseIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("robot")) return Bot;
  if (n.includes("arduino") || n.includes("esp")) return Radio;
  if (n.includes("plc") || n.includes("automation")) return Wrench;
  if (n.includes("python") || n.includes("java") || n.includes("c++")) return Code;
  if (n.includes("cyber") || n.includes("hack")) return ShieldCheck;
  if (n.includes("ai") || n.includes("ml") || n.includes("vision")) return BrainCircuit;
  if (n.includes("solidworks") || n.includes("qa") || n.includes("quality")) return Boxes;
  return Cpu;
}

const features = [
  {
    icon: GraduationCap,
    title: "Live Courses",
    desc: "Join interactive live sessions with 80% attendance tracking, assignments, and a final project.",
  },
  {
    icon: PlayCircle,
    title: "Recording Courses",
    desc: "Learn at your own pace with full access to recorded lectures and downloadable materials.",
  },
  {
    icon: Bot,
    title: "Real Robotics",
    desc: "Build real robots. From sensors and motors to programming and automation systems.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Completion",
    desc: "Earn a recognized certificate upon successful completion of all course requirements.",
  },
];

const courses = [
  // Diploma Courses
  { name: "Diploma in Robotics & IoT", mode: "Online", duration: "03 Months" },
  { name: "Diploma in Python & Computer Vision", mode: "Online", duration: "03 Months" },
  { name: "Diploma in Full Stack Web Development", mode: "Online", duration: "03 Months" },

  // Certificate Courses
  { name: "Arduino Basics to Advanced", mode: "Online", duration: "06 Months" },
  { name: "Advanced Solidworks", mode: "Online", duration: "06 Months" },
  { name: "Python", mode: "Online", duration: "06 Months" },
  { name: "Java", mode: "Online", duration: "06 Months" },
  { name: "C++", mode: "Online", duration: "06 Months" },
  { name: "Cybersecurity & Ethical Hacking", mode: "Online", duration: "06 Months" },
  { name: "AI & ML", mode: "Online", duration: "06 Months" },
  { name: "ESP32 Arduino & IoT", mode: "Online", duration: "06 Months" },
  { name: "Industrial PLC", mode: "Online", duration: "06 Months" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground">
              <img
                src="/Logo.jpeg"
                alt="Future Robotics Academy Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tight">Future Robotics Academy</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/#courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button size="sm">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-up">
              <Rocket className="mr-1 h-3 w-3" /> Next cohort enrolling now
            </Badge>
            <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight md:text-6xl" style={{ animationDelay: "0.05s" }}>
              Build the future with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">robotics</span>
            </h1>
            <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: "0.1s" }}>
              Future Robotics Academy offers live and recorded robotics courses designed to take you from
              beginner to builder. Register online, get your payment receipt instantly, and join the next generation of engineers.
            </p>
            <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.15s" }}>
              <Link href="/login">
                <Button size="lg" className="glow">
                  Register for a Course <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#courses">
                <Button size="lg" variant="outline">Explore Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why learn with us?</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to go from curiosity to competence in robotics.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/60 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Popular Courses</h2>
            <p className="mt-4 text-muted-foreground">
              Hands-on diploma and certificate programs in Robotics, AI, and IT.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => {
              const Icon = getCourseIcon(c.name);
              return (
                <Card
                  key={c.name}
                  className="group flex flex-col overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-36 bg-gradient-to-br from-primary/25 via-primary/10 to-accent/25">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-14 w-14 text-primary/50 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-2 pt-5">
                    <h3 className="font-semibold leading-snug">{c.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{c.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">About Future Robotics</h2>
            <p className="mt-6 text-muted-foreground">
              Future Robotics (PVT) LTD is dedicated to making robotics education accessible and practical.
              Our courses combine live instruction with hands-on projects so students gain real engineering skills.
            </p>
            <ul className="mt-6 space-y-3">
              {["80% attendance policy", "Final exam & project", "Monthly fee within the 1st week", "Instant PDF registration receipt"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">1.2k+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground">
                <img
                  src="/Logo.jpeg"
                  alt="Future Robotics Academy Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-semibold">Future Robotics Academy</span>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>futureroboticsacademy@gmail.com | +94 760944206</p>
              <p className="mt-1">
                <a href="https://www.futureroboticsacademy.com">www.futureroboticsacademy.com</a>
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Future Robotics (PVT) LTD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
