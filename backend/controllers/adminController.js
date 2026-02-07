exports.getAIInsights = async (req, res) => {
  try {
    // We receive the stats calculated by the frontend
    console.log("👉 Backend received stats:", req.body);
    const stats = req.body.stats || req.body;

    // 1. Analyze Growth
    const currentUsers = stats.totalUsers;
    const engagement = stats.engagementRate || 0;
    let growthAnalysis = "";
    
    if (engagement > 50) {
      growthAnalysis = "User engagement is **exceptionally high**, indicating strong product-market fit.";
    } else if (engagement > 20) {
      growthAnalysis = "Engagement is stable, but there is room to improve daily active users.";
    } else {
      growthAnalysis = "Engagement is currently low. Focus on re-engagement campaigns.";
    }

    // 2. Analyze Skills
    // We safely check if the array exists before accessing [0]
    const topSkill = (stats.skillDemand && stats.skillDemand.length > 0) 
      ? stats.skillDemand[0].name 
      : "None";
      
    const skillAnalysis = topSkill !== "None" 
      ? `The most critical skill gap identified is **${topSkill}**. Recommending more courses in this area could boost user success.`
      : "No skill gaps detected yet.";

    // 3. Analyze Careers
    const topCareer = (stats.careerTrends && stats.careerTrends.length > 0) 
      ? stats.careerTrends[0].name 
      : "General Tech";
    
    // 4. Generate the "AI" Response Text
    const insightText = `
      **Executive Summary:** The platform currently hosts **${currentUsers} students**. ${growthAnalysis}
      
      **Strategic Recommendation:** Data indicates a high interest in **${topCareer}**. ${skillAnalysis}
      
      **Action Item:** Consider launching a targeted workshop for **${topSkill}** to address the immediate demand from students.
    `;

    res.json({
      success: true,
      analysis: insightText.trim()
    });

  } catch (error) {
    console.error("AI Insight Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate insights" });
  }
};