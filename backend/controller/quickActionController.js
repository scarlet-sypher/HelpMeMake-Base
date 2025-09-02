const QuickAction = require("../Model/QuickAction");

const DEFAULT_USER_ACTIONS = [
  {
    icon: "Calendar",
    label: "Schedule Session",
    color: "from-blue-500 to-cyan-500",
    path: "/user/sessions",
    ariaLabel: "Navigate to schedule a new mentoring session",
  },
  {
    icon: "PlayCircle",
    label: "Start Adventure",
    color: "from-purple-500 to-pink-500",
    path: "/user/projects",
    ariaLabel: "Navigate to start a new project adventure",
  },
  {
    icon: "Send",
    label: "Send Message",
    color: "from-emerald-500 to-teal-500",
    path: "/user/messages",
    ariaLabel: "Navigate to send a message to mentors",
  },
  {
    icon: "BarChart3",
    label: "View Analytics",
    color: "from-orange-500 to-red-500",
    path: "/user/analytics",
    ariaLabel: "Navigate to view your progress analytics",
  },
];

const DEFAULT_MENTOR_ACTIONS = [
  {
    icon: "Calendar",
    label: "Schedule Session",
    color: "from-blue-500 to-cyan-500",
    path: "/mentor/sessions",
    ariaLabel: "Navigate to schedule mentoring sessions",
  },
  {
    icon: "Users",
    label: "My Apprentices",
    color: "from-indigo-500 to-blue-500",
    path: "/mentor/my-apprentice",
    ariaLabel: "Navigate to manage your apprentices",
  },
  {
    icon: "Send",
    label: "Send Message",
    color: "from-emerald-500 to-teal-500",
    path: "/mentor/messages",
    ariaLabel: "Navigate to send messages to students",
  },
  {
    icon: "BarChart3",
    label: "View Analytics",
    color: "from-orange-500 to-red-500",
    path: "/mentor/analysis",
    ariaLabel: "Navigate to view mentoring analytics",
  },
];

const ALL_AVAILABLE_USER_ACTIONS = [
  {
    icon: "Calendar",
    label: "Schedule Session",
    color: "from-blue-500 to-cyan-500",
    path: "/user/sessions",
    ariaLabel: "Navigate to schedule a new mentoring session",
  },
  {
    icon: "PlayCircle",
    label: "Start Adventure",
    color: "from-purple-500 to-pink-500",
    path: "/user/projects",
    ariaLabel: "Navigate to start a new project adventure",
  },
  {
    icon: "Send",
    label: "Send Message",
    color: "from-emerald-500 to-teal-500",
    path: "/user/messages",
    ariaLabel: "Navigate to send a message to mentors",
  },
  {
    icon: "BarChart3",
    label: "View Analytics",
    color: "from-orange-500 to-red-500",
    path: "/user/analytics",
    ariaLabel: "Navigate to view your progress analytics",
  },
  {
    icon: "Settings",
    label: "Settings",
    color: "from-slate-500 to-gray-500",
    path: "/user/settings",
    ariaLabel: "Navigate to user settings",
  },
  {
    icon: "Award",
    label: "Achievements",
    color: "from-yellow-500 to-amber-500",
    path: "/user/achievements",
    ariaLabel: "Navigate to view your achievements",
  },
  {
    icon: "Users",
    label: "Find Mentor",
    color: "from-indigo-500 to-blue-500",
    path: "/user/mentor",
    ariaLabel: "Navigate to find a mentor",
  },
  {
    icon: "Target",
    label: "Milestones",
    color: "from-pink-500 to-rose-500",
    path: "/milestone-page",
    ariaLabel: "Navigate to milestone page",
  },
];

const ALL_AVAILABLE_MENTOR_ACTIONS = [
  {
    icon: "Calendar",
    label: "Schedule Session",
    color: "from-blue-500 to-cyan-500",
    path: "/mentor/sessions",
    ariaLabel: "Navigate to schedule mentoring sessions",
  },
  {
    icon: "Users",
    label: "My Apprentices",
    color: "from-indigo-500 to-blue-500",
    path: "/mentor/my-apprentice",
    ariaLabel: "Navigate to manage your apprentices",
  },
  {
    icon: "Send",
    label: "Messages",
    color: "from-emerald-500 to-teal-500",
    path: "/mentor/messages",
    ariaLabel: "Navigate to send messages to students",
  },
  {
    icon: "BarChart3",
    label: "Analytics",
    color: "from-orange-500 to-red-500",
    path: "/mentor/analysis",
    ariaLabel: "Navigate to view mentoring analytics",
  },
  {
    icon: "BookOpen",
    label: "Projects",
    color: "from-purple-500 to-pink-500",
    path: "/mentor/projects",
    ariaLabel: "Navigate to mentor projects",
  },
  {
    icon: "Target",
    label: "Milestones",
    color: "from-pink-500 to-rose-500",
    path: "/mentor/mileStone",
    ariaLabel: "Navigate to milestone management",
  },
  {
    icon: "Target",
    label: "Goals",
    color: "from-yellow-500 to-amber-500",
    path: "/mentor/goals",
    ariaLabel: "Navigate to goal management",
  },
  {
    icon: "Settings",
    label: "Settings",
    color: "from-slate-500 to-gray-500",
    path: "/mentor/settings",
    ariaLabel: "Navigate to mentor settings",
  },
];

