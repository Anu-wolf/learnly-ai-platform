"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Rocket, BookOpen, Youtube, Cpu, 
  Layers, LayoutDashboard, Brain, 
  Gamepad2, Leaf, Clock, ArrowRight,
  ExternalLink, CheckCircle2, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"

interface LessonData {
  lesson_dashboard: {
    title: string;
    intro_message: string;
    motivation_line: string;
  };
  learning_path: Array<{
    level: string;
    topics: string[];
    estimated_time: string;
  }>;
  resources: {
    courses: Array<{ title: string; platform: string; link: string; level: string; why_recommended: string }>;
    youtube_videos: Array<{ title: string; channel: string; link: string; duration: string; focus_area: string }>;
    interactive_tools: Array<{ name: string; type: string; link: string; purpose: string }>;
    flashcards: Array<{ topic: string; cards: Array<{ q: string; a: string }> }>;
    practice_platforms: Array<{ name: string; link: string; difficulty: string; use_case: string }>;
    projects: Array<{ title: string; description: string; difficulty: string; tools_required: string[] }>;
  };
  gamification: {
    mini_task: string;
    challenge: string;
    reward: string;
  };
  wellness_support: {
    trigger_condition: string;
    activity: string;
    duration: string;
  };
}

export default function LessonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const topic = params.topic as string
        const performance = searchParams.get("performance") || "MEDIUM"
        const stress = searchParams.get("stress") || "LOW"
        const weak = searchParams.get("weak")?.split(",") || []
        const strong = searchParams.get("strong")?.split(",") || []

        const res = await fetch("/api/generate-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            topic: topic.replace("-", " "), 
            performance, 
            stress, 
            weakAreas: weak, 
            strongAreas: strong 
          }),
        })

        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [params.topic, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Rocket className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Orchestrating Your Perfect Lesson...</h2>
          <p className="text-muted-foreground">Curating top resources and mapping your personalized path.</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              You’re Ready to Start 🚀
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {data.lesson_dashboard.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {data.lesson_dashboard.intro_message}
            </p>
            <div className="flex items-center gap-3 p-4 bg-card border rounded-xl shadow-sm border-primary/20">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium italic text-primary/80">
                "{data.lesson_dashboard.motivation_line}"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Learning Track */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Learning Path Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Your Learning Timeline</h2>
            </div>
            <div className="space-y-4">
              {data.learning_path.map((path, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8 border-l-2 border-primary/20 last:border-0 pb-8 last:pb-0"
                >
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary" />
                  <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="mb-1">{path.level}</Badge>
                          <CardTitle className="text-lg">{path.topics.join(", ")}</CardTitle>
                        </div>
                        <Badge className="bg-secondary/20 text-secondary border-none">{path.estimated_time}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Curated Resources</h2>
            </div>
            
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="interactive">Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.resources.courses.map((course, i) => (
                  <Card key={i} className="group hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="secondary" className="text-[10px]">{course.platform}</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">{course.level}</Badge>
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-4">{course.why_recommended}</p>
                      <Button asChild variant="ghost" size="sm" className="w-full justify-between h-8 bg-primary/5 hover:bg-primary/10">
                        <a href={course.link} target="_blank" rel="noopener noreferrer">
                          Start Learning <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="videos" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.resources.youtube_videos.map((vid, i) => (
                  <Card key={i} className="overflow-hidden group">
                    <div className="aspect-video bg-muted flex items-center justify-center relative group-hover:bg-muted/80 transition-colors">
                      <Youtube className="h-10 w-10 text-red-600 group-hover:scale-110 transition-transform" />
                      <Badge className="absolute bottom-2 right-2 bg-black/80 text-white border-none">{vid.duration}</Badge>
                    </div>
                    <CardHeader className="p-3">
                      <p className="text-[10px] text-primary uppercase font-bold">{vid.channel}</p>
                      <CardTitle className="text-sm leading-tight line-clamp-2">{vid.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <Button asChild variant="secondary" size="sm" className="w-full h-8">
                        <a href={vid.link} target="_blank" rel="noopener noreferrer">Watch Video</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="interactive" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.resources.interactive_tools.map((tool, i) => (
                  <Card key={i} className="border-dashed hover:border-primary/50 transition-all border-2">
                    <CardHeader className="pb-2">
                      <Badge className="w-fit">{tool.type}</Badge>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-4">{tool.purpose}</p>
                      <Button asChild size="sm" className="w-full">
                        <a href={tool.link} target="_blank" rel="noopener noreferrer">Launch Tool</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Hands-on Projects</h2>
            </div>
            <div className="space-y-4">
              {data.resources.projects.map((proj, i) => (
                <Card key={i} className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{proj.title}</CardTitle>
                      <Badge variant="outline">{proj.difficulty}</Badge>
                    </div>
                    <CardDescription>{proj.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {proj.tools_required.map((tool, j) => (
                        <Badge key={j} className="bg-background text-foreground hover:bg-background/80">{tool}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar - Gamification & Wellness */}
        <div className="space-y-8">
          
          {/* Gamification Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Gamepad2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider">Mini Challenge</span>
              </div>
              <CardTitle className="text-2xl">Earn 50 XP 💎</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm font-medium mb-1">Your Mission:</p>
                <p className="text-lg font-bold leading-tight">{data.gamification.challenge}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm font-medium mb-1">Quick Task (3m):</p>
                <p className="text-base text-white/90">{data.gamification.mini_task}</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-secondary/50">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <p className="text-sm font-bold">Level Reward: {data.gamification.reward}</p>
              </div>
              <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold">
                I'm Game! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Wellness Support */}
          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-secondary">
                <Leaf className="h-5 w-5" />
                <CardTitle className="text-base">Stress Awareness</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Because {data.wellness_support.trigger_condition.toLowerCase().includes('stress') ? 'you reported higher stress' : 'balance is key'}:
              </p>
              <Card className="border-none bg-background/50 shadow-none">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-secondary">{data.wellness_support.activity}</CardTitle>
                  <p className="text-sm font-bold opacity-70">Duration: {data.wellness_support.duration}</p>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>

          {/* Flashcard Preview */}
          <Card className="hover:scale-[1.02] transition-transform cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Flashcards Ready</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.resources.flashcards.length} Sets</div>
              <p className="text-xs text-muted-foreground mt-1">Study {data.resources.flashcards[0]?.topic} basics</p>
              <Button variant="outline" size="sm" className="w-full mt-4 group">
                Open Flashcards <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}
