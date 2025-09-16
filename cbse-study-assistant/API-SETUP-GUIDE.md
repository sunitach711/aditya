# CBSE Study Assistant - API Requirements and Setup

## 🔑 Required API Keys and Services

This document outlines all the external services and API keys needed for your CBSE Study Assistant project.

## 🗄️ Database Service (Required)

### **Option 1: Supabase (Recommended - Free Tier Available)**

**Why Supabase?**
- ✅ Free PostgreSQL database (500MB)
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Easy setup and management
- ✅ Great for educational projects

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Click "New Project"
4. Choose organization and project name
5. Set database password
6. Wait for project creation (2-3 minutes)
7. Go to Settings > Database
8. Copy the connection string
9. Update your `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
   ```

### **Option 2: Neon.tech (Alternative - Also Free)**

**Setup Steps:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project
4. Copy connection string
5. Update `.env.local` with the connection string

### **Option 3: Railway/PlanetScale (Paid but simple)**

## 🔐 Authentication Service (Required)

### **Google OAuth Setup**

**Why Google OAuth?**
- ✅ Trusted by users
- ✅ Quick sign-up process
- ✅ No password management needed
- ✅ Perfect for educational platforms

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable APIs:
   - Google+ API
   - Google OAuth2 API
4. Create OAuth 2.0 Credentials:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret
6. Update `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

**Cost:** FREE (up to reasonable usage limits)

## 🤖 AI Service (Required for Notes Enhancement)

### **OpenAI API**

**Why OpenAI?**
- ✅ Most advanced AI for text enhancement
- ✅ Excellent at educational content
- ✅ Good documentation and support
- ✅ Pay-as-you-use pricing

**Setup Steps:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account
3. Add payment method (required even for small usage)
4. Generate API key in API Keys section
5. Update `.env.local`:
   ```env
   OPENAI_API_KEY="sk-your-api-key-here"
   ```

**Cost Estimate:**
- **Development/Testing:** $5-10/month
- **Light Production:** $20-50/month
- **Heavy Usage:** $100+/month

**Usage Tips:**
- Use GPT-3.5-turbo for cost efficiency
- Implement response caching
- Set usage limits in OpenAI dashboard

### **Alternative: Google Gemini (Future Option)**
- Currently in beta
- Potentially cheaper than OpenAI
- Good for CBSE-specific content

## 🔒 Security Service (Required)

### **NextAuth Secret**

**Generate Secure Secret:**
```bash
# Run this command in terminal:
openssl rand -base64 32
```

**Update `.env.local`:**
```env
NEXTAUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="http://localhost:3000"  # Development
NEXTAUTH_URL="https://your-domain.com"  # Production
```

## 📁 File Storage (Optional - for PDF uploads)

### **Option 1: Vercel Blob (Recommended)**
- ✅ Integrates perfectly with Vercel
- ✅ Free tier available
- ✅ Automatic optimization

### **Option 2: Supabase Storage**
- ✅ Included with Supabase database
- ✅ Free tier available
- ✅ Built-in CDN

### **Option 3: Cloudinary (Alternative)**
- ✅ Free tier: 25GB storage
- ✅ Image/PDF optimization
- ✅ Great performance

## 💰 Total Cost Breakdown

### **Development Phase (FREE)**
```
Database:         $0  (Supabase free tier)
Authentication:   $0  (Google OAuth free)
OpenAI API:       $0  (testing with dummy responses)
File Storage:     $0  (Vercel blob free tier)
Hosting:          $0  (Vercel free tier)
Domain:           $0  (vercel.app subdomain)
-----------------------------------
Total:            $0/month
```

### **Production Phase (Minimal Cost)**
```
Database:         $0-25  (Supabase free tier or Pro)
Authentication:   $0     (Google OAuth free)
OpenAI API:       $20-50 (moderate usage)
File Storage:     $0-10  (Vercel blob)
Hosting:          $0     (Vercel free tier)
Domain:           $12    (custom domain per year)
-----------------------------------
Total:            $20-85/month
```

### **Heavy Usage (If Popular)**
```
Database:         $25    (Supabase Pro)
Authentication:   $0     (Google OAuth free)
OpenAI API:       $100+  (heavy usage)
File Storage:     $20    (Vercel blob pro)
Hosting:          $0     (Vercel free tier)
Domain:           $12    (custom domain per year)
-----------------------------------
Total:            $145+/month
```

## 🚀 Development vs Production Setup

### **Development (.env.local)**
```env
# Database (use Supabase free tier)
DATABASE_URL="postgresql://postgres:password@host:5432/postgres"

# Authentication (dummy for testing)
NEXTAUTH_SECRET="development-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="dummy-client-id"
GOOGLE_CLIENT_SECRET="dummy-client-secret"

# AI (dummy for testing, or real key for testing)
OPENAI_API_KEY="sk-dummy-key-or-real-key-for-testing"
```

### **Production Environment Variables**
```env
# Database (production Supabase)
DATABASE_URL="postgresql://postgres:realpassword@realhost:5432/postgres"

# Authentication (real Google OAuth)
NEXTAUTH_SECRET="super-secure-random-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="real-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="real-client-secret"

# AI (real OpenAI key)
OPENAI_API_KEY="sk-real-openai-api-key"

# Optional: File storage
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
```

## ⚡ Quick Setup for Immediate Development

**For immediate development and testing, you only need:**

1. **Database:** Set up Supabase (15 minutes)
2. **Run migrations:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```
3. **Start development:**
   ```bash
   npm run dev
   ```

**Everything else can use dummy values during development!**

## 🔧 API Setup Priority

### **High Priority (Essential)**
1. ✅ Database (Supabase) - Required for data storage
2. 🟡 OpenAI API - Can use dummy responses during development

### **Medium Priority (Important for full functionality)**
3. 🟡 Google OAuth - Can develop without auth initially
4. 🟡 File Storage - Can simulate file uploads

### **Low Priority (Nice to have)**
5. ⚪ Custom domain
6. ⚪ Advanced monitoring
7. ⚪ Email services

## 📞 Need Help Setting Up?

1. **Database Issues:** Check connection string format
2. **Auth Problems:** Verify redirect URIs match exactly
3. **API Errors:** Check API key format and permissions
4. **CORS Issues:** Verify domain configurations

**I can help you through any specific setup step - just ask!**

---

## 🎯 Next Steps

1. **Choose your database provider** (Supabase recommended)
2. **Set up the database connection**
3. **Run database migrations**
4. **Test the notes enhancement feature**
5. **Add real Google OAuth when ready for user testing**

Your project is designed to work with dummy APIs during development, so you can start building immediately and add real services gradually!