const getRoleBasedActions = (userRole) => {
  console.log(`[DEBUG] Getting role-based actions for role: ${userRole}`); // debug

  if (userRole === "mentor") {
    return {
      defaultActions: DEFAULT_MENTOR_ACTIONS,
      availableActions: ALL_AVAILABLE_MENTOR_ACTIONS,
    };
  } else {
    return {
      defaultActions: DEFAULT_USER_ACTIONS,
      availableActions: ALL_AVAILABLE_USER_ACTIONS,
    };
  }
};

const getUserQuickActions = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log(
      `[DEBUG] Getting quick actions for user: ${userId}, role: ${userRole}`
    ); // debug

    const { defaultActions, availableActions } = getRoleBasedActions(userRole);

    const userQuickActions = await QuickAction.findOne({ userId });

    if (!userQuickActions || !userQuickActions.isCustomized) {
      console.log(
        `[DEBUG] User hasn't customized, returning defaults for ${userRole}`
      ); // debug

      return res.json({
        success: true,
        message: "Default quick actions retrieved",
        quickActions: defaultActions,
        isCustomized: false,
        availableActions: availableActions,
        userRole: userRole,
      });
    }

    console.log(
      `[DEBUG] User has ${userQuickActions.selectedActions.length} customized actions`
    ); // debug

    res.json({
      success: true,
      message: "User quick actions retrieved successfully",
      quickActions: userQuickActions.selectedActions,
      isCustomized: true,
      availableActions: availableActions,
      userRole: userRole,
    });
  } catch (error) {
    console.error("Get user quick actions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quick actions",
    });
  }
};

const getAvailableActions = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log(
      `[DEBUG] Getting available actions for user: ${userId}, role: ${userRole}`
    ); // debug

    const { availableActions } = getRoleBasedActions(userRole);

    res.json({
      success: true,
      message: "Available quick actions retrieved",
      availableActions: availableActions,
      userRole: userRole,
    });
  } catch (error) {
    console.error("Get available actions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve available actions",
    });
  }
};

const saveUserQuickActions = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { selectedActions } = req.body;

    console.log(
      `[DEBUG] Saving quick actions for user: ${userId}, role: ${userRole}`
    ); // debug
    console.log(`[DEBUG] Selected actions:`, selectedActions); // debug

    if (!selectedActions || !Array.isArray(selectedActions)) {
      return res.status(400).json({
        success: false,
        message: "Selected actions must be provided as an array",
      });
    }

    if (selectedActions.length === 0 || selectedActions.length > 4) {
      return res.status(400).json({
        success: false,
        message: "You must select between 1 and 4 quick actions",
      });
    }

    const { availableActions } = getRoleBasedActions(userRole);
    const validPaths = availableActions.map((action) => action.path);

    const invalidActions = selectedActions.filter(
      (action) => !validPaths.includes(action.path)
    );

    if (invalidActions.length > 0) {
      console.log(`[DEBUG] Invalid actions found:`, invalidActions); // debug
      return res.status(400).json({
        success: false,
        message: `Some selected actions are invalid for ${userRole} role`,
        invalidActions: invalidActions.map((action) => action.path),
      });
    }

    const updatedQuickActions = await QuickAction.findOneAndUpdate(
      { userId },
      {
        userId,
        selectedActions,
        isCustomized: true,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log(
      `[DEBUG] Successfully saved/updated quick actions for user: ${userId}, role: ${userRole}`
    ); // debug

    res.json({
      success: true,
      message: "Quick actions saved successfully!",
      quickActions: updatedQuickActions.selectedActions,
      isCustomized: true,
      userRole: userRole,
    });
  } catch (error) {
    console.error("Save user quick actions error:", error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: errorMessages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save quick actions. Please try again.",
    });
  }
};

const resetToDefault = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log(
      `[DEBUG] Resetting quick actions to default for user: ${userId}, role: ${userRole}`
    ); // debug

    const { defaultActions } = getRoleBasedActions(userRole);

    await QuickAction.findOneAndUpdate(
      { userId },
      {
        userId,
        selectedActions: defaultActions,
        isCustomized: false,
      },
      {
        upsert: true,
      }
    );

    console.log(
      `[DEBUG] Successfully reset to default for user: ${userId}, role: ${userRole}`
    ); // debug

    res.json({
      success: true,
      message: "Quick actions reset to default successfully!",
      quickActions: defaultActions,
      isCustomized: false,
      userRole: userRole,
    });
  } catch (error) {
    console.error("Reset quick actions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset quick actions. Please try again.",
    });
  }
};

module.exports = {
  getUserQuickActions,
  getAvailableActions,
  saveUserQuickActions,
  resetToDefault,
};
