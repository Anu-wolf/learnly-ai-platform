"use client"
import { useState } from 'react'
import { 
  Play, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Cpu, 
  BarChart, 
  ChevronRight, 
  HelpCircle,
  Layout,
  Database,
  Terminal,
  Layers,
  Award,
  Globe,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ROADMAP = [
  { level: "Beginner", topics: ["Python Basics", "Environment Setup", "Basic Statistics"], color: "bg-blue-500" },
  { level: "Intermediate", topics: ["NumPy & Pandas", "Data Visualization (Matplotlib, Seaborn)", "Data Preprocessing"], color: "bg-purple-500" },
  { level: "Advanced", topics: ["Machine Learning Basics (Scikit-Learn)", "Deep Learning Intro", "ML Ops & Deployment"], color: "bg-indigo-500" }
]

const YOUTUBE_RESOURCES = [
  { title: "Data Science for Beginners", channel: "freeCodeCamp", link: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
  { title: "Complete Roadmap for Data Science", channel: "Krish Naik", link: "https://www.youtube.com/watch?v=S6uUjS-Wl78" },
  { title: "Machine Learning Full Course", channel: "Codebasics", link: "https://www.youtube.com/watch?v=mHe2X7JOfzI" },
  { title: "StatQuest: Logistic Regression", channel: "StatQuest", link: "https://www.youtube.com/watch?v=yIYKR4sgzI8" },
  { title: "Pandas Tutorial for Beginners", channel: "Codebasics", link: "https://www.youtube.com/watch?v=ZyhVh-qRZPA" },
  { title: "NumPy Tutorial", channel: "freeCodeCamp", link: "https://www.youtube.com/watch?v=QUT1VHiLmmI" },
  { title: "SQL for Data Science", channel: "Edureka", link: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  { title: "Data Analysis with Python", channel: "freeCodeCamp", link: "https://www.youtube.com/watch?v=GPVsHOlRBBI" }
]

const COURSES = [
  { title: "Machine Learning Specialization", platform: "Coursera", instructor: "Andrew Ng", link: "https://www.coursera.org/specializations/machine-learning-introduction" },
  { title: "IBM Data Science Professional Certificate", platform: "Coursera", instructor: "IBM Staff", link: "https://www.coursera.org/professional-certificates/ibm-data-science" },
  { title: "Python for Data Science and ML", platform: "Udemy", instructor: "Jose Portilla", link: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/" },
  { title: "Introduction to Computer Science using Python", platform: "edX", instructor: "MIT", link: "https://www.edx.org/course/introduction-to-computer-science-and-programming-7" },
  { title: "Statistics and Data Science", platform: "edX", instructor: "MIT", link: "https://www.edx.org/micromasters/mitx-statistics-and-data-science" }
]

const FLASHCARDS = [
  { q: "What is Data Science?", a: "An interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data." },
  { q: "What is Pandas?", a: "A fast, powerful, flexible, and easy-to-use open-source data analysis and manipulation tool, built on top of the Python programming language." },
  { q: "Supervised vs Unsupervised Learning?", a: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data." },
  { q: "Mean vs Median?", a: "Mean is the average (sum of values / count), while Median is the middle value in a sorted list. Median is more robust to outliers." },
  { q: "What is Overfitting?", a: "When a model learns the training data too well, including the noise, and fails to generalize to new, unseen data." },
  { q: "What is NumPy?", a: "A library for the Python programming language, adding support for large, multi-dimensional arrays and matrices, along with a large collection of high-level mathematical functions." },
  { q: "What is a Linear Regression?", a: "A linear approach for modelling the relationship between a scalar response and one or more explanatory variables." },
  { q: "What is Data Visualization?", a: "The graphic representation of data. It involves producing images that communicate relationships among the represented data to viewers of the images." },
  { q: "What is a Random Forest?", a: "An ensemble learning method for classification, regression and other tasks that operates by constructing a multitude of decision trees at training time." },
  { q: "What is Matplotlib?", a: "A plotting library for the Python programming language and its numerical mathematics extension NumPy." }
]

const BLOGS = [
  { title: "How to Build a Data Science Portfolio", author: "Towards Data Science", link: "https://towardsdatascience.com/how-to-build-a-data-science-portfolio-5f566606830d" },
  { title: "Top 10 Machine Learning Algorithms", author: "Medium", link: "https://medium.com/@williamkoehrsen/top-10-machine-learning-algorithms-82e707e7e6" },
  { title: "A Roadmap to Data Science Mastery", author: "Analytics Vidhya", link: "https://www.analyticsvidhya.com/blog/2023/01/data-science-learning-path-2023/" },
  { title: "Understanding Neural Networks", author: "Towards Data Science", link: "https://towardsdatascience.com/understanding-neural-networks-from-scratch-in-python-4694e3d2b846" },
  { title: "Python vs R for Data Science", author: "Medium", link: "https://medium.com/data-science-insider/python-vs-r-for-data-science-6f8e7f1e6f9d" }
]

const TOOLS = [
  { name: "Jupyter Notebook", desc: "An open-source web application that allows you to create and share documents that contain live code, equations, visualizations, and narrative text.", icon: Terminal },
  { name: "Google Colab", desc: "A free, cloud-based Jupyter notebook environment that allows you to write and execute Python code in your browser, with access to GPUs.", icon: Globe },
  { name: "Kaggle", desc: "An online community of data scientists and machine learning practitioners. It allows users to find and publish datasets, explore and build models.", icon: Database }
]

const PROJECTS = [
  { title: "Titanic Survival Prediction", desc: "Use the classic Titanic dataset to build a model that predicts whether a passenger survived based on age, gender, and class.", difficulty: "Beginner" },
  { title: "House Price Linear Regression", desc: "Analyze real estate data to predict house prices using linear regression models. Focus on feature engineering and correlation.", difficulty: "Intermediate" },
  { title: "Interactive Sales Dashboard", desc: "Create a visual dashboard using Matplotlib/Seaborn or Plotly to show sales trends, regional performance, and forecasts.", difficulty: "Beginner" }
]

export default function DataScienceLesson() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  return (
    <div className="flex-1 pb-20 pt-24 bg-background min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 py-1 px-3">Learning Hub</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Data Science <span className="text-primary italic">Learning Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
              Your complete roadmap to becoming a Data Scientist. Resources, courses, and projects integrated for assessment-led success.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left Sidebar & Center) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 2. Roadmap Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Layers className="h-6 w-6 text-primary" /></div>
                <h2 className="text-3xl font-bold">The Learning Roadmap</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ROADMAP.map((step, idx) => (
                  <Card key={idx} className="border-border/50 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden group">
                    <div className={`h-1 w-full ${step.color}`} />
                    <CardHeader className="pb-2">
                       <CardTitle className="text-xl flex items-center justify-between">
                         {step.level}
                         <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {step.topics.map((t, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${step.color}`} />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 3. YouTube Resources */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Play className="h-6 w-6 text-red-500" /></div>
                  <h2 className="text-3xl font-bold">Video Education</h2>
                 </div>
                 <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {YOUTUBE_RESOURCES.map((video, idx) => (
                  <a href={video.link} target="_blank" rel="noopener noreferrer" key={idx}>
                    <Card className="border-border/50 hover:bg-muted/30 transition-all flex h-full group">
                      <div className="p-4 flex flex-col justify-center">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{video.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      </div>
                      <div className="ml-auto p-4 flex items-center">
                         <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </section>

            {/* 4. Online Courses */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><BookOpen className="h-6 w-6 text-blue-500" /></div>
                <h2 className="text-3xl font-bold">Premium Certifications</h2>
              </div>
              <div className="space-y-4">
                 {COURSES.map((course, idx) => (
                   <Card key={idx} className="border-border/50 overflow-hidden hover:shadow-md transition-all group">
                     <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                        <div className="bg-muted p-4 rounded-xl hidden sm:block">
                           <Award className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{course.platform}</Badge>
                              <span className="text-xs text-muted-foreground">by {course.instructor}</span>
                           </div>
                           <h4 className="text-xl font-bold text-foreground">{course.title}</h4>
                        </div>
                        <Button className="w-full sm:w-auto gap-2" asChild>
                          <a href={course.link} target="_blank" rel="noopener noreferrer">
                            Enroll Now <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                     </div>
                   </Card>
                 ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area (Right) */}
          <aside className="lg:col-span-4 space-y-16">
            
            {/* 5. Flashcards Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg"><Star className="h-6 w-6 text-yellow-500" /></div>
                <h2 className="text-2xl font-bold">Knowledge Boosters</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {FLASHCARDS.slice(0, 10).map((card, idx) => (
                  <div 
                    key={idx} 
                    className="cursor-pointer perspective-1000 rotate-0 h-32"
                    onClick={() => setFlippedIndex(flippedIndex === idx ? null : idx)}
                  >
                    <motion.div 
                      className="relative w-full h-full transition-all duration-500 transform-style-3d"
                      initial={false}
                      animate={{ rotateY: flippedIndex === idx ? 180 : 0 }}
                    >
                      {/* Front */}
                      <Card className="absolute inset-0 w-full h-full backface-hidden border-border/50 bg-card flex items-center justify-center p-4 text-center">
                        <span className="font-bold text-sm flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-primary" /> {card.q}
                        </span>
                      </Card>
                      {/* Back */}
                      <Card className="absolute inset-0 w-full h-full backface-hidden border-primary/20 bg-primary/5 flex items-center justify-center p-4 text-center transform rotate-y-180">
                        <span className="text-sm font-medium italic text-foreground">{card.a}</span>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            </section>

             {/* 6. Blogs Section */}
             <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Layout className="h-6 w-6 text-emerald-500" /></div>
                  <h2 className="text-2xl font-bold">Must-Read Insights</h2>
               </div>
               <Card className="border-border/50 bg-muted/20">
                 <CardContent className="p-0">
                    {BLOGS.map((blog, idx) => (
                      <a 
                        href={blog.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        key={idx}
                        className={`flex flex-col p-4 hover:bg-card transition-colors ${idx !== BLOGS.length - 1 ? 'border-b border-border/40' : ''}`}
                      >
                         <h5 className="font-bold text-sm text-foreground mb-1 underline-offset-4 hover:underline">{blog.title}</h5>
                         <span className="text-xs text-muted-foreground">{blog.author}</span>
                      </a>
                    ))}
                 </CardContent>
               </Card>
            </section>
          </aside>
        </div>

        {/* 7. Tools Section (Full Width Bottom) */}
        <section className="mt-24 space-y-8">
           <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
              <div className="p-3 bg-indigo-500/10 rounded-2xl mb-4"><Cpu className="h-8 w-8 text-indigo-500" /></div>
              <h2 className="text-3xl font-bold">Essential Data Toolkit</h2>
              <p className="text-muted-foreground mt-2 text-sm italic">Industry standard platforms to build, test and deploy your codes.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TOOLS.map((tool, idx) => (
                <Card key={idx} className="border-border/50 group hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="p-3 bg-muted rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                       <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </CardContent>
                </Card>
              ))}
           </div>
        </section>

        {/* 8. Mini Projects Section */}
        <section className="mt-24 mb-10 p-8 md:p-12 bg-secondary/30 rounded-3xl border border-border/50">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-3">
                 <div className="flex items-center gap-2"><Code className="h-6 w-6 text-primary" /><span className="text-sm font-bold text-primary uppercase tracking-widest">Portfolio Builders</span></div>
                 <h2 className="text-4xl font-black">Mini Hands-On Projects</h2>
              </div>
              <p className="text-muted-foreground max-w-sm text-sm">
                The best way to learn is by doing. Start with these guided projects to build your first portfolio.
              </p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROJECTS.map((project, idx) => (
                <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card transition-colors">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{project.difficulty}</Badge>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{project.desc}</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="link" className="px-0 text-primary font-bold">Get Source Code &rarr;</Button>
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
