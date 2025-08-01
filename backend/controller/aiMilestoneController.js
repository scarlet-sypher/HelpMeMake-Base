const { GoogleGenerativeAI } = require('@google/generative-ai');
const Project = require('../Model/Project');
const Learner = require('../Model/Learner');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiMilestoneController = {
  async generateMilestones(req, res) {
    try {
      const { projectId, regenerate = false } = req.body;
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      // Verify project exists and user has access
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      // Get previous suggestions if regenerating
      let previousSuggestions = [];
      if (regenerate && project.aiResponse && project.aiResponse.previousSuggestions) {
        previousSuggestions = project.aiResponse.previousSuggestions.map(s => s.text);
      }

      // Generate AI milestones
      const aiSuggestions = await generateMilestonesWithGemini(project, previousSuggestions);

      // Update project with AI suggestions
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $set: {
            'aiResponse.suggestions': aiSuggestions.map(text => ({ text, isCompleted: false })),
            'aiResponse.lastGenerated': new Date()
          },
          $push: {
            'aiResponse.previousSuggestions': {
              $each: aiSuggestions.map(text => ({ text, generatedAt: new Date() }))
            }
          }
        },
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        suggestions: aiSuggestions,
        message: 'AI milestones generated successfully'
      });

    } catch (error) {
      console.error('AI milestone generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI milestones',
        error: error.message
      });
    }
  },

  async getMilestones(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      res.json({
        success: true,
        aiResponse: project.aiResponse || { suggestions: [], previousSuggestions: [] }
      });

    } catch (error) {
      console.error('Get AI milestones error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch AI milestones'
      });
    }
  },

  async toggleMilestone(req, res) {
    try {
      const { projectId, index } = req.body;
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      // Toggle the completion status
      if (project.aiResponse && project.aiResponse.suggestions[index]) {
        project.aiResponse.suggestions[index].isCompleted = !project.aiResponse.suggestions[index].isCompleted;
        await project.save();
      }

      res.json({
        success: true,
        message: 'Milestone toggled successfully'
      });

    } catch (error) {
      console.error('Toggle milestone error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle milestone'
      });
    }
  }
};

async function generateMilestonesWithGemini(projectData, previousSuggestions = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const previousText = previousSuggestions.length > 0 
      ? `\n\nPREVIOUS SUGGESTIONS TO AVOID:\n${previousSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : '';

    const prompt = `You are an AI project mentor helping learners break down their projects into manageable milestones.

PROJECT DETAILS:
- Name: ${projectData.name}
- Description: ${projectData.shortDescription}
- Full Description: ${projectData.fullDescription}
- Tech Stack: ${projectData.techStack.join(', ')}
- Category: ${projectData.category}
- Difficulty: ${projectData.difficultyLevel}
- Duration: ${projectData.duration}
- Expected Outcome: ${projectData.projectOutcome}
- Prerequisites: ${projectData.prerequisites ? projectData.prerequisites.join(', ') : 'None'}
- Knowledge Level: ${projectData.knowledgeLevel}${previousText}

TASK:
Generate exactly 5 milestone points that break down this project into logical, sequential steps. Each milestone should be:
1. Actionable and specific
2. Measurable and achievable
3. Progressive (building on previous milestones)
4. Relevant to the project's tech stack and goals
5. Appropriate for the stated difficulty level

CONSTRAINTS:
- Each milestone should be 10-15 words maximum
- Focus on deliverable outcomes, not just learning
- Consider the project's timeline and complexity
- Make milestones that feel rewarding to complete
- If previous suggestions exist, provide completely different alternatives

RESPONSE FORMAT (JSON only, no other text):
{
  "milestones": [
    "Set up development environment and project structure",
    "Create basic UI/UX wireframes and design system",
    "Implement core functionality and data management",
    "Add advanced features and integrations",
    "Test, debug, and deploy the final application"
  ]
}

Return exactly 5 milestone strings in the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Clean up response
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const parsedResponse = JSON.parse(cleanResponse);
    
    if (!parsedResponse.milestones || !Array.isArray(parsedResponse.milestones)) {
      throw new Error('Invalid AI response structure');
    }

    return parsedResponse.milestones.slice(0, 5);

  } catch (error) {
    console.error('Gemini AI error:', error);
    
    // Fallback milestones
    return [
      "Set up project foundation and development environment",
      "Design and create basic user interface components",
      "Implement core functionality and business logic",
      "Add advanced features and external integrations", 
      "Test thoroughly and deploy the final application"
    ];
  }
}

module.exports = aiMilestoneController;