import React from 'react'
import { Calendar, Code, FileText, User, Clock, Rocket, Target, Zap, Globe, Settings } from "lucide-react"
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import RadialOrbitalTimeline from '../ui/radial-orbital-timeline'

const timelineData = [
  {
    id: 1,
    title: "Planning",
    date: "Jan 2024",
    content: "Project planning and requirements gathering phase with stakeholder alignment.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2, 10],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Design",
    date: "Feb 2024",
    content: "UI/UX design, wireframes, and system architecture planning.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Development",
    date: "Mar 2024",
    content: "Core features implementation, backend APIs, and frontend development.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4, 5],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 4,
    title: "Testing",
    date: "Apr 2024",
    content: "User testing, bug fixes, and quality assurance processes.",
    category: "Testing",
    icon: User,
    relatedIds: [2, 3, 5, 6],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 5,
    title: "Integration",
    date: "Apr 2024",
    content: "Third-party integrations, API connections, and data synchronization.",
    category: "Integration",
    icon: Settings,
    relatedIds: [3, 4, 6],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 6,
    title: "Launch Prep",
    date: "May 2024",
    content: "Pre-launch preparations, deployment setup, and final configurations.",
    category: "Launch",
    icon: Rocket,
    relatedIds: [4, 5, 7, 8],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 7,
    title: "Release",
    date: "May 2024",
    content: "Production deployment, go-live activities, and initial monitoring.",
    category: "Release",
    icon: Target,
    relatedIds: [6, 8, 9],
    status: "pending" as const,
    energy: 20,
  },
  {
    id: 8,
    title: "Monitoring",
    date: "Jun 2024",
    content: "Performance monitoring, user feedback collection, and system optimization.",
    category: "Monitoring",
    icon: Zap,
    relatedIds: [6, 7, 9],
    status: "pending" as const,
    energy: 15,
  },
  {
    id: 9,
    title: "Scale",
    date: "Jul 2024",
    content: "Scaling infrastructure, feature enhancements, and growth optimization.",
    category: "Growth",
    icon: Globe,
    relatedIds: [7, 8, 10],
    status: "pending" as const,
    energy: 10,
  },
  {
    id: 10,
    title: "Iterate",
    date: "Aug 2024",
    content: "Feature iterations, user feedback implementation, and continuous improvement.",
    category: "Iteration",
    icon: Clock,
    relatedIds: [1, 9],
    status: "pending" as const,
    energy: 5,
  },
]

interface RadialOrbitalTimelineDemoProps {
  children?: React.ReactNode
}

function RadialOrbitalTimelineDemo({ children }: RadialOrbitalTimelineDemoProps) {
  return (
    <div className="w-full h-full">
      <RadialOrbitalTimeline timelineData={timelineData} />
      {children}
    </div>
  )
}

export default createAutoRegisterComponent({
  id: 'RadialOrbitalTimelineDemo',
  name: 'Radial Orbital Timeline',
  description: 'Interactive orbital timeline visualization with connected nodes and dynamic animations',
  category: CATEGORIES.CREATIVE,
  template: `:::react{component="RadialOrbitalTimelineDemo"}\n:::\n`,
})(RadialOrbitalTimelineDemo)