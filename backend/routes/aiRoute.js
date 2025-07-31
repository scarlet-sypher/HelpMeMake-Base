const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { requireUserOrMentor } = require('../middleware/roleAuth');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Mentor Selection
router.post('/select-mentors', requireUserOrMentor, async (req, res) => {
  try {
    const { projectMetaData, mentorMetaDataList } = req.body;

    // Validate input
    if (!projectMetaData || !mentorMetaDataList || mentorMetaDataList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project data and mentor list are required'
      });
    }

    // Get AI recommendations
    const aiRecommendations = await getBestMentorsUsingGemini(projectMetaData, mentorMetaDataList);

    // Enrich with full mentor data
    const enrichedMentors = aiRecommendations.mentors.map(aiMentor => {
      const matchedMentor = mentorMetaDataList.find(m => m._id === aiMentor.mentorId);
      if (!matchedMentor) {
        return null; // Skip if mentor not found
      }
      
      return {
        mentorData: matchedMentor,
        aiScore: aiMentor.score,
        whyReason: `🎯 AI selected this mentor because: ${aiMentor.reason}`
      };
    }).filter(Boolean); // Remove null entries

    res.json({
      success: true,
      mentors: enrichedMentors,
      analysisTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI mentor selection error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error.message
    });
  }
});

// Gemini AI Integration Function
async function getBestMentorsUsingGemini(projectMetaData, mentorMetaDataList) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Build the prompt
    const prompt = `You are an AI expert mentor selector for a learning platform.

PROJECT DETAILS:
${JSON.stringify({
  name: projectMetaData.name,
  category: projectMetaData.category,
  techStack: projectMetaData.techStack,
  difficultyLevel: projectMetaData.difficultyLevel,
  shortDescription: projectMetaData.shortDescription,
  duration: projectMetaData.duration,
  openingPrice: projectMetaData.openingPrice,
  prerequisites: projectMetaData.prerequisites || []
}, null, 2)}

AVAILABLE MENTORS:
${JSON.stringify(mentorMetaDataList.map(mentor => ({
  _id: mentor._id,
  name: mentor.name || mentor.userId?.name || 'Anonymous',
  title: mentor.title,
  expertise: mentor.expertise,
  rating: mentor.rating,
  totalStudents: mentor.totalStudents,
  completedSessions: mentor.completedSessions,
  experience: mentor.experience,
  responseTime: mentor.responseTime,
  pricing: mentor.pricing,
  isOnline: mentor.isOnline,
  description: mentor.description
})), null, 2)}

TASK:
1. Analyze the project requirements and mentor capabilities.
2. Select the top 5 mentors most suited for this specific project.
3. Score each mentor out of 100 based on:
   - Technical skill match with project tech stack.
   - Experience level matching project difficulty.
   - Rating and past performance.
   - Availability and response time.
   - Pricing alignment with project budget.
4. Provide a concise, compelling reason for each selection.

STRICT CONSTRAINTS:
- You must ONLY select mentors from the provided AVAILABLE MENTORS list.
- Do NOT create or invent any mentor data.
- Do NOT return a mentor who is not explicitly listed in AVAILABLE MENTORS.
- If no suitable mentor meets the criteria, return fewer than 5 mentors — never add placeholders.
- Ensure mentorId matches exactly with the "_id" field from AVAILABLE MENTORS.
- Do NOT alter or reformat mentor IDs, names, or details.
- Maintain the scoring and reasoning logic exactly as described.

RESPONSE FORMAT (JSON only, no other text):
{
  "mentors": [
    {
      "mentorId": "mentor_id_here",
      "score": 95,
      "reason": "Expert in React, Node.js, and MongoDB with 5+ years experience. Exceptional 4.9 rating from 200+ students. Perfect for intermediate projects. Quick 15-min response time and competitive pricing."
    }
  ]
}

Return exactly 5 mentors or fewer if less than 5 suitable mentors exist.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Clean up response to ensure valid JSON
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsedResponse = JSON.parse(cleanResponse);
    
    // Validate response structure
    if (!parsedResponse.mentors || !Array.isArray(parsedResponse.mentors)) {
      throw new Error('Invalid AI response structure');
    }

    // Ensure we have valid mentor IDs and scores
    const validMentors = parsedResponse.mentors.filter(mentor => 
      mentor.mentorId && 
      typeof mentor.score === 'number' && 
      mentor.reason
    );

    return {
      mentors: validMentors.slice(0, 5) // Limit to 5 mentors
    };

  } catch (error) {
    console.error('Gemini AI error:', error);
    
    // Fallback to algorithmic selection if AI fails
    console.log('Falling back to algorithmic mentor selection...');
    return performFallbackAnalysis(projectMetaData, mentorMetaDataList);
  }
}

// Fallback algorithm (same as your original implementation)
function performFallbackAnalysis(projectData, mentorsList) {
  const scoredMentors = mentorsList.map(mentor => {
    let score = 0;
    let reasons = [];

    // Skill matching
    const projectTechStack = projectData.techStack || [];
    const mentorSkills = mentor.expertise.map(exp => exp.skill.toLowerCase());
    
    const skillMatches = projectTechStack.filter(tech => 
      mentorSkills.some(skill => skill.includes(tech.toLowerCase()) || tech.toLowerCase().includes(skill))
    );
    
    if (skillMatches.length > 0) {
      score += skillMatches.length * 20;
      reasons.push(`Expert in ${skillMatches.length} of your required technologies: ${skillMatches.join(', ')}`);
    }

    // Experience level matching
    const projectDifficulty = projectData.difficultyLevel;
    const mentorExperience = mentor.experience.years;
    
    if (projectDifficulty === 'Beginner' && mentorExperience >= 2) {
      score += 15;
      reasons.push('Perfect experience level for guiding beginners');
    } else if (projectDifficulty === 'Intermediate' && mentorExperience >= 3) {
      score += 20;
      reasons.push('Strong experience in intermediate-level projects');
    } else if (projectDifficulty === 'Advanced' && mentorExperience >= 5) {
      score += 25;
      reasons.push('Senior-level expertise for advanced projects');
    }

    // Rating bonus
    if (mentor.rating >= 4.5) {
      score += 15;
      reasons.push(`Exceptional rating of ${mentor.rating}/5.0 from previous students`);
    } else if (mentor.rating >= 4.0) {
      score += 10;
      reasons.push(`High rating of ${mentor.rating}/5.0 from previous students`);
    }

    // Activity and availability
    if (mentor.isOnline) {
      score += 10;
      reasons.push('Currently online and available');
    }

    if (mentor.responseTime <= 30) {
      score += 10;
      reasons.push(`Quick response time: ${mentor.responseTime} minutes`);
    }

    // Success rate
    if (mentor.completedSessions >= 50) {
      score += 15;
      reasons.push(`Proven track record with ${mentor.completedSessions} completed sessions`);
    }

    return {
      mentorId: mentor._id,
      score: Math.min(score, 100),
      reason: reasons.join('. ') + `. Overall compatibility score: ${Math.min(score, 100)}/100.`
    };
  });

  // Sort by score and return top 5
  const topMentors = scoredMentors
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, scoredMentors.length))
    .filter(mentor => mentor.score > 30); // Minimum threshold

  return { mentors: topMentors };
}

module.exports = router;