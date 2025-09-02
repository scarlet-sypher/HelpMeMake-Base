const Project = require("../Model/Project");
const Mentor = require("../Model/Mentor");

const checkMentorPitch = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const hasPitched =
      project.pitches?.some(
        (pitch) => pitch.mentor.toString() === req.user._id.toString()
      ) || false;

    const myPitch = hasPitched
      ? project.pitches.find(
          (pitch) => pitch.mentor.toString() === req.user._id.toString()
        )
      : null;

    res.json({
      success: true,
      hasApplied: hasPitched,
      myPitch: myPitch,
    });
  } catch (error) {
    console.error("Check mentor pitch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check pitch status",
    });
  }
};

const createPitchWithCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, note } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting pitches",
      });
    }

    const mentor = await Mentor.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email avatar"
    );
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can pitch to projects",
      });
    }

    const existingPitch = project.pitches?.find(
      (pitch) => pitch.mentor.toString() === req.user._id.toString()
    );

    if (existingPitch) {
      return res.status(409).json({
        success: false,
        message: "Already applied to this project",
      });
    }

    await project.addOrUpdatePitch(
      mentor.userId._id,
      parseFloat(price),
      note || ""
    );

    const updatedProject = await Project.findById(id).populate({
      path: "pitches.mentor",
      select: "name email avatar",
    });

    const latestPitch =
      updatedProject.pitches[updatedProject.pitches.length - 1];

    res.status(201).json({
      success: true,
      message: "Pitch submitted successfully!",
      pitch: latestPitch,
    });
  } catch (error) {
    console.error("Create pitch error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit pitch. Please try again.",
    });
  }
};

const getProjectAvgPitch = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const avgPitch =
      project.pitches && project.pitches.length > 0
        ? Math.round(
            project.pitches.reduce((sum, pitch) => sum + pitch.price, 0) /
              project.pitches.length
          )
        : 0;

    res.json({
      success: true,
      averagePrice: avgPitch,
      totalPitches: project.pitches?.length || 0,
    });
  } catch (error) {
    console.error("Get avg pitch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get average pitch",
    });
  }
};

module.exports = {
  checkMentorPitch,
  createPitchWithCheck,
  getProjectAvgPitch,
};
