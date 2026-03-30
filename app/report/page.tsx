import { RealisticReport } from '@/components/realistic-report'

export default function Report() {
  return (
    <RealisticReport 
      topic="Data Science"
      score={78} 
      accuracy={85} 
      timeTaken={1520} 
      stressLevel="moderate" 
      weakAreas={["Pandas DataFrames", "Data Visualization with Matplotlib"]}
      strongAreas={["Python Fundamentals", "NumPy Array Operations"]}
    />
  )
}
