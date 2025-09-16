import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { openai, cbseSystemPrompt } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text, subject, chapter, title } = await request.json()

    if (!text || !subject || !chapter || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: text, subject, chapter, title' },
        { status: 400 }
      )
    }

    // For development, simulate AI enhancement
    const isDevelopment = process.env.NODE_ENV === 'development'
    let enhancedContent: string

    if (isDevelopment || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('dummy')) {
      // Simulate AI enhancement for development
      enhancedContent = `# Enhanced Notes: ${title}

## Subject: ${subject} | Chapter: ${chapter}

### Key Concepts
${text}

### Important Points
- This is an AI-enhanced version of your notes
- Added comprehensive explanations following CBSE guidelines
- Structured for better understanding and retention

### Quick Revision Points
1. Main concepts are highlighted above
2. Practice questions would be added here
3. Previous year patterns included

### Exam Tips
- Focus on understanding core concepts
- Practice numerical problems regularly
- Review these notes before exams

*Note: This is a development preview. Real AI enhancement will provide more detailed and accurate content.*`
    } else {
      // Use real OpenAI API in production
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: cbseSystemPrompt
          },
          {
            role: "user",
            content: `Please enhance these CBSE Class 10 ${subject} notes from Chapter: ${chapter}

Original Notes:
${text}

Please provide comprehensive, well-structured notes that follow CBSE guidelines and are exam-ready.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })

      enhancedContent = completion.choices[0].message.content || 'Failed to enhance notes'
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save enhanced notes to database
    const note = await prisma.note.create({
      data: {
        title,
        originalText: text,
        enhancedContent,
        subject,
        chapter,
        userId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        title: note.title,
        enhancedContent: note.enhancedContent,
        subject: note.subject,
        chapter: note.chapter,
        createdAt: note.createdAt
      }
    })

  } catch (error) {
    console.error('Error enhancing notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}