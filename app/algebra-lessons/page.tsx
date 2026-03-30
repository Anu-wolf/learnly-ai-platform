"use client"
import { useState } from 'react'
import { 
  Play, 
  ExternalLink, 
  BookOpen, 
  Plus, 
  Minus, 
  HelpCircle,
  Calculator,
  Layout,
  Code,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Globe,
  Star,
  Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const ROADMAP = [
  { 
    level: "Beginner", 
    topics: ["Variables & Expressions", "Linear Equations", "Order of Operations"],
    desc: "The building blocks of algebraic thinking.",
    color: "bg-blue-500" 
  },
  { 
    level: "Intermediate", 
    topics: ["Polynomials", "Factorization", "Systems of Equations"],
    desc: "Solving more complex relationships between variables.",
    color: "bg-purple-500" 
  },
  { 
    level: "Advanced", 
    topics: ["Quadratic Equations", "Matrices", "Complex Numbers"],
    desc: "Mastering high-level abstract mathematical structures.",
    color: "bg-indigo-500" 
  }
]

const YOUTUBE_RESOURCES = [
  { title: "Algebra Basics: What Is Algebra?", channel: "Math Antics", link: "https://www.youtube.com/watch?v=NybHckSEQBI" },
  { title: "Intro to equations", channel: "Khan Academy", link: "https://www.youtube.com/watch?v=l3XzepN03KQ" },
  { title: "Algebra Introduction - Basic Overview", channel: "The Organic Chemistry Tutor", link: "https://www.youtube.com/watch?v=grnP3mduZWM" },
  { title: "Solving Linear Equations - Best Explanation", channel: "Math Antics", link: "https://www.youtube.com/watch?v=l3XzepN03KQ" },
  { title: "Algebra for Beginners Full Course", channel: "freeCodeCamp", link: "https://www.youtube.com/watch?v=grnP3mduZWM" },
  { title: "Factoring Polynomials", channel: "The Organic Chemistry Tutor", link: "https://www.youtube.com/watch?v=HvBiJ9W00Z4" },
  { title: "Quadratic Formula - How to solve", channel: "Brian McLogan", link: "https://www.youtube.com/watch?v=3ayhvAI3IeY" },
  { title: "Systems of Linear Equations", channel: "Math Antics", link: "https://www.youtube.com/watch?v=pok_X6_O1I8" }
]

const COURSES = [
  { title: "Introduction to Algebra", platform: "Khan Academy", instructor: "Sal Khan", link: "https://www.khanacademy.org/math/algebra" },
  { title: "Algebra I & II Comprehensive Course", platform: "Udemy", instructor: "Krista King", link: "https://www.udemy.com/course/algebra-1-2/" },
  { title: "College Algebra: Foundational Study", platform: "Coursera", instructor: "Johns Hopkins", link: "https://www.coursera.org/learn/college-algebra" },
  { title: "Pre-Algebra to Advanced Algebra Mastery", platform: "edX", instructor: "ASU", link: "https://www.edx.org/course/college-algebra-and-problem-solving" },
  { title: "The Joy of Algebra", platform: "Wondrium", instructor: "Professor Sellers", link: "https://www.wondrium.com/the-joy-of-algebra" }
]

const FLASHCARDS = [
  { q: "What is a variable?", a: "A symbol (usually a letter) used to represent an unknown or changing number." },
  { q: "Solve: 2x + 3 = 7", a: "Subtract 3 from both sides: 2x = 4. Divide by 2: x = 2." },
  { q: "What is a polynomial?", a: "An expression consisting of variables and coefficients, that involves only the operations of addition, subtraction, multiplication, and non-negative integer exponents." },
  { q: "What is the Quadratic Formula?", a: "x = [-b ± sqrt(b² - 4ac)] / 2a" },
  { q: "What is a constant?", a: "A fixed value that does not change, unlike a variable." },
  { q: "What is an expression?", a: "A collection of numbers, variables, and operators (like + and -), but WITHOUT an equals sign." },
  { q: "What is an equation?", a: "A mathematical statement that asserts the equality of two expressions using an equals sign (=)." },
  { q: "What are like terms?", a: "Terms that have the same variables raised to the same powers." },
  { q: "What is factoring?", a: "The process of breaking down an expression into a product of simpler expressions." },
  { q: "What is a coefficient?", a: "A number used to multiply a variable (e.g., in 4x, 4 is the coefficient)." }
]

const BLOGS = [
  { title: "Why Algebra is Essential for Life", author: "Math is Fun", link: "https://www.mathsisfun.com/algebra/introduction.html" },
  { title: "Polynomials - Properties and Examples", author: "GeeksforGeeks", link: "https://www.geeksforgeeks.org/polynomials-in-maths/" },
  { title: "Mastering Quadratic Equations", author: "BYJU'S", link: "https://byjus.com/maths/quadratic-equation/" },
  { title: "10 Algebra Tips for Every Student", author: "Math Goodies", link: "https://www.mathgoodies.com/lessons/algebra/tips" },
  { title: "Visualizing Algebra with Geometry", author: "BetterExplained", link: "https://betterexplained.com/articles/visualizing-algebraic-identities/" }
]

const TOOLS = [
  { name: "Desmos Graphing Calculator", desc: "The gold standard for exploring functions and visualizing equations instantly.", link: "https://www.desmos.com/calculator" },
  { name: "Symbolab", desc: "Step-by-step calculator for algebra, calculus, and beyond. Great for checking your work.", link: "https://www.symbolab.com/" },
  { name: "Wolfram Alpha", desc: "A computational intelligence engine that can solve almost any algebraic problem and provide detailed steps.", link: "https://www.wolframalpha.com/" }
]

const QUIZ_QUESTIONS = [
  { q: "Solve for x: x + 5 = 10", options: ["3", "5", "10", "15"], correct: "5" },
  { q: "What is the coefficient in the expression 4y - 7?", options: ["y", "-7", "4", "4y"], correct: "4" },
  { q: "What is the degree of the polynomial 3x² + 5x - 2?", options: ["1", "3", "2", "5"], correct: "2" }
]

const PROJECTS = [
  { title: "Algebra Equation Solver UI", desc: "Build a web-based calculator that specifically handles linear and quadratic solving with clean step-by-step display.", difficulty: "Intermediate" },
  { title: "Linear Grapher Prototype", desc: "Create a simple tool where users enter 'm' and 'c' for y=mx+c and see a live-rendered line on a grid.", difficulty: "Beginner" },
  { title: "Algebra Mystery Quiz App", desc: "Develop a gamified quiz where users solve equations to unlock 'treasure' or character levels.", difficulty: "Beginner" }
]

export default function AlgebraLessons() {
  const [expandedRoadmap, setExpandedRoadmap] = useState<number | null>(0)
  const [flippedFlashcards, setFlippedFlashcards] = useState<number[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])

  const handleFlashcardClick = (idx: number) => {
    setFlippedFlashcards(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer]
    setQuizAnswers(newAnswers)
    
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    } else {
      let score = 0
      newAnswers.forEach((ans, i) => {
        if (ans === QUIZ_QUESTIONS[i].correct) score++
      })
      setQuizScore(score)
    }
  }

  const resetQuiz = () => {
    setCurrentQuizIndex(0)
    setQuizScore(null)
    setQuizAnswers([])
  }

  return (
    <div className="flex-1 pb-20 pt-24 bg-background min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-secondary border-secondary/30 py-1 px-3">Active Learning</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Algebra <span className="text-secondary italic">Learning Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
              Master Algebra step by step with interactive learning, visual tools, and real-time practice.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-16">
            
            {/* 📍 Interactive Roadmap */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg"><Target className="h-6 w-6 text-secondary" /></div>
                <h2 className="text-3xl font-bold">Your Interactive Roadmap</h2>
              </div>
              <div className="space-y-4">
                 {ROADMAP.map((step, idx) => (
                   <Card key={idx} className="border-border/50 overflow-hidden group">
                     <div 
                       className={`flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors ${expandedRoadmap === idx ? 'bg-muted/20' : ''}`}
                       onClick={() => setExpandedRoadmap(expandedRoadmap === idx ? null : idx)}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white ${step.color}`}>
                             {idx + 1}
                           </div>
                           <div>
                              <h4 className="text-xl font-bold">{step.level}</h4>
                              <p className="text-sm text-muted-foreground">{step.desc}</p>
                           </div>
                        </div>
                        {expandedRoadmap === idx ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                     </div>
                     <AnimatePresence>
                       {expandedRoadmap === idx && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.3 }}
                         >
                           <CardContent className="p-6 border-t border-border/40 bg-muted/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {step.topics.map((t, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm">
                                   <CheckCircle2 className={`h-5 w-5 ${step.color.replace('bg-', 'text-')}`} />
                                   <span className="text-sm font-semibold">{t}</span>
                                </div>
                              ))}
                              <Button variant="ghost" size="sm" className="col-span-1 sm:col-span-2 w-fit gap-2">
                                Start Lessons <ArrowRight className="h-4 w-4" />
                              </Button>
                           </CardContent>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </Card>
                 ))}
              </div>
            </section>

            {/* 🎥 YouTube Resources */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg"><Play className="h-6 w-6 text-red-500" /></div>
                <h2 className="text-3xl font-bold">YouTube Education</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {YOUTUBE_RESOURCES.map((video, idx) => (
                  <a href={video.link} target="_blank" rel="noopener noreferrer" key={idx} className="block group">
                    <Card className="border-border/50 hover:border-red-500/30 transition-all flex h-full">
                      <div className="p-4 flex flex-col justify-center">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-red-500 transition-colors">{video.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      </div>
                      <div className="ml-auto p-4 flex items-center">
                         <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </section>

             {/* 🎮 Interactive Practice (Quiz) */}
             <section className="space-y-8 bg-muted/20 p-8 md:p-12 rounded-3xl border border-border/40">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg"><Trophy className="h-6 w-6 text-green-500" /></div>
                  <h2 className="text-3xl font-bold text-foreground">Interactive Practice Quiz</h2>
               </div>
               
               {quizScore === null ? (
                 <Card className="max-w-2xl bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                       <p className="text-xs font-bold text-secondary uppercase tracking-widest">Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}</p>
                       <CardTitle className="text-2xl mt-2">{QUIZ_QUESTIONS[currentQuizIndex].q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <RadioGroup onValueChange={handleQuizAnswer} value="">
                          <div className="grid gap-3">
                             {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, i) => (
                               <div key={i} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 cursor-pointer transition-colors bg-card">
                                 <RadioGroupItem value={opt} id={`q${currentQuizIndex}-o${i}`} />
                                 <Label htmlFor={`q${currentQuizIndex}-o${i}`} className="flex-1 cursor-pointer font-bold">{opt}</Label>
                               </div>
                             ))}
                          </div>
                       </RadioGroup>
                    </CardContent>
                 </Card>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center text-center space-y-6 py-10"
                 >
                    <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
                       <Trophy className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black">Score: {quizScore} / {QUIZ_QUESTIONS.length}</h3>
                       <p className="text-muted-foreground mt-2">{quizScore === QUIZ_QUESTIONS.length ? "Perfect Math Mastery!" : "Keep practicing, you're getting there!"}</p>
                    </div>
                    <Button onClick={resetQuiz} className="bg-secondary hover:bg-secondary/90">Try Again</Button>
                 </motion.div>
               )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-16">
            
            {/* 🧠 Interactive Flashcards */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg"><Star className="h-6 w-6 text-yellow-500" /></div>
                <h2 className="text-2xl font-bold">Equation Flip Cards</h2>
              </div>
              <div className="space-y-4">
                {FLASHCARDS.map((card, idx) => (
                   <div 
                   key={idx} 
                   className="cursor-pointer perspective-1000 h-32"
                   onClick={() => handleFlashcardClick(idx)}
                 >
                   <motion.div 
                     className="relative w-full h-full transform-style-3d duration-500"
                     animate={{ rotateY: flippedFlashcards.includes(idx) ? 180 : 0 }}
                   >
                     {/* Front */}
                     <Card className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-4 text-center border-border/50 group hover:border-secondary/30 transition-all shadow-sm">
                       <span className="font-bold text-sm flex items-center gap-2">
                         <HelpCircle className="h-4 w-4 text-secondary" /> {card.q}
                       </span>
                     </Card>
                     {/* Back */}
                     <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-secondary/5 border-secondary/20 flex items-center justify-center p-4 text-center">
                       <span className="text-sm font-medium text-foreground italic">{card.a}</span>
                     </Card>
                   </motion.div>
                 </div>
                ))}
              </div>
            </section>

             {/* 🛠 Practice & Tools */}
             <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Calculator className="h-6 w-6 text-blue-500" /></div>
                  <h2 className="text-2xl font-bold">Algebra Toolkit</h2>
               </div>
               <div className="space-y-4">
                  {TOOLS.map((tool, idx) => (
                    <Card key={idx} className="border-border/50 hover:bg-card transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </CardContent>
                      <CardFooter>
                         <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                           <a href={tool.link} target="_blank" rel="noopener noreferrer">Launch Tool</a>
                         </Button>
                      </CardFooter>
                    </Card>
                  ))}
               </div>
            </section>
          </aside>
        </div>

        {/* Courses & Blogs Footer sections */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Online Courses */}
            <section className="space-y-8">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg"><Globe className="h-6 w-6 text-indigo-500" /></div>
                <h2 className="text-3xl font-bold uppercase tracking-tight">Top Algebra Courses</h2>
               </div>
               <div className="space-y-3">
                  {COURSES.map((course, idx) => (
                    <Card key={idx} className="border-border/50 bg-muted/10 group hover:bg-card transition-all">
                       <div className="p-5 flex items-center justify-between">
                          <div>
                             <h5 className="font-bold text-foreground">{course.title}</h5>
                             <p className="text-xs text-muted-foreground italic">{course.platform} • {course.instructor}</p>
                          </div>
                          <a href={course.link} target="_blank" rel="noopener noreferrer">
                             <Button size="icon" variant="ghost" className="rounded-full hover:bg-indigo-500/10 text-indigo-500"><ExternalLink className="h-4 w-4" /></Button>
                          </a>
                       </div>
                    </Card>
                  ))}
               </div>
            </section>

            {/* Blogs Section */}
            <section className="space-y-8">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><Layout className="h-6 w-6 text-emerald-500" /></div>
                <h2 className="text-3xl font-bold uppercase tracking-tight">Articles & Guides</h2>
               </div>
               <div className="space-y-3">
                  {BLOGS.map((blog, idx) => (
                    <Card key={idx} className="border-border/50 bg-muted/10 group hover:bg-card transition-all">
                       <div className="p-5 flex items-center justify-between">
                          <div className="flex-1">
                             <h5 className="font-bold text-foreground text-sm line-clamp-1">{blog.title}</h5>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Source: {blog.author}</p>
                          </div>
                          <a href={blog.link} target="_blank" rel="noopener noreferrer">
                             <Button variant="link" className="text-emerald-500 text-xs">Read More</Button>
                          </a>
                       </div>
                    </Card>
                  ))}
               </div>
            </section>
        </div>

        {/* Mini Projects Section */}
        <section className="mt-24 mb-20">
           <div className="text-center mb-12">
              <div className="inline-flex p-3 bg-secondary/10 rounded-full mb-4"><Code className="h-8 w-8 text-secondary" /></div>
              <h2 className="text-4xl font-black">Applied Algebra Projects</h2>
              <p className="text-muted-foreground mt-2">Take your learning beyond the textbook. Build real tools.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROJECTS.map((p, idx) => (
                <Card key={idx} className="border-border/50 hover:shadow-2xl transition-all h-full flex flex-col group">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{p.difficulty}</Badge>
                    <CardTitle className="text-xl group-hover:text-secondary transition-colors">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{p.desc}</p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t border-border/20 mt-4">
                     <Button variant="ghost" className="px-0 text-secondary font-bold w-full justify-between mt-4">
                       Start Project Blueprint <ArrowRight className="h-4 w-4" />
                     </Button>
                  </CardFooter>
                </Card>
              ))}
           </div>
        </section>

      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
