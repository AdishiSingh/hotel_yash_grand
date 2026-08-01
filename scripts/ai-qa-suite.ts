import prisma from "../src/lib/prisma";
import { AiAnalyticsService } from "../src/services/ai-analytics.service";
import { PredictiveAiService } from "../src/services/predictive-ai.service";
import { processSadyaQuery } from "../src/ai/assistant/chatEngine";

async function runAiQaSuite() {
  console.log("\n=======================================================");
  console.log("🤖 HOTEL YASH GRAND — AI & ML SYSTEM QA SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, failureReason?: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ PASSED: ${testName}`);
    } else {
      failed++;
      console.log(`  ❌ FAILED: ${testName} - ${failureReason}`);
    }
  }

  try {
    // ----------------------------------------------------
    // 1. BUSINESS INTELLIGENCE AI SERVICE
    // ----------------------------------------------------
    console.log("1. Testing Business Intelligence AI Service...");

    const startTime = Date.now();
    const biAnalytics = await AiAnalyticsService.generateAiAnalytics();
    const biLatency = Date.now() - startTime;

    assert(biAnalytics.kpis.revenueGrowthPercent !== undefined, "BI Revenue Growth % computed");
    assert(biAnalytics.kpis.occupancyGrowthPercent >= 0, "BI Occupancy Index % computed");
    assert(biAnalytics.insights.length >= 4, "Generated 4+ data-driven AI Insights");
    assert(!!biAnalytics.recommendations.increaseOccupancy, "Generated Occupancy Strategy Playbook");
    assert(biLatency < 300, `BI Execution Latency is fast (${biLatency}ms)`);

    // ----------------------------------------------------
    // 2. SADYA AI CONCIERGE ENGINE
    // ----------------------------------------------------
    console.log("\n2. Testing SADYA AI Concierge Engine...");

    // Test Menu Intent
    const menuResp = await processSadyaQuery("what is on the dining menu?");
    assert(menuResp.answer.includes("menu") || menuResp.dishes !== undefined, "SADYA answered Menu Query with live dishes");

    // Test Room Rates Intent
    const roomResp = await processSadyaQuery("how much does a room cost?");
    assert(roomResp.answer.includes("Room") || roomResp.answer.includes("suite"), "SADYA answered Room Price Query with live rates");

    // Test Banquet Intent
    const banquetResp = await processSadyaQuery("tell me about banquet hall for wedding");
    assert(banquetResp.answer.includes("Ballroom") || banquetResp.answer.includes("guests"), "SADYA answered Banquet Wedding Query");

    // Test Human Staff Escalation
    const escalationResp = await processSadyaQuery("I want to speak with a human manager");
    assert(escalationResp.isEscalated === true, "SADYA correctly triggered Human Staff Escalation flow");

    // ----------------------------------------------------
    // 3. PREDICTIVE MACHINE LEARNING FORECASTING
    // ----------------------------------------------------
    console.log("\n3. Testing Predictive Machine Learning Suite...");

    const mlStartTime = Date.now();
    const predictions = await PredictiveAiService.runPredictivePipeline();
    const mlLatency = Date.now() - mlStartTime;

    assert(predictions.length >= 5, "ML Pipeline generated 5 target module forecasts");
    assert(predictions.every((p) => p.confidenceScore > 80), "All ML Forecasts meet high confidence threshold (>80%)");
    assert(predictions.every((p) => p.explainableReason.includes("Feature Weights")), "All ML Forecasts include Explainable AI (XAI) feature weightings");
    assert(mlLatency < 400, `ML Pipeline Execution Latency is fast (${mlLatency}ms)`);

    // ----------------------------------------------------
    // 4. DATABASE INTEGRITY & HISTORICAL LOGS
    // ----------------------------------------------------
    console.log("\n4. Testing PostgreSQL Database Records & Audit Logs...");

    const savedPredictionsCount = await prisma.prediction.count();
    assert(savedPredictionsCount > 0, "Prediction history stored in PostgreSQL database");

    const auditLogsCount = await prisma.auditLog.count({
      where: { action: { in: ["SADYA_AI_CONCIERGE_QUERY", "PREDICTIVE_ML_JOB_EXECUTED"] } },
    });
    assert(auditLogsCount > 0, "AI & ML interactions logged in PostgreSQL audit_logs table");

    console.log("\n=======================================================");
    console.log(`📊 AI QA SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Fatal error during AI QA test execution:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAiQaSuite();
