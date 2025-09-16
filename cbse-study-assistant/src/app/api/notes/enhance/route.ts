import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
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

    // For development, return mock enhanced content
    const enhancedContent = `# Enhanced Notes: ${subject} - ${chapter}

## ${title}

### Key Concepts
${text}

### Detailed Explanation
This content has been enhanced with CBSE-specific insights and structured for better understanding.

### Important Points for CBSE Class 10
- Concept explanations aligned with CBSE curriculum
- Practice questions and examples
- Previous year exam patterns

### Quick Revision Points
1. Main concepts are highlighted above
2. Practice questions would be added here
3. Previous year patterns included

### Exam Tips
- Focus on understanding core concepts
- Practice numerical problems regularly
- Review these notes before exams

*Note: This is a development preview. Real AI enhancement will provide more detailed and accurate content.*`

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