import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import sql from "../configs/db.js";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
            max_completion_tokens: length

        });

        const content = response.choices[0].message.content;
        await sql ` INSERT INTO creations(user_id,prompt,content,type) VALUES (${userId}, ${prompt},${content},'article')`;
        console.log("Plan",plan);
        if(plan !== 'premium'){
            await clerkClient.users.updateUser(userId,{
                privateMetadata:{
                    free_usage: free_usage +1
                }
            })
        }

        return res.json({
            success:true,content
        })
    } catch (error) {
        console.error(error.message);
        return res.json({
            success:false,message:error.message
        })

    }
}