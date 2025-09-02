const { GoogleGenerativeAI } = require("@google/generative-ai");
const Project = require("../Model/Project");
const Learner = require("../Model/Learner");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");

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
          message: "User ID not found in token",
        });
      }

      // Verify project exists and user has access
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this project",
        });
      }

      // Get previous suggestions if regenerating
      let previousSuggestions = [];
      if (
        regenerate &&
        project.aiResponse &&
        project.aiResponse.previousSuggestions
      ) {
        previousSuggestions = project.aiResponse.previousSuggestions.map(
          (s) => s.text
        );
      }

      // Generate AI milestones
      const aiSuggestions = await generateMilestonesWithGemini(
        project,
        previousSuggestions
      );

      // Update project with AI suggestions
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $set: {
            "aiResponse.suggestions": aiSuggestions.map((text) => ({
              text,
              isCompleted: false,
            })),
            "aiResponse.lastGenerated": new Date(),
          },
          $push: {
            "aiResponse.previousSuggestions": {
              $each: aiSuggestions.map((text) => ({
                text,
                generatedAt: new Date(),
              })),
            },
          },
        },
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        suggestions: aiSuggestions,
        message: "AI milestones generated successfully",
      });
    } catch (error) {
      console.error("AI milestone generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate AI milestones",
        error: error.message,
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
          message: "User ID not found in token",
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this project",
        });
      }

      res.json({
        success: true,
        aiResponse: project.aiResponse || {
          suggestions: [],
          previousSuggestions: [],
        },
      });
    } catch (error) {
      console.error("Get AI milestones error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch AI milestones",
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
          message: "User ID not found in token",
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this project",
        });
      }

      // Toggle the completion status
      if (project.aiResponse && project.aiResponse.suggestions[index]) {
        project.aiResponse.suggestions[index].isCompleted =
          !project.aiResponse.suggestions[index].isCompleted;
        await project.save();
      }

      res.json({
        success: true,
        message: "Milestone toggled successfully",
      });
    } catch (error) {
      console.error("Toggle milestone error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle milestone",
      });
    }
  },

  // NEW: Generate image from text prompt
  async generateRealImage(req, res) {
    try {
      const { prompt } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Image prompt is required",
        });
      }

      // Initialize Gemini with new image generation model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      // Modify prompt to ensure only image generation (no text)
      const finalPrompt = `Please generate a realistic, high-quality image based on the following description. Do not provide any text explanation or description — only return an image.\n\n${prompt.trim()}`;

      // Generate image using Gemini with new API structure
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      });

      const parts = result.response.candidates[0].content.parts;

      // Find the image part in the response
      const imagePart = parts.find((p) => p.inlineData && p.inlineData.data);

      if (!imagePart) {
        return res.status(400).json({
          success: false,
          message: "No image generated from the prompt",
        });
      }

      // Extract base64 image data
      const base64Image = imagePart.inlineData.data;
      const buffer = Buffer.from(base64Image, "base64");

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "../uploads/temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Generate unique filename
      const fileName = `ai-generated-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.png`;
      const filePath = path.join(tempDir, fileName);

      // Save temp file
      fs.writeFileSync(filePath, buffer);

      try {
        // Upload to Cloudinary (overwrite previous if exists)
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: "temp-ai-images",
          public_id: `ai-temp-${Date.now()}`,
          overwrite: true,
          resource_type: "image",
          format: "png",
          // Set expiration for temp images (24 hours)
          expires_at: Math.floor(Date.now() / 1000) + 86400,
        });

        // Clean up temp file
        fs.unlinkSync(filePath);

        res.status(200).json({
          success: true,
          imageUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          originalPrompt: prompt,
          message: "Image generated successfully",
        });
      } catch (uploadError) {
        // Clean up temp file even if upload fails
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        throw uploadError;
      }
    } catch (error) {
      console.error("Real image generation failed:", error);

      // Handle specific Gemini API errors
      if (
        error.message?.includes("safety") ||
        error.message?.includes("policy")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image prompt violates safety guidelines. Please try a different description.",
        });
      }

      if (
        error.message?.includes("quota") ||
        error.message?.includes("limit") ||
        error.message?.includes("exceeded")
      ) {
        return res.status(429).json({
          success: false,
          message:
            "Daily AI image generation limit reached. Please try again tomorrow.",
        });
      }

      if (
        error.message?.includes("model") ||
        error.message?.includes("not found")
      ) {
        return res.status(503).json({
          success: false,
          message:
            "AI image generation service is temporarily unavailable. Please try again later.",
        });
      }

      res.status(500).json({
        success: false,
        message: "Image generation failed. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // NEW: Generate description from text prompt
  async generateDescriptionFromPrompt(req, res) {
    try {
      const { prompt, type = "both" } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Prompt is required",
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let descriptionPrompt = "";

      if (type === "short" || type === "both") {
        descriptionPrompt = `Create a compelling short description (50-100 words) for a project based on this prompt: "${prompt}"

Requirements:
- Concise and engaging
- Highlights key project value
- Technical but accessible
- Suitable for project listings
- No jargon or fluff

Return only the short description without any additional text or formatting.`;
      } else if (type === "long") {
        descriptionPrompt = `Create a comprehensive long description (200-400 words) for a project based on this prompt: "${prompt}"

Requirements:
- Detailed project overview
- Technical approach and methodology
- Expected outcomes and benefits
- Learning objectives
- Target audience considerations
- Professional and informative tone

Return only the long description without any additional text or formatting.`;
      } else if (type === "both") {
        descriptionPrompt = `Create both a short description (50-100 words) and a long description (200-400 words) for a project based on this prompt: "${prompt}"

Format your response as:
SHORT DESCRIPTION:
[short description here]

LONG DESCRIPTION:
[long description here]

Requirements:
- Short: Concise, engaging, highlights key value
- Long: Comprehensive, technical approach, learning objectives
- Both should be professional and informative
- No additional formatting or text`;
      }

      const result = await model.generateContent(descriptionPrompt);
      const response = await result.response;
      const generatedText = response.text();

      let shortDescription = "";
      let longDescription = "";

      if (type === "both") {
        // Parse the response to extract short and long descriptions
        const parts = generatedText.split("LONG DESCRIPTION:");
        if (parts.length === 2) {
          shortDescription = parts[0].replace("SHORT DESCRIPTION:", "").trim();
          longDescription = parts[1].trim();
        } else {
          // Fallback if parsing fails
          shortDescription = generatedText.substring(0, 200) + "...";
          longDescription = generatedText;
        }
      } else if (type === "short") {
        shortDescription = generatedText;
      } else if (type === "long") {
        longDescription = generatedText;
      }

      res.json({
        success: true,
        shortDescription: shortDescription,
        longDescription: longDescription,
        fullText: generatedText,
        originalPrompt: prompt,
        message: "Description generated successfully",
      });
    } catch (error) {
      console.error("Description generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate description",
        error: error.message,
      });
    }
  },
};

