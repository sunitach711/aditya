'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  PenTool, 
  ClipboardList, 
  BarChart3,
  Plus,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/')
  }

  const stats = [
    {
      title: 'Notes Enhanced',
      value: '12',
      description: 'AI-enhanced study notes',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Practice Questions',
      value: '156',
      description: 'Questions answered',
      icon: PenTool,
      color: 'text-green-600',
    },
    {
      title: 'Mock Tests',
      value: '8',
      description: 'Tests completed',
      icon: ClipboardList,
      color: 'text-purple-600',
    },
    {
      title: 'Average Score',
      value: '85%',
      description: 'Overall performance',
      icon: Award,
      color: 'text-orange-600',
    },
  ]

  const recentActivities = [
    {
      type: 'note',
      title: 'Enhanced Science Chapter 10',
      subject: 'Science',
      time: '2 hours ago',
    },
    {
      type: 'test',
      title: 'Mathematics Mock Test',
      subject: 'Mathematics',
      time: '1 day ago',
      score: '92%',
    },
    {
      type: 'practice',
      title: 'English Grammar Practice',
      subject: 'English',
      time: '2 days ago',
    },
  ]

  const subjects = [
    { name: 'Mathematics', progress: 75, color: 'bg-blue-500' },
    { name: 'Science', progress: 60, color: 'bg-green-500' },
    { name: 'English', progress: 80, color: 'bg-purple-500' },
    { name: 'Hindi', progress: 45, color: 'bg-orange-500' },
    { name: 'Social Science', progress: 55, color: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your learning progress and recent activities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your study session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 flex-col space-y-2">
                  <Link href="/notes">
                    <BookOpen className="h-6 w-6" />
                    <span>Enhance Notes</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col space-y-2" variant="outline">
                  <Link href="/practice">
                    <PenTool className="h-6 w-6" />
                    <span>Practice Questions</span>
                  </Link>
                </Button>
                <Button asChild className="h-20 flex-col space-y-2" variant="outline">
                  <Link href="/tests">
                    <ClipboardList className="h-6 w-6" />
                    <span>Take Mock Test</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Your completion status by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest study sessions and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'note' && <BookOpen className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'test' && <ClipboardList className="h-5 w-5 text-purple-600" />}
                    {activity.type === 'practice' && <PenTool className="h-5 w-5 text-green-600" />}
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.subject}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                        {activity.score && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{activity.score}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}