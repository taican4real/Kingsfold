import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy-loaded Gemini AI client helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function callGeminiWithRetry(genAI: any, params: any, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await genAI.models.generateContent(params);
    } catch (err: any) {
      if (err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("High demand")) {
        attempt++;
        if (attempt >= retries) throw err;
        console.log(`Gemini 503 error, retrying ${attempt}/${retries}...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
      } else {
        throw err;
      }
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing
  app.use(express.json());

  // AI Lesson Generator Route
  app.post("/api/generate-lesson", async (req, res) => {
    const genAI = getGenAI();
    if (!genAI) {
      console.error("Gemini API Key Missing or Invalid in Environment");
      return res.status(500).json({ 
        error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment secrets." 
      });
    }

    try {
      const { topic, gradeLevel, subject, duration, learningObjectives, additionalContext } = req.body;

      const prompt = `
        You are an expert curriculum developer for Kingsfold International Academy, a world-class preparatory school. 
        Generate a comprehensive, high-quality lesson plan for the following details:
        
        Topic: ${topic}
        Subject: ${subject}
        Grade Level: ${gradeLevel}
        Duration: ${duration}
        Proposed Learning Objectives: ${learningObjectives || 'None provided. Please generate suitable SMART objectives for this topic and grade level.'}
        Additional Context/Requirements: ${additionalContext || 'None'}

        STRUCTURE REQUIREMENT:
        The output must be a JSON object (inside a markdown code block) with the following fields:
        {
          "header": {
            "subject": "${subject}",
            "term": "Current Term",
            "session": "2023/2024 Academic Session",
            "teacher": "Kingsfold Faculty"
          },
          "grid": {
            "weekDate": "Week 1",
            "topicSubTopics": "${topic}",
            "references": ["Reference Item 1", "Reference Item 2"],
            "year": "${gradeLevel}",
            "instructionalMaterials": ["Material 1", "Material 2"],
            "duration": "${duration}",
            "interactiveSession": ["Numbered step 1...", "Numbered step 2...", "Numbered step 3..."]
          },
          "learningObjectives": ["Objective 1", "Objective 2"],
          "bibleReference": "Generate a relevant Bible verse (Chapter:Verse + Text) connected to the topic.",
          "contentNote": "A very detailed lesson note in Markdown. Use bolding, bullet points, and clear headings to make it rich and readable.",
          "evaluation": ["Question 1", "Question 2"],
          "homework": "A specific assignment related to the topic."
        }

        Maintain a tone of academic excellence and global readiness. Ensure the response is valid JSON.
      `;

      // Use the model
      const response = await callGeminiWithRetry(genAI, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from AI");
      }
      
      res.json({ content: text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate lesson plan. Please try again." });
    }
  });

  // AI Lesson Note Generator Route (Detailed content based on plan)
  app.post("/api/generate-note", async (req, res) => {
    const genAI = getGenAI();
    if (!genAI) return res.status(500).json({ error: "API key not configured" });

    try {
      const { lessonPlan, topic, subject, gradeLevel } = req.body;

      const prompt = `
        Based on the following Lesson Plan for "${topic}" (${subject}, ${gradeLevel}), generate a detailed "Lesson Note" for students.
        
        Lesson Plan Reference:
        ${lessonPlan}

        STRUCTURE REQUIREMENT:
        The output must be a JSON object (inside a markdown code block) with the following fields:
        {
          "title": "Topic Title",
          "introduction": "Brief introductory paragraph",
          "tableOfContent": [
             { "heading": "Concept 1", "summary": "Short summary" },
             { "heading": "Concept 2", "summary": "Short summary" }
          ],
          "detailedSections": [
            {
              "heading": "Section Heading",
              "content": "Detailed explanation in Markdown",
              "keyTakeaway": "Single sentence highlight"
            }
          ],
          "keyDefinitions": [
            { "term": "Term", "definition": "Definition" }
          ],
          "summary": "Final concluding summary paragraph"
        }

        Maintain a tone of academic excellence. Ensure the response is valid JSON.
      `;

      const response = await callGeminiWithRetry(genAI, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      res.json({ content: text });
    } catch (error) {
      console.error("Gemini Note Error:", error);
      res.status(500).json({ error: "Failed to generate lesson note." });
    }
  });

  // API Route for Assessment Questions Generation
  app.post("/api/generate-questions", async (req, res) => {
    const genAI = getGenAI();
    if (!genAI) return res.status(500).json({ error: "Gemini API key is not configured." });

    try {
      const { session, classLevel, topics, numObjective, numTheory, duration, instruction } = req.body;

      const prompt = `
        You are an expert curriculum assessor for Kingsfold International Academy, preparing an examination paper.
        Generate an assessment with the following specifications:
        
        Session: ${session}
        Class/Grade Level: ${classLevel}
        Topics: ${topics}
        Number of Multiple Choice Questions: ${numObjective} (each MUST have four options A, B, C, D)
        Number of Theory/Essay Questions: ${numTheory}
        Duration: ${duration}
        Special Instructions: ${instruction}

        STRUCTURE REQUIREMENT:
        The output must be a JSON object (inside a markdown code block) with the following fields:
        {
          "header": {
            "session": "${session}",
            "classLevel": "${classLevel}",
            "duration": "${duration}",
            "instruction": "${instruction}"
          },
          "multipleChoice": [
            {
              "questionNumber": 1,
              "question": "The question text",
              "options": {
                "A": "Option A text",
                "B": "Option B text",
                "C": "Option C text",
                "D": "Option D text"
              },
              "correctAnswer": "A"
            }
          ],
          "theory": [
            {
              "questionNumber": 1,
              "question": "The theory question text"
            }
          ]
        }

        Follow the specifications exactly. Ensure there are exactly ${numObjective} multiple choice questions and exactly ${numTheory} theory questions. Tone is academic and standard. Ensure valid JSON output.
      `;

      const response = await callGeminiWithRetry(genAI, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");

      res.json({ content: text });
    } catch (error) {
      console.error("Gemini Questions generation Error:", error);
      res.status(500).json({ error: "Failed to generate assessment questions. Please try again." });
    }
  });

  // API Route for Student Registration
  app.post("/api/register", async (req, res) => {
    const formData = req.body;
    
    console.log("Registration Data Received:", formData);

    try {
      // Basic validation to prevent DNS hang if user mistakenly put an API key instead of an SMTP host
      if (!process.env.SMTP_HOST || process.env.SMTP_HOST.startsWith("AIza") || process.env.SMTP_HOST.length > 50) {
        console.warn("SMTP_HOST is not properly configured. Skipping email notification.");
      } else {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

      const mailOptions = {
        from: `"Kingsfold Enrollment System" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: "taican4real@gmail.com",
        subject: `New Student Registration: ${formData.firstName} ${formData.surname}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #6B0F1A; border-bottom: 2px solid #6B0F1A; padding-bottom: 10px;">New Student Enrollment</h2>
            
            <h3 style="color: #6B0F1A;">Student Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>First Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.firstName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Surname:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.surname}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>DOB:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.dob}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Gender:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.gender}</td></tr>
            </table>

            <h3 style="color: #6B0F1A; margin-top: 20px;">Guardian Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guardian Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.guardianName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Relationship:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.relationship}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.phone}</td></tr>
            </table>

            <h3 style="color: #6B0F1A; margin-top: 20px;">Academic History</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Previous School:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.previousSchool}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Last Grade:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.lastGrade}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>GPA/Average:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.gpa}</td></tr>
            </table>

            <h3 style="color: #6B0F1A; margin-top: 20px;">Emergency Contact</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Contact Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.emergencyContact}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.emergencyPhone}</td></tr>
            </table>

            <div style="margin-top: 30px; font-size: 11px; color: #999; text-align: center;">
              This is an automated message from the Kingsfold Academy Enrollment Portal.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Registration email sent successfully to the admin.");
      }
    } catch (error) {
      console.error("Failed to send registration email:", error);
      // We still return true to the user but log the error
    }

    res.json({
      success: true,
      message: "Application received. Our team will review the details."
    });
  });

  // API Route for Reviews (Mock data, Google API removed)
  app.get("/api/reviews", async (req, res) => {
    // Providing placeholder reviews locally
    return res.json({
      reviews: [
        {
          author_name: "Adeola Johnson",
          rating: 5,
          text: "Kingsfold Academy provides the best British curriculum education in Lagos. My child has thrived here!",
          profile_photo_url: "https://i.pravatar.cc/150?u=adeola",
          relative_time_description: "2 weeks ago"
        },
        {
          author_name: "Chidi Okafor",
          rating: 5,
          text: "Excellent boarding facilities and top-notch security. Highly recommended for parents looking for premium education.",
          profile_photo_url: "https://i.pravatar.cc/150?u=chidi",
          relative_time_description: "1 month ago"
        },
        {
          author_name: "Sarah Williams",
          rating: 5,
          text: "The combination of British and Nigerian curricula is perfect for preparing children for global opportunities.",
          profile_photo_url: "https://i.pravatar.cc/150?u=sarah",
          relative_time_description: "3 months ago"
        }
      ],
      status: "LOCAL_MOCK_DATA" 
    });
  });

  // AI Chatbot Route
  app.post("/api/chatbot", async (req, res) => {
    const genAI = getGenAI();
    if (!genAI) return res.status(500).json({ error: "Gemini API key is not configured." });

    try {
      const { history, message } = req.body;
      
      const systemInstruction = `
        You are the "Kingsfold AI Assistant", a professional and helpful chatbot for Kingsfold International Academy.
        Kingsfold International Academy is a prestigious preparatory school located in Lagos, Nigeria, offering both British and Nigerian curricula.
        
        Key information about the school:
        - Curriculum: British (IGCSE, Checkpoint) and Nigerian (WAEC, BECE).
        - Facilities: Ultra-modern boarding, state-of-the-art labs, sports complex, and premium security.
        - Location: No. 1 Kingsfold Way, Off Lekki-Epe Expressway, Lagos.
        - Contact: (+234) 909 598 7223, info@kingsfoldinternationalacademy.com.ng
        - Values: Excellence, Character, and Global Citizenship.
        - Admission: Open for Year 7 to Year 12.
        
        Tone: Professional, welcoming, academic, and extremely helpful. 
        Always promote the school's excellence and encourage parents to contact the admissions department for more details.
        Keep responses concise and formatted with Markdown for readability.
      `;

      // Format history for Gemini API
      const contents = history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.content }]
      }));

      // Add the current message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await callGeminiWithRetry(genAI, {
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");

      res.json({ response: text });
    } catch (error) {
      console.error("Chatbot Error:", error);
      res.status(500).json({ error: "I'm having a little trouble connecting right now. Please try again or contact us directly." });
    }
  });

  // API Route to proxy the school logo for PDF generation
  app.get("/api/proxy-logo", async (req, res) => {
    try {
      const imgUrl = "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000";
      const response = await fetch(imgUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const contentType = response.headers.get('content-type') || 'image/png';
      
      res.json({ base64: `data:${contentType};base64,${base64}` });
    } catch (error) {
      console.error("Error proxying image:", error);
      res.status(500).json({ error: "Failed to load logo" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