async function generateMilestonesWithGemini(
  projectData,
  previousSuggestions = []
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const previousText =
      previousSuggestions.length > 0
        ? `\n\nPREVIOUS SUGGESTIONS TO AVOID:\n${previousSuggestions
            .map((s, i) => `${i + 1}. ${s}`)
            .join("\n")}`
        : "";

    const prompt = `You are an AI project mentor helping learners break down their projects into manageable milestones.

PROJECT DETAILS:
- Name: ${projectData.name}
- Description: ${projectData.shortDescription}
- Full Description: ${projectData.fullDescription}
- Tech Stack: ${projectData.techStack.join(", ")}
- Category: ${projectData.category}
- Difficulty: ${projectData.difficultyLevel}
- Duration: ${projectData.duration}
- Expected Outcome: ${projectData.projectOutcome}
- Prerequisites: ${
      projectData.prerequisites ? projectData.prerequisites.join(", ") : "None"
    }
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
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }
    if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/```\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedResponse = JSON.parse(cleanResponse);

    if (
      !parsedResponse.milestones ||
      !Array.isArray(parsedResponse.milestones)
    ) {
      throw new Error("Invalid AI response structure");
    }

    return parsedResponse.milestones.slice(0, 5);
  } catch (error) {
    console.error("Gemini AI error:", error);

    // Fallback milestones
    return [
      "Set up project foundation and development environment",
      "Design and create basic user interface components",
      "Implement core functionality and business logic",
      "Add advanced features and external integrations",
      "Test thoroughly and deploy the final application",
    ];
  }
}

module.exports = aiMilestoneController;
