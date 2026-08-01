import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthCta } from "@/components/auth-cta";
import {
  Bot,
  ShieldCheck,
  PlayCircle,
  Rocket,
  GraduationCap,
  Clock,
  Wifi,
} from "lucide-react";

function getCourseImageUrl(name: string) {
  const n = name.toLowerCase();
  if (n.includes("robotics & iot")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("python & computer vision")) {
    return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("web development")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("arduino")) {
    return "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("solidworks")) {
    return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("python")) {
    return "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("java")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("c++")) {
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("cybersecurity")) {
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("ai & ml")) {
    return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("esp32")) {
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("industrial plc")) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80";
  }
  return "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80";
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
    title: "Build Real Systems",
    desc: "From sensors and motors to programming and automation — build projects that actually work.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Completion",
    desc: "Earn a recognized certificate upon successful completion of all course requirements.",
  },
];

const courses = [
  { name: "Diploma in Robotics & IoT", mode: "Online", duration: "06 Months" },
  { name: "Diploma in Python & Computer Vision", mode: "Online", duration: "06 Months" },
  { name: "Diploma in Full Stack Web Development", mode: "Online", duration: "06 Months" },
  { name: "Arduino Basics to Advanced", mode: "Online", duration: "03 Months" },
  { name: "Advanced Solidworks", mode: "Online", duration: "03 Months" },
  { name: "Python", mode: "Online", duration: "03 Months" },
  { name: "Java", mode: "Online", duration: "03 Months" },
  { name: "C++", mode: "Online", duration: "03 Months" },
  { name: "Cybersecurity & Ethical Hacking", mode: "Online", duration: "03 Months" },
  { name: "AI & ML", mode: "Online", duration: "03 Months" },
  { name: "ESP32 Arduino & IoT", mode: "Online", duration: "03 Months" },
  { name: "Industrial PLC", mode: "Online", duration: "03 Months" },
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
            <AuthCta size="sm" loggedOutLabel="Get Started" />
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
              <AuthCta
                size="lg"
                className="glow"
                loggedOutLabel="Registration for a Course"
                loggedInLabel="Go to Dashboard"
              />
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
              const imageUrl = getCourseImageUrl(c.name);
              return (
                <Card
                  key={c.name}
                  className="group flex flex-col overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <Badge variant="secondary" className="absolute top-3 right-3 text-[10px] backdrop-blur-md bg-background/85">
                      <Wifi className="mr-1 h-3 w-3 text-primary" /> {c.mode}
                    </Badge>
                  </div>

                  <CardContent className="flex flex-1 flex-col justify-between gap-3 pt-4">
                    <h3 className="font-semibold leading-snug">{c.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>Duration: {c.duration}</span>
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
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 shadow-sm">
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
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground">
                  <img
                    src="/Logo.jpeg"
                    alt="Future Robotics Academy Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-semibold">Future Robotics Academy</span>
              </Link>
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

      {/* Floating WhatsApp Button */}
      <a  href="https://wa.me/94760944206?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20Future%20Robotics%20Academy%20courses!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  );
}
