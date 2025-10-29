# IFIA Exam Study App

A modern, mobile-first quiz application designed to help students memorize and prepare for the IFIA (International Federation of Inspection Agencies) exam.

## Features

### 🎯 Study-Optimized Design
- **Card Flip Animation**: Visual feedback with 3D card flips showing correct/incorrect answers
- **2.5 Second Delay**: Memorization time after each answer to reinforce learning
- **Color-Coded Feedback**:
  - Green for correct answers
  - Red for incorrect answers
  - Highlights the correct answer on every question

### 📱 Mobile-First Experience
- **Zero Padding/Borders**: Maximum screen real estate for mobile devices
- **Full-Screen Cards**: Immersive, distraction-free study experience
- **Touch-Optimized**: Large, tap-friendly buttons
- **Responsive Design**: Works perfectly on phones, tablets, and desktops

### 📊 Progress Tracking
- **Real-Time Progress Bar**: Visual indicator of quiz completion
- **Live Score Display**: Correct/incorrect counters and percentage
- **Question Counter**: Shows current question out of 514 total
- **Wrong Answer Review**: Track and review all incorrect answers

### ✨ Modern UI/UX
- **Smooth Animations**: Card flips, color transitions, and visual feedback
- **Professional Gradients**: Modern color scheme (teal/green primary)
- **Modal Results**: Comprehensive results view with statistics
- **Completion Screen**: Motivational feedback based on score

## Quick Start

1. **Install**: \`npm install\`
2. **Configure**: Copy \`.env.example\` to \`.env\` and add your MySQL credentials
3. **Database**: \`mysql -u root -p ifia_db < db/schema.sql\`
4. **Run**: \`node server.js\`
5. **Open**: http://localhost:8081

See DATABASE_SETUP.md for detailed setup instructions.

## Key Improvements

- ✅ Card flip animation for answer feedback
- ✅ 2.5-second memorization delay
- ✅ Zero padding mobile-first design
- ✅ Fixed type coercion bugs
- ✅ Color-coded answer feedback
- ✅ Progress tracking and statistics
- ✅ Modal results view
- ✅ Touch-optimized interface

**Built with ❤️ for IFIA exam students**
