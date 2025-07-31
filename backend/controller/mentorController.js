const Mentor = require('../Model/Mentor');
const User = require('../Model/User');

// Get All Available Mentors
const getAllMentors = async (req, res) => {
  try {
    // Query parameters for filtering (optional)
    const { 
      category, 
      expertise, 
      minRating, 
      maxPrice, 
      isOnline, 
      sortBy = 'rating',
      sortOrder = 'desc',
      limit = 50 
    } = req.query;

    // Build filter object
    let filter = { isAvailable: true };

    // Add category filter if provided
    if (category) {
      filter['expertise.skill'] = { $regex: category, $options: 'i' };
    }

    // Add expertise filter if provided
    if (expertise) {
      filter['expertise.skill'] = { $regex: expertise, $options: 'i' };
    }

    // Add rating filter if provided
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Add price filter if provided
    if (maxPrice) {
      filter['pricing.hourlyRate'] = { $lte: parseFloat(maxPrice) };
    }

    // Add online status filter if provided
    if (isOnline !== undefined) {
      filter.isOnline = isOnline === 'true';
    }

    // Build sort object
    let sort = {};
    const validSortFields = ['rating', 'totalStudents', 'completedSessions', 'responseTime', 'pricing.hourlyRate', 'createdAt'];
    
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.rating = -1; // Default sort by rating desc
    }

    // Execute query
    const mentors = await Mentor.find(filter)
      .populate('userId', 'name email avatar isEmailVerified')
      .sort(sort)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance

    // Filter out mentors whose user accounts are not active/verified
    const activeMentors = mentors.filter(mentor => 
      mentor.userId && 
      mentor.userId.isEmailVerified
    );

    // Format response data
    const formattedMentors = activeMentors.map(mentor => {
      // Calculate profile completeness if not already calculated
      let profileCompleteness = mentor.profileCompleteness;
      if (profileCompleteness < 50) {
        profileCompleteness = calculateProfileCompleteness(mentor);
      }

      return {
        _id: mentor._id,
        userId: mentor.userId,
        title: mentor.title,
        description: mentor.description,
        bio: mentor.bio,
        location: mentor.location,
        experience: mentor.experience,
        expertise: mentor.expertise,
        specializations: mentor.specializations,
        isOnline: mentor.isOnline,
        isAvailable: mentor.isAvailable,
        rating: mentor.rating,
        totalReviews: mentor.totalReviews,
        socialLinks: mentor.socialLinks,
        completedSessions: mentor.completedSessions,
        totalStudents: mentor.totalStudents,
        responseTime: mentor.responseTime,
        badges: mentor.badges,
        achievements: mentor.achievements,
        pricing: mentor.pricing,
        availability: mentor.availability,
        verification: {
          isVerified: mentor.verification?.isVerified || false,
          verificationLevel: mentor.verification?.verificationLevel || 'none'
        },
        teachingPreferences: mentor.teachingPreferences,
        joinDate: mentor.joinDate,
        profileCompleteness,
        // Virtual fields
        successRate: mentor.completedSessions > 0 
          ? Math.floor((mentor.completedSessions / (mentor.completedSessions + 2)) * 100) 
          : 85, // Default success rate for new mentors
        primaryExpertise: mentor.expertise
          ?.filter(exp => exp.level === 'expert' || exp.level === 'advanced')
          ?.map(exp => exp.skill)
          ?.slice(0, 3) || []
      };
    });

    // Sort by profile completeness and rating for better quality results
    const sortedMentors = formattedMentors.sort((a, b) => {
      // First priority: profile completeness (minimum 60%)
      if (a.profileCompleteness >= 60 && b.profileCompleteness < 60) return -1;
      if (a.profileCompleteness < 60 && b.profileCompleteness >= 60) return 1;
      
      // Second priority: rating
      if (a.rating !== b.rating) return b.rating - a.rating;
      
      // Third priority: total students
      return b.totalStudents - a.totalStudents;
    });

    res.json({
      success: true,
      message: 'Mentors retrieved successfully',
      mentors: sortedMentors,
      count: sortedMentors.length,
      filters: {
        category,
        expertise,
        minRating,
        maxPrice,
        isOnline,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get all mentors error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentors. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to calculate profile completeness
const calculateProfileCompleteness = (mentor) => {
  let completeness = 20; // Base for having a profile
  
  if (mentor.bio && mentor.bio.length > 50) completeness += 15;
  if (mentor.expertise && mentor.expertise.length > 0) completeness += 20;
  if (mentor.experience?.companies && mentor.experience.companies.length > 0) completeness += 15;
  if (mentor.socialLinks?.linkedin && mentor.socialLinks.linkedin !== '#') completeness += 10;
  if (mentor.pricing?.hourlyRate && mentor.pricing.hourlyRate > 0) completeness += 10;
  if (mentor.availability?.weeklyHours && mentor.availability.weeklyHours.length > 0) completeness += 10;
  
  return Math.min(completeness, 100);
};

// Get Mentor by ID (detailed view)
const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }

    const mentor = await Mentor.findById(id)
      .populate('userId', 'name email avatar isEmailVerified createdAt')
      .populate('reviews.learnerId', 'name avatar');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if mentor's user account is active
    if (!mentor.userId || !mentor.userId.isEmailVerified) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile is not available'
      });
    }

    res.json({
      success: true,
      message: 'Mentor retrieved successfully',
      mentor
    });

  } catch (error) {
    console.error('Get mentor by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentor'
    });
  }
};

