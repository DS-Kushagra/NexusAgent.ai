"use server";

import jsPDF from "jspdf";
import dayjs from "dayjs";

// Modern PDF Generation Service with Enhanced Visuals

export async function generateFeedbackPDF(params: {
  userName: string;
  userEmail: string;
  interview: {
    role: string;
    level: string;
    type: string;
    techstack: string[];
  };
  feedback: {
    totalScore: number;
    categoryScores: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
  };
}): Promise<Buffer> {
  const { userName, userEmail, interview, feedback } = params;

  // Create new PDF document with better styling
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;
  let pageNumber = 1;

  // Helper functions
  const addText = (
    text: string,
    fontSize: number = 10,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0]
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;

    if (yPosition + lines.length * lineHeight > pageHeight - 35) {
      addFooter();
      doc.addPage();
      pageNumber++;
      yPosition = margin + 10;
    }

    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 2;
  };

  const addSpace = (space: number = 5) => {
    yPosition += space;
  };

  const addLine = (color: [number, number, number] = [230, 230, 230]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `NexusAgent.ai © ${new Date().getFullYear()} | AI-Powered Interview Coach`,
      margin,
      pageHeight - 15
    );
    doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 15, {
      align: "right",
    });
  };

  // Modern gradient header with shadow effect
  const gradient = [
    { y: 0, color: [79, 70, 229] }, // Indigo
    { y: 15, color: [99, 102, 241] },
    { y: 30, color: [129, 140, 248] },
    { y: 45, color: [165, 180, 252] },
  ];

  gradient.forEach((g) => {
    doc.setFillColor(g.color[0], g.color[1], g.color[2]);
    doc.rect(0, g.y, pageWidth, 15, "F");
  });

  // Header content with modern design
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("NexusAgent.ai", margin, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("INTERVIEW FEEDBACK REPORT", margin, 32);

  // Date badge
  doc.setFillColor(255, 255, 255, 0.2);
  doc.roundedRect(pageWidth - margin - 50, 12, 48, 10, 2, 2, "F");
  doc.setFontSize(8);
  doc.text(
    dayjs(feedback.createdAt).format("MMM DD, YYYY"),
    pageWidth - margin - 26,
    19,
    { align: "center" }
  );

  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // Candidate Information Card with modern design
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, yPosition, contentWidth, 32, 3, 3, "F");
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, contentWidth, 32, 3, 3, "S");

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("CANDIDATE", margin + 5, yPosition);

  yPosition += 6;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(userName, margin + 5, yPosition);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  yPosition += 5;
  doc.text(`Email: ${userEmail}`, margin + 5, yPosition);

  yPosition += 5;
  doc.text(
    `Date: ${dayjs(feedback.createdAt).format("MMMM D, YYYY [at] h:mm A")}`,
    margin + 5,
    yPosition
  );

  yPosition += 15;

  // Interview Details Card
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "F");
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "S");

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("INTERVIEW DETAILS", margin + 5, yPosition);

  yPosition += 7;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(`Position: ${interview.role}`, margin + 5, yPosition);

  const colX = margin + contentWidth / 2;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(`Level: ${interview.level}`, margin + 5, yPosition + 5);
  doc.text(`Type: ${interview.type}`, colX, yPosition + 5);

  yPosition += 10;
  const techText = interview.techstack.join(", ") || "General";
  const wrappedTech = doc.splitTextToSize(
    `Tech Stack: ${techText}`,
    contentWidth - 10
  );
  doc.text(wrappedTech, margin + 5, yPosition);
  yPosition += wrappedTech.length * 4 + 8;

  // Overall Score Card with modern circular progress
  const scoreCardHeight = 45;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, yPosition, contentWidth, scoreCardHeight, 3, 3, "F");

  // Gradient border based on score
  const scoreColor =
    feedback.totalScore >= 70
      ? [34, 197, 94]
      : feedback.totalScore >= 50
      ? [234, 179, 8]
      : [239, 68, 68];

  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(2);
  doc.roundedRect(margin, yPosition, contentWidth, scoreCardHeight, 3, 3, "S");

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("OVERALL PERFORMANCE", margin + 10, yPosition);

  // Circular score indicator
  const circleX = pageWidth - margin - 40;
  const circleY = yPosition + 15;
  const radius = 15;

  // Background circle
  doc.setFillColor(243, 244, 246);
  doc.circle(circleX, circleY, radius, "F");

  // Score arc (circular progress)
  const scorePercentage = feedback.totalScore / 100;
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);

  // Inner filled circle
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.2);
  doc.circle(circleX, circleY, radius, "F");

  // Score circle
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.circle(circleX, circleY, radius * 0.85, "F");

  // Score text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${feedback.totalScore}`, circleX, circleY + 2, { align: "center" });

  doc.setFontSize(8);
  doc.text("/100", circleX, circleY + 8, { align: "center" });

  // Performance label
  const performanceLabel =
    feedback.totalScore >= 70
      ? "Excellent"
      : feedback.totalScore >= 50
      ? "Good"
      : "Needs Work";

  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(`Performance Rating: ${performanceLabel}`, margin + 10, yPosition);

  yPosition += 7;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Based on comprehensive AI evaluation", margin + 10, yPosition);

  yPosition += scoreCardHeight - 15;
  addSpace(10);

  // Final Assessment Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("FINAL ASSESSMENT", margin, yPosition);
  yPosition += 2;
  addLine([229, 231, 235]);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  const assessmentLines = doc.splitTextToSize(
    feedback.finalAssessment,
    contentWidth - 10
  );
  doc.setFillColor(249, 250, 251);
  const assessmentHeight = assessmentLines.length * 5 + 10;
  doc.roundedRect(margin, yPosition, contentWidth, assessmentHeight, 3, 3, "F");
  yPosition += 7;
  doc.text(assessmentLines, margin + 5, yPosition);
  yPosition += assessmentLines.length * 5 + 8;

  // Performance Breakdown
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("PERFORMANCE BREAKDOWN", margin, yPosition);
  yPosition += 2;
  addLine([229, 231, 235]);

  feedback.categoryScores.forEach((category, index) => {
    if (yPosition > pageHeight - 80) {
      addFooter();
      doc.addPage();
      pageNumber++;
      yPosition = margin + 10;
    }

    const catColor =
      category.score >= 70
        ? [34, 197, 94]
        : category.score >= 50
        ? [234, 179, 8]
        : [239, 68, 68];

    // Category card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 28, 3, 3, "F");
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition, contentWidth, 28, 3, 3, "S");

    yPosition += 7;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(`${index + 1}. ${category.name}`, margin + 5, yPosition);

    // Score badge
    doc.setFillColor(catColor[0], catColor[1], catColor[2]);
    doc.roundedRect(pageWidth - margin - 35, yPosition - 4, 30, 8, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${category.score}/100`, pageWidth - margin - 20, yPosition + 1, {
      align: "center",
    });

    yPosition += 4;

    // Modern progress bar with gradient effect
    const barMaxWidth = contentWidth - 50;
    const barWidth = barMaxWidth * (category.score / 100);

    // Background bar
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin + 5, yPosition, barMaxWidth, 4, 2, 2, "F");

    // Progress bar with gradient simulation
    if (barWidth > 0) {
      doc.setFillColor(catColor[0], catColor[1], catColor[2], 0.3);
      doc.roundedRect(margin + 5, yPosition, barMaxWidth, 4, 2, 2, "F");

      doc.setFillColor(catColor[0], catColor[1], catColor[2]);
      doc.roundedRect(margin + 5, yPosition, barWidth, 4, 2, 2, "F");
    }

    yPosition += 8;

    // Comment
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    const commentLines = doc.splitTextToSize(
      category.comment,
      contentWidth - 15
    );
    doc.text(commentLines, margin + 5, yPosition);
    yPosition += Math.min(commentLines.length * 3.5, 8) + 8;
  });

  // Strengths Section
  if (yPosition > pageHeight - 100) {
    addFooter();
    doc.addPage();
    pageNumber++;
    yPosition = margin + 10;
  }

  addSpace(5);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94);
  doc.text("KEY STRENGTHS", margin, yPosition);
  yPosition += 2;
  addLine([34, 197, 94]);

  doc.setFillColor(240, 253, 244);
  const strengthsHeight = feedback.strengths.length * 8 + 10;
  doc.roundedRect(margin, yPosition, contentWidth, strengthsHeight, 3, 3, "F");

  yPosition += 7;
  feedback.strengths.forEach((strength, index) => {
    if (yPosition > pageHeight - 40) {
      addFooter();
      doc.addPage();
      pageNumber++;
      yPosition = margin + 10;
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(22, 163, 74);

    // Checkmark bullet
    doc.setFillColor(34, 197, 94);
    doc.circle(margin + 7, yPosition - 1, 1.5, "F");

    doc.setTextColor(21, 128, 61);
    const strengthLines = doc.splitTextToSize(strength, contentWidth - 20);
    doc.text(strengthLines, margin + 12, yPosition);
    yPosition += strengthLines.length * 4 + 4;
  });

  yPosition += 10;

  // Areas for Improvement Section
  if (yPosition > pageHeight - 100) {
    addFooter();
    doc.addPage();
    pageNumber++;
    yPosition = margin + 10;
  }

  addSpace(5);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(239, 68, 68);
  doc.text("AREAS FOR IMPROVEMENT", margin, yPosition);
  yPosition += 2;
  addLine([239, 68, 68]);

  doc.setFillColor(254, 242, 242);
  const improvementsHeight = feedback.areasForImprovement.length * 8 + 10;
  doc.roundedRect(
    margin,
    yPosition,
    contentWidth,
    improvementsHeight,
    3,
    3,
    "F"
  );

  yPosition += 7;
  feedback.areasForImprovement.forEach((area, index) => {
    if (yPosition > pageHeight - 40) {
      addFooter();
      doc.addPage();
      pageNumber++;
      yPosition = margin + 10;
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Arrow bullet
    doc.setFillColor(239, 68, 68);
    doc.circle(margin + 7, yPosition - 1, 1.5, "F");

    doc.setTextColor(185, 28, 28);
    const areaLines = doc.splitTextToSize(area, contentWidth - 20);
    doc.text(areaLines, margin + 12, yPosition);
    yPosition += areaLines.length * 4 + 4;
  });

  // Final footer
  addFooter();

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}

export async function generateWeeklyReportPDF(params: {
  userName: string;
  userEmail: string;
  weekStart: string;
  weekEnd: string;
  interviews: Array<{
    role: string;
    type: string;
    score: number;
    date: string;
  }>;
  totalInterviews: number;
  averageScore: number;
  currentStreak: number;
  categoryAverages: Array<{
    name: string;
    average: number;
  }>;
  topStrengths: string[];
  commonImprovements: string[];
}): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addText = (
    text: string,
    fontSize: number = 10,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0]
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;

    if (yPosition + lines.length * lineHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 2;
  };

  const addSpace = (space: number = 5) => {
    yPosition += space;
  };

  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  // Header
  doc.setFillColor(245, 87, 108);
  doc.rect(0, 0, pageWidth, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Progress Report", margin, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${params.weekStart} - ${params.weekEnd}`, margin, 32);

  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // User Info
  addText("CANDIDATE INFORMATION", 14, true, [245, 87, 108]);
  addLine();
  addText(`Name: ${params.userName}`, 11, true);
  addText(`Email: ${params.userEmail}`, 10);
  addSpace(10);

  // Stats Summary
  addText("WEEKLY SUMMARY", 14, true, [245, 87, 108]);
  addLine();

  // Stats boxes
  const boxWidth = (contentWidth - 10) / 3;
  const boxHeight = 25;
  const statY = yPosition;

  // Interviews box
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, statY, boxWidth, boxHeight, "F");
  doc.setDrawColor(102, 126, 234);
  doc.rect(margin, statY, boxWidth, boxHeight, "S");

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 126, 234);
  doc.text(`${params.totalInterviews}`, margin + boxWidth / 2, statY + 12, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Interviews", margin + boxWidth / 2, statY + 20, {
    align: "center",
  });

  // Average Score box
  doc.setFillColor(240, 253, 244);
  doc.rect(margin + boxWidth + 5, statY, boxWidth, boxHeight, "F");
  doc.setDrawColor(34, 197, 94);
  doc.rect(margin + boxWidth + 5, statY, boxWidth, boxHeight, "S");

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94);
  doc.text(
    `${params.averageScore}`,
    margin + boxWidth + 5 + boxWidth / 2,
    statY + 12,
    { align: "center" }
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Avg Score", margin + boxWidth + 5 + boxWidth / 2, statY + 20, {
    align: "center",
  });

  // Streak box
  doc.setFillColor(255, 247, 237);
  doc.rect(margin + 2 * boxWidth + 10, statY, boxWidth, boxHeight, "F");
  doc.setDrawColor(251, 146, 60);
  doc.rect(margin + 2 * boxWidth + 10, statY, boxWidth, boxHeight, "S");

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(251, 146, 60);
  doc.text(
    `${params.currentStreak}`,
    margin + 2 * boxWidth + 10 + boxWidth / 2,
    statY + 12,
    { align: "center" }
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Day Streak",
    margin + 2 * boxWidth + 10 + boxWidth / 2,
    statY + 20,
    { align: "center" }
  );

  yPosition = statY + boxHeight + 15;
  doc.setTextColor(0, 0, 0);

  // Interview History
  addText("INTERVIEW HISTORY", 14, true, [245, 87, 108]);
  addLine();

  params.interviews.forEach((interview, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    const scoreColor =
      interview.score >= 70
        ? [34, 197, 94]
        : interview.score >= 50
        ? [234, 179, 8]
        : [239, 68, 68];

    addText(
      `${dayjs(interview.date).format("MMM D")} - ${interview.role} (${
        interview.type
      })`,
      10,
      true
    );
    yPosition -= 2;

    const barWidth = (contentWidth - 40) * (interview.score / 100);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth - 40, 4, "F");
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(margin, yPosition, barWidth, 4, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${interview.score}`, pageWidth - margin - 15, yPosition + 3);

    yPosition += 8;
    doc.setTextColor(0, 0, 0);
  });

  addSpace(5);

  // Category Performance
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  addText("CATEGORY PERFORMANCE", 14, true, [245, 87, 108]);
  addLine();

  params.categoryAverages.forEach((category) => {
    if (yPosition > pageHeight - 25) {
      doc.addPage();
      yPosition = margin;
    }

    addText(`${category.name}: ${category.average}/100`, 10, true);
    yPosition -= 2;

    const barWidth = (contentWidth - 10) * (category.average / 100);
    const barColor =
      category.average >= 70
        ? [34, 197, 94]
        : category.average >= 50
        ? [234, 179, 8]
        : [239, 68, 68];

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth - 10, 4, "F");
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.rect(margin, yPosition, barWidth, 4, "F");
    yPosition += 8;
  });

  addSpace(5);

  // Top Strengths
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  addText("TOP STRENGTHS THIS WEEK", 14, true, [34, 197, 94]);
  addLine();

  params.topStrengths.forEach((strength) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    addText(`✓ ${strength}`, 10);
  });

  addSpace(10);

  // Common Improvements
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  addText("FOCUS AREAS", 14, true, [239, 68, 68]);
  addLine();

  params.commonImprovements.forEach((area) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    addText(`→ ${area}`, 10);
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "© 2025 NexusAgent.ai - Your AI Interview Coach",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}
