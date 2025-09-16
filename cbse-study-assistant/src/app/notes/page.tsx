'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download,
  BookOpen,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

const CBSE_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Science',
  'Sanskrit'
]

interface EnhancedNote {
  id: string
  title: string
  enhancedContent: string
  subject: string
  chapter: string
  createdAt: string
}

export default function NotesPage() {
  const { data: session, status } = useSession()
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedNote, setEnhancedNote] = useState<EnhancedNote | null>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    chapter: '',
    text: ''
  })

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEnhanceNotes = async () => {
    if (!formData.title || !formData.subject || !formData.chapter || !formData.text) {
      setError('Please fill in all fields')
      return
    }

    setIsEnhancing(true)
    setError('')

    try {
      const response = await fetch('/api/notes/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance notes')
      }

      setEnhancedNote(data.note)
      setFormData({ title: '', subject: '', chapter: '', text: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance notes')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleInputChange('text', content)
      }
      reader.readAsText(file)
    } else {
      setError('Please upload a text file (.txt)')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
            AI Notes Enhancement
          </h1>
          <p className="text-gray-600">
            Upload your study notes and get AI-enhanced, CBSE-compliant versions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload & Enhance Your Notes
              </CardTitle>
              <CardDescription>
                Provide your notes and subject details for AI enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Note Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Photosynthesis - Chapter 6"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {CBSE_SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Input
                    id="chapter"
                    placeholder="e.g., Life Processes"
                    value={formData.chapter}
                    onChange={(e) => handleInputChange('chapter', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Text File (Optional)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Your Notes</Label>
                <Textarea
                  id="text"
                  placeholder="Paste or type your notes here..."
                  className="min-h-[200px]"
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                />
              </div>

              <Button 
                onClick={handleEnhanceNotes} 
                disabled={isEnhancing}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Enhanced Notes
              </CardTitle>
              <CardDescription>
                AI-enhanced, CBSE-compliant study notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enhancedNote ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{enhancedNote.subject}</Badge>
                      <Badge variant="outline">{enhancedNote.chapter}</Badge>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      <span className="text-sm">Enhanced</span>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg border">
                    <ReactMarkdown>{enhancedNote.enhancedContent}</ReactMarkdown>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Enhanced Notes
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>Enhanced notes will appear here after processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}