"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import ReactMarkdown from "react-markdown"
import { Volume2, Square, Loader2 } from "lucide-react"

export function AILearning() {
    const { data: session } = useSession()
    const [stress, setStress] = useState(40)
    const [hours, setHours] = useState(4)
    const [confidence, setConfidence] = useState(50)
    const [result, setResult] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        if (!result) return

        // Clean markdown and EMOJIS for better speech synthesis
        const cleanText = result
            .replace(/<br\s*\/?>/gi, '. ') // Replace <br> with dots
            .replace(/[#*`_~]/g, '') // Remove markdown characters
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
            .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
            .replace(/\n+/g, '. ') // Replace newlines with dots for pausing

        const utterance = new SpeechSynthesisUtterance(cleanText)
        
        // Prioritize a "Female" mellow/fun voice
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Natural'))
        ) || voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang.startsWith('en'))
        
        if (femaleVoice) utterance.voice = femaleVoice

        // More "Alive" settings: Slightly faster and higher pitch
        utterance.rate = 1.08 // Slightly more energetic flow
        utterance.pitch = 1.3 // More "Fun/Positive" pitch
        
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
    }

    const generatePlan = async () => {
        setIsLoading(true)
        setResult(null)
        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
        
        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    stress, 
                    hours, 
                    confidence,
                    userName: session?.user?.name || "Student"
                }),
            });

            const data = await res.json();

            if (res.ok && data.plan) {
                setResult(data.plan);
            } else {
                setResult(`⚠️ ${data.error || "Something went wrong. Please try again."}`);
            }
        } catch (error) {
            setResult("⚠️ Failed to connect to AI server. Please check your connection.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-xl mx-auto border-border shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-secondary" />
                    AI Learning Path Generator
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <p className="text-sm font-medium mb-2 flex justify-between text-muted-foreground">
                        <span>Stress Level</span>
                        <span className={stress > 70 ? "text-destructive font-bold" : "text-foreground"}>{stress}%</span>
                    </p>
                    <Slider
                        defaultValue={[stress]}
                        max={100}
                        step={1}
                        onValueChange={(v) => setStress(v[0])}
                        className="py-4"
                    />
                </div>

                <div>
                    <p className="text-sm font-medium mb-2 flex justify-between text-muted-foreground">
                        <span>Study Time</span>
                        <span className="text-foreground">{hours} Hours</span>
                    </p>
                    <Slider
                        defaultValue={[hours]}
                        max={10}
                        step={1}
                        onValueChange={(v) => setHours(v[0])}
                        className="py-4"
                    />
                </div>

                <div>
                    <p className="text-sm font-medium mb-2 flex justify-between text-muted-foreground">
                        <span>Confidence in Topic</span>
                        <span className="text-foreground">{confidence}%</span>
                    </p>
                    <Slider
                        defaultValue={[confidence]}
                        max={100}
                        step={1}
                        onValueChange={(v) => setConfidence(v[0])}
                        className="py-4"
                    />
                </div>

                <Button 
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground h-12 shadow-md hover:shadow-lg transition-all" 
                    onClick={generatePlan} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing your state...
                        </>
                    ) : (
                        "Generate AI Learning Plan"
                    )}
                </Button>

                {result && (
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-card/50 border border-border text-sm prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-secondary animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>
                        
                        {!result.startsWith("⚠️") && (
                            <Button
                                variant="outline"
                                className={`w-full flex items-center justify-center gap-2 h-11 border-secondary/20 hover:border-secondary/50 hover:bg-secondary/5 transition-all
                                    ${isSpeaking ? 'text-destructive border-destructive/20 hover:border-destructive/50' : 'text-secondary'}`}
                                onClick={toggleSpeech}
                            >
                                {isSpeaking ? (
                                    <>
                                        <Square className="h-4 w-4 fill-current" />
                                        Stop Reading Plan
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="h-4 w-4" />
                                        Listen to My Plan
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