// Search Mentors by Skills/Categories
const searchMentors = async (req, res) => {
  try {
    const { query, category, skills } = req.query;

    if (!query && !category && !skills) {
      return res.status(400).json({
        success: false,
        message: 'Search query, category, or skills parameter is required'
      });
    }

    let searchFilter = { isAvailable: true };

    // Build search conditions
    const searchConditions = [];

    if (query) {
      searchConditions.push(
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { 'expertise.skill': { $regex: query, $options: 'i' } },
        { specializations: { $regex: query, $options: 'i' } }
      );
    }

    if (category) {
      searchConditions.push(
        { 'expertise.skill': { $regex: category, $options: 'i' } }
      );
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      searchConditions.push(
        { 'expertise.skill': { $in: skillsArray.map(skill => new RegExp(skill, 'i')) } }
      );
    }

    if (searchConditions.length > 0) {
      searchFilter.$or = searchConditions;
    }

    const mentors = await Mentor.find(searchFilter)
      .populate('userId', 'name email avatar isEmailVerified')
      .sort({ rating: -1, totalStudents: -1 })
      .limit(20)
      .lean();

    // Filter active mentors
    const activeMentors = mentors.filter(mentor => 
      mentor.userId && mentor.userId.isEmailVerified
    );

    res.json({
      success: true,
      message: 'Search completed successfully',
      mentors: activeMentors,
      count: activeMentors.length,
      searchTerms: { query, category, skills }
    });

  } catch (error) {
    console.error('Search mentors error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.'
    });
  }
};

// Get Mentor Statistics (for admin/analytics)
const getMentorStats = async (req, res) => {
  try {
    const stats = await Mentor.aggregate([
      {
        $group: {
          _id: null,
          totalMentors: { $sum: 1 },
          activeMentors: { $sum: { $cond: ['$isAvailable', 1, 0] } },
          onlineMentors: { $sum: { $cond: ['$isOnline', 1, 0] } },
          averageRating: { $avg: '$rating' },
          totalSessions: { $sum: '$completedSessions' },
          totalStudents: { $sum: '$totalStudents' }
        }
      }
    ]);

    const categoryStats = await Mentor.aggregate([
      { $unwind: '$expertise' },
      {
        $group: {
          _id: '$expertise.skill',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      message: 'Mentor statistics retrieved successfully',
      stats: stats[0] || {
        totalMentors: 0,
        activeMentors: 0,
        onlineMentors: 0,
        averageRating: 0,
        totalSessions: 0,
        totalStudents: 0
      },
      categoryStats
    });

  } catch (error) {
    console.error('Get mentor stats error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentor statistics'
    });
  }
};

module.exports = {
  getAllMentors,
  getMentorById,
  searchMentors,
  getMentorStats
};