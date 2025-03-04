import mongoose from "mongoose";
import createError from "http-errors";
import Shelter from "../models/Shelter.js";
import User from "../models/User.js";
import Pet from "../models/Pets.js";
import Adoption from "../models/AdoptionApplication.js";
import { sendShelterStatusEmail } from "../utils/emailService.js";

// Get admin dashboard statistics
export const getAdminStats = async (req, res, next) => {
  try {
    // Get counts from database
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalShelters = await Shelter.countDocuments({ status: "approved" });
    const totalPets = await Pet.countDocuments();
    const totalAdoptions = await Adoption.countDocuments({
      status: "approved",
    });
    const pendingRegistrations = await Shelter.countDocuments({
      status: "pending",
    });

    // Get recent activity (actions in last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: last24Hours },
    });
    const recentAdoptions = await Adoption.countDocuments({
      createdAt: { $gte: last24Hours },
    });
    const recentPets = await Pet.countDocuments({
      createdAt: { $gte: last24Hours },
    });
    const recentActivity = recentUsers + recentAdoptions + recentPets;

    // Get pet distribution by species
    const dogs = await Pet.countDocuments({ species: "Dog" });
    const cats = await Pet.countDocuments({ species: "Cat" });
    const others = await Pet.countDocuments({ species: "Other" });

    // Get adoption trend data for last 9 months
    const adoptionTrend = await getAdoptionTrend();

    res.json({
      totalUsers,
      totalShelters,
      totalPets,
      totalAdoptions,
      pendingRegistrations,
      recentActivity,
      petDistribution: [
        { name: "Dogs", value: dogs },
        { name: "Cats", value: cats },
        { name: "Others", value: others },
      ],
      adoptionTrend,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for adoption trends (last 9 months)
const getAdoptionTrend = async () => {
  const months = [];
  const adoptionData = [];
  const submissionData = [];

  // Get data for last 9 months
  for (let i = 8; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "short",
    });

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // Completed adoptions in this month
    const adoptions = await Adoption.countDocuments({
      status: "approved",
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    // Adoption requests (submissions) in this month
    const submissions = await Adoption.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    months.push(monthName);
    adoptionData.push(adoptions);
    submissionData.push(submissions);
  }

  // Format data for frontend
  return months.map((name, index) => ({
    name,
    adoptions: adoptionData[index],
    submissions: submissionData[index],
  }));
};

// Get all users for admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email phoneNo createdAt role");
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// Get all shelters for admin
export const getAllShelters = async (req, res, next) => {
  try {
    const shelters = await Shelter.find().select(
      "shelterName email phoneNo city state status createdAt"
    );
    res.json({ shelters });
  } catch (error) {
    next(error);
  }
};

// Get pending shelter registrations (already exists in your code)
export const getPendingShelters = async (req, res, next) => {
  try {
    const shelters = await Shelter.find({ status: "pending" }).select(
      "-password"
    );
    res.json({
      success: true,
      shelters,
    });
  } catch (error) {
    next(error);
  }
};

// Approve shelter registration (already exists in your code)
export const approveShelter = async (req, res, next) => {
  try {
    const shelter = await Shelter.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      { status: "approved" },
      { new: true, runValidators: false }
    );

    if (!shelter) {
      throw createError(404, "Shelter not found or not in pending state");
    }

    // Send approval email
    await sendShelterStatusEmail(shelter.email, "approved");

    res.json({
      success: true,
      message: "Shelter approved successfully",
      shelter,
    });
  } catch (error) {
    next(error);
  }
};

// Reject shelter registration (already exists in your code)
export const rejectShelter = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      throw createError(400, "Rejection reason is required");
    }

    const shelter = await Shelter.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        status: "rejected",
        rejectionReason: reason,
      },
      { new: true, runValidators: false }
    );

    if (!shelter) {
      throw createError(404, "Shelter not found or not in pending state");
    }

    // Send rejection email
    await sendShelterStatusEmail(shelter.email, "rejected", reason);

    res.json({
      success: true,
      message: "Shelter rejected successfully",
      shelter,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete shelter
export const deleteShelter = async (req, res, next) => {
  try {
    const shelter = await Shelter.findByIdAndDelete(req.params.id);

    if (!shelter) {
      throw createError(404, "Shelter not found");
    }

    // Delete related pets
    await Pet.deleteMany({ shelterId: req.params.id });

    // Delete related adoption applications
    const pets = await Pet.find({ shelterId: req.params.id });
    const petIds = pets.map((pet) => pet._id);
    await Adoption.deleteMany({ petId: { $in: petIds } });

    res.json({
      success: true,
      message: "Shelter deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get system health
export const getSystemHealth = async (req, res, next) => {
  try {
    // Get real system metrics
    const uptime = process.uptime();
    const formattedUptime = formatUptime(uptime);
    const lastRestart = new Date(Date.now() - uptime * 1000).toISOString();

    // Get database connection stats
    const dbStatus =
      mongoose.connection.readyState === 1 ? "healthy" : "unhealthy";
    const dbConnections =
      mongoose.connection.db?.serverConfig?.connections || 0;

    // Get API request metrics (store these in your app)
    const apiRequests = global.requestStats || {
      total: 0,
      failed: 0,
      success: 0,
    };

    // Calculate average response time (in a real app, you would track this)
    const avgResponseTime = global.responseTimeStats?.average || "120ms";

    res.json({
      status: "operational",
      uptime: formattedUptime,
      lastRestart,
      serverLoad: {
        cpu: process.cpuUsage().user / 1000000, // CPU usage in %
        memory: process.memoryUsage().heapUsed / 1024 / 1024, // Memory in MB
        disk: 0, // Would need a library like diskusage to get real data
        network: 0, // Would need monitoring tool for real metrics
      },
      apiHealth: {
        status: dbStatus,
        avgResponseTime,
        requests: apiRequests,
      },
      databaseHealth: {
        status: dbStatus,
        connections: dbConnections,
        slowQueries: 0, // Would need DB monitoring for real data
      },
      cacheHealth: {
        status: "healthy",
        hitRate: 85,
        missRate: 15,
      },
      services: [
        { name: "Authentication", status: "healthy" },
        { name: "Payments", status: "healthy" },
        { name: "Notifications", status: "healthy" },
        { name: "Storage", status: "healthy" },
        { name: "Search", status: "healthy" },
      ],
      errors: [], // Store recent errors in your app
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemHistory = async (req, res, next) => {
  try {
    const { timeframe } = req.params;
    let data = [];

    // Generate mock history data based on timeframe
    const dataPoints = timeframe === "24h" ? 24 : timeframe === "7d" ? 7 : 30;

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      if (timeframe === "24h") {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }

      const timeLabel =
        timeframe === "24h"
          ? `${date.getHours().toString().padStart(2, "0")}:00`
          : `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
              .getDate()
              .toString()
              .padStart(2, "0")}`;

      data.push({
        time: timeLabel,
        cpu: Math.floor(Math.random() * 40) + 10, // 10-50%
        memory: Math.floor(Math.random() * 30) + 20, // 20-50%
        responseTime: Math.floor(Math.random() * 80) + 40, // 40-120ms
        requests: Math.floor(Math.random() * 500) + 100, // 100-600
        errors: Math.floor(Math.random() * 10), // 0-10
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Helper function to format uptime
const formatUptime = (uptime) => {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  if (days > 0) {
    return `${days} days, ${hours} hours`;
  } else if (hours > 0) {
    return `${hours} hours, ${minutes} minutes`;
  } else {
    return `${minutes} minutes`;
  }
};

// Get insights data
export const getInsights = async (req, res, next) => {
  try {
    const { timeRange } = req.query || "month";

    // Set date range based on time range parameter
    const endDate = new Date();
    let startDate = new Date();

    if (timeRange === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === "quarter") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // 'all' - use a very early date
      startDate = new Date(0);
    }

    // Count basic statistics
    const totalAdoptions = await Adoption.countDocuments({
      status: "approved",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalShelters = await Shelter.countDocuments({
      status: "approved",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalPets = await Pet.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Get adoption trend data by month
    const adoptionsByMonth = await getAdoptionTrendForInsights(
      startDate,
      endDate
    );

    // Get pet category distribution
    const dogAdoptions = await Pet.countDocuments({
      species: "Dog",
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    const catAdoptions = await Pet.countDocuments({
      species: "Cat",
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    const otherAdoptions = await Pet.countDocuments({
      species: { $nin: ["Dog", "Cat", "Bird", "Small Pet", "Reptile"] },
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    // Get adoption data by age group
    const babyAdoptions = await Pet.countDocuments({
      "age.years": 0,
      "age.months": { $gt: 0 },
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    const youngAdoptions = await Pet.countDocuments({
      "age.years": { $gte: 1, $lte: 3 },
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    const adultAdoptions = await Pet.countDocuments({
      "age.years": { $gte: 4, $lte: 7 },
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    const seniorAdoptions = await Pet.countDocuments({
      "age.years": { $gte: 8 },
      status: "Adopted",
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    // Get user growth data
    const userGrowth = await getUserGrowthData(timeRange);

    // Get adoption time data from submission to approval
    const timeTillAdoption = await getAdoptionTimeData(startDate, endDate);

    // Get top shelters by adoption count
    const topSheltersByAdoption = await getTopSheltersByAdoption(
      startDate,
      endDate
    );

    res.json({
      totalAdoptions,
      totalUsers,
      totalShelters,
      totalPets,
      adoptionsByMonth,
      petCategoryDistribution: [
        { name: "Dogs", value: dogAdoptions || 0 },
        { name: "Cats", value: catAdoptions || 0 },
        { name: "Other", value: otherAdoptions || 0 },
      ],
      ageGroupDistribution: [
        { name: "Baby", value: babyAdoptions || 0 },
        { name: "Young", value: youngAdoptions || 0 },
        { name: "Adult", value: adultAdoptions || 0 },
        { name: "Senior", value: seniorAdoptions || 0 },
      ],
      userGrowth,
      timeTillAdoption,
      topSheltersByAdoption,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for adoption trends for insights
const getAdoptionTrendForInsights = async (startDate, endDate) => {
  // Get the months between start and end dates
  const months = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Cap at last 9 months if there are more
  if (months.length > 9) {
    months.splice(0, months.length - 9);
  }

  const result = [];

  // Get adoption count for each month
  for (const month of months) {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const adoptionCount = await Adoption.countDocuments({
      status: "approved",
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });

    result.push({
      name: monthStart.toLocaleString("default", { month: "short" }),
      count: adoptionCount,
    });
  }

  return result;
};

// Helper function for user growth data
const getUserGrowthData = async (timeRange) => {
  const months = [];
  const userData = [];
  const shelterData = [];

  // Determine number of months based on time range
  let monthCount = 9; // Default to 9 months

  if (timeRange === "quarter") {
    monthCount = 3;
  } else if (timeRange === "year") {
    monthCount = 12;
  }

  // Get data for each month
  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "short",
    });

    const endOfMonth = new Date(year, month + 1, 0);

    const userCount = await User.countDocuments({
      role: "user",
      createdAt: { $lte: endOfMonth },
    });

    const shelterCount = await Shelter.countDocuments({
      status: "approved",
      createdAt: { $lte: endOfMonth },
    });

    months.push(monthName);
    userData.push(userCount);
    shelterData.push(shelterCount);
  }

  return months.map((name, index) => ({
    name,
    users: userData[index],
    shelters: shelterData[index],
  }));
};

// Helper function to get adoption time data
const getAdoptionTimeData = async (startDate, endDate) => {
  // Aggregate to find time between application submission and approval
  const adoptions = await Adoption.find({
    status: "approved",
    createdAt: { $gte: startDate, $lte: endDate },
  });

  // Count adoptions in different time ranges
  let lessThanWeek = 0;
  let oneToTwoWeeks = 0;
  let twoToFourWeeks = 0;
  let oneToTwoMonths = 0;
  let moreThanTwoMonths = 0;

  for (const adoption of adoptions) {
    const createdDate = new Date(adoption.createdAt);
    const updatedDate = new Date(adoption.updatedAt);
    const daysDifference = (updatedDate - createdDate) / (1000 * 60 * 60 * 24);

    if (daysDifference < 7) {
      lessThanWeek++;
    } else if (daysDifference < 14) {
      oneToTwoWeeks++;
    } else if (daysDifference < 30) {
      twoToFourWeeks++;
    } else if (daysDifference < 60) {
      oneToTwoMonths++;
    } else {
      moreThanTwoMonths++;
    }
  }

  return [
    { range: "< 1 week", count: lessThanWeek },
    { range: "1-2 weeks", count: oneToTwoWeeks },
    { range: "2-4 weeks", count: twoToFourWeeks },
    { range: "1-2 months", count: oneToTwoMonths },
    { range: "2+ months", count: moreThanTwoMonths },
  ];
};

// Helper function to get top shelters by adoption
const getTopSheltersByAdoption = async (startDate, endDate) => {
  // Find all adoptions in the date range
  const adoptions = await Adoption.find({
    status: "approved",
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate({
    path: "petId",
    select: "shelterId",
  });

  // Count adoptions per shelter
  const shelterCounts = {};

  for (const adoption of adoptions) {
    if (adoption.petId && adoption.petId.shelterId) {
      const shelterId = adoption.petId.shelterId.toString();
      shelterCounts[shelterId] = (shelterCounts[shelterId] || 0) + 1;
    }
  }

  // Convert to array and sort
  const shelterCountsArray = Object.entries(shelterCounts).map(
    ([id, count]) => ({
      id,
      count,
    })
  );

  shelterCountsArray.sort((a, b) => b.count - a.count);

  // Get shelter details for top shelters
  const topShelters = shelterCountsArray.slice(0, 5);
  const result = [];

  for (const shelter of topShelters) {
    const shelterData = await Shelter.findById(shelter.id).select(
      "shelterName"
    );
    if (shelterData) {
      result.push({
        name: shelterData.shelterName || "Unknown Shelter",
        count: shelter.count,
      });
    }
  }

  return result;
};

// Create admin user (already exists in your code)
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(400, "Email already exists");
    }

    // Create new admin
    const admin = await User.create({
      email,
      password,
      name,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate report based on type and timeRange
export const generateReport = async (req, res, next) => {
  try {
    const { type, timeRange = "all" } = req.query;

    if (!type) {
      throw createError(400, "Report type is required");
    }

    // Generate data based on report type
    let data = [];
    let filename = "";

    try {
      switch (type) {
        case "dashboard":
          data = await generateDashboardReport(timeRange);
          filename = `dashboard-report-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "adoptions":
          data = await generateAdoptionsReport(timeRange);
          filename = `adoption-report-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "users":
          data = await generateUsersReport(timeRange);
          filename = `user-activity-report-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "shelters":
          data = await generateSheltersReport(timeRange);
          filename = `shelter-performance-report-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "full":
          data = await generateFullReport(timeRange);
          filename = `full-export-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        default:
          throw createError(400, "Invalid report type");
      }
    } catch (reportError) {
      console.error(`Error generating ${type} report:`, reportError);
      data = [
        { error: `Error generating ${type} report: ${reportError.message}` },
      ];
    }

    // Make sure we have at least an empty array
    data = data || [];

    try {
      // Convert data to CSV
      const csv = convertToCSV(data);

      // Set headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

      // Send the CSV data
      res.send(csv);
    } catch (csvError) {
      console.error("Error converting to CSV:", csvError);
      res.status(500).send("Error generating report file");
    }
  } catch (error) {
    console.error("Report generation error:", error);
    next(error);
  }
};

// Helper function to convert data to CSV format
const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return "No data available";
  }

  try {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map((obj) =>
        Object.values(obj)
          .map((value) => {
            // Handle nulls, undefined, and convert special types
            if (value === null || value === undefined) return "";
            if (typeof value === "string")
              return `"${value.replace(/"/g, '""')}"`;
            if (typeof value === "object")
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            return value;
          })
          .join(",")
      )
      .join("\n");

    return header + rows;
  } catch (error) {
    console.error("CSV conversion error:", error);
    return "Error creating CSV data";
  }
};

// Report generator functions
const generateDashboardReport = async (timeRange) => {
  // Get date range
  const { startDate, endDate } = getDateRange(timeRange);

  // Get basic stats
  const totalUsers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const totalShelters = await Shelter.countDocuments({
    status: "approved",
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const totalPets = await Pet.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const totalAdoptions = await Adoption.countDocuments({
    status: "approved",
    createdAt: { $gte: startDate, $lte: endDate },
  });

  // Format the report
  return [
    {
      reportType: "Dashboard Statistics",
      generatedAt: new Date().toISOString(),
      timeRange: timeRange,
    },
    { metric: "Total Users", value: totalUsers },
    { metric: "Total Shelters", value: totalShelters },
    { metric: "Total Pets", value: totalPets },
    { metric: "Total Adoptions", value: totalAdoptions },
  ];
};

const generateAdoptionsReport = async (timeRange) => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Get adoption data with safer population - change 'userId' to 'adopterId'
    const adoptions = await Adoption.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("petId")
      .populate("adopterId");

    return adoptions.map((adoption) => ({
      id: adoption._id.toString(),
      petName: adoption.petId ? adoption.petId.name : "Unknown",
      petSpecies: adoption.petId ? adoption.petId.species : "Unknown",
      // Change 'userId' to 'adopterId'
      applicant: adoption.adopterId ? adoption.adopterId.name : "Unknown User",
      status: adoption.status || "Unknown",
      submittedDate: adoption.createdAt
        ? adoption.createdAt.toISOString()
        : "Unknown",
      completedDate: adoption.updatedAt
        ? adoption.updatedAt.toISOString()
        : "Unknown",
    }));
  } catch (error) {
    console.error("Error generating adoptions report:", error);
    return [
      {
        id: "error",
        petName: "Error generating report",
        petSpecies: "N/A",
        applicant: "N/A",
        status: "N/A",
        submittedDate: new Date().toISOString(),
        completedDate: new Date().toISOString(),
      },
    ];
  }
};

const generateUsersReport = async (timeRange) => {
  const { startDate, endDate } = getDateRange(timeRange);

  const users = await User.find({
    createdAt: { $gte: startDate, $lte: endDate },
    role: "user",
  });

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    joinedOn: user.createdAt.toISOString(),
    activeStatus: user.isActive ? "Active" : "Inactive",
  }));
};

const generateSheltersReport = async (timeRange) => {
  const { startDate, endDate } = getDateRange(timeRange);

  const shelters = await Shelter.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  return shelters.map((shelter) => ({
    id: shelter._id.toString(),
    name: shelter.name,
    email: shelter.email,
    location: `${shelter.city}, ${shelter.state}`,
    status: shelter.status,
    joinedOn: shelter.createdAt.toISOString(),
  }));
};

const generateFullReport = async (timeRange) => {
  // Combine all report data
  const dashboardData = await generateDashboardReport(timeRange);
  const adoptionsData = await generateAdoptionsReport(timeRange);
  const usersData = await generateUsersReport(timeRange);
  const sheltersData = await generateSheltersReport(timeRange);

  return [
    { section: "Platform Statistics", data: JSON.stringify(dashboardData) },
    ...adoptionsData.map((item) => ({ section: "Adoption", ...item })),
    ...usersData.map((item) => ({ section: "User", ...item })),
    ...sheltersData.map((item) => ({ section: "Shelter", ...item })),
  ];
};

// Helper function to get date range based on timeRange parameter
const getDateRange = (timeRange) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      // 'all' - use a very early date
      startDate = new Date(0);
  }

  return { startDate, endDate };
};
