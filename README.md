# Pitcherr

Pitcherr is an intelligent proposal generation platform designed for freelancers. By combining your portfolio, resume, and past work with a client's specific job description, Pitcherr leverages the DeepSeek AI to generate highly tailored, non-generic proposals. It outlines exactly how you will approach the project based on your proven expertise.

## Features

- **Smart Proposal Generation:** Uses DeepSeek API to cross-reference your uploaded resume/portfolio against a job description.
- **Resume Parsing & Cloud Storage:** Upload PDF resumes which are securely stored using Cloudflare R2 and accurately parsed for AI processing.
- **Secure Authentication:** Seamless and secure login using Firebase Authentication (Google Auth & JWT).
- **Freemium Model & Payments:** Integrated with Paystack to support flexible subscription and one-time payment options.
- **Modern UI/UX:** Built with a stunning, high-performance interface using Next.js and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Firebase Auth
- **AI Integration:** DeepSeek API
- **Storage:** Cloudflare R2 (S3-compatible)
- **Payments:** Paystack
- **Styling:** Tailwind CSS / Framer Motion / GSAP

## Prerequisites

- Node.js 18+ and `pnpm`
- A MongoDB Atlas cluster (or local instance)
- Firebase Project configured for Authentication
- Cloudflare R2 bucket credentials
- Paystack API keys
- DeepSeek API key

## Environment Variables

Create a `.env.local` file in the root of your project and configure the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudflare R2
# Note: Use "mock" for R2_ACCOUNT_ID to enable local storage mock for development
R2_ACCOUNT_ID=your_cloudflare_account_id 
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=pitcherr-bucket
NEXT_PUBLIC_R2_PUBLIC_URL=your_r2_public_domain

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pitcherr.git
   cd pitcherr
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Design

Please refer to `DESIGN.md` and `walkthrough.md` in the `.agents` or `artifacts` tracking directory for an in-depth look at the architecture, component structure, and recent development milestones (such as the PDF parser optimization and R2 integration).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
