import React, { useEffect, useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import { Typewriter } from "react-simple-typewriter";
import { useLocation } from 'react-router-dom';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_KEY,
});
async function generate(setData,topic) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a professional Career Counselor.

                    Your task is to explain the career path of ${topic} to a student in a friendly, humanized, and easy-to-understand tone.

                    Cover the following sections in depth:

                    Introduction: Give a detailed overview of the field of ${topic}.

                    Importance: Explain why ${topic} is crucial in today's world and industries.

                    Role: Describe what a typical ${topic} does in day-to-day work.

                    What to Study: Mention key skills, topics, and knowledge areas someone must study to become a ${topic}.

                    Salary: Provide information about average salaries globally and factors affecting them (like experience, region).

                    Return the output strictly as a JSON array, where each element is an object with exactly two fields:

                    "title": (string) — the title of the section (e.g., "Introduction")

                    "description": (string) — the detailed human-like explanation of that section.

                    Important Instructions:

                    Write in a friendly but professional tone, as if mentoring a student.

                    Do not use any headings or markdown syntax like ### or bullet points.

                    Ensure it feels like a conversation, not just textbook information.

                    Only output pure valid JSON — no additional text, markdown, explanations, or formatting.

                    Make sure the JSON is directly parsable.
        `,
      });
      const cleanedText = response.candidates[0].content.parts[0].text
      .replace(/^```json\s*/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .replace(/^JSON\s*/i, "")
      .trim();
      
      localStorage.setItem(topic,cleanedText);
      setData(JSON.parse(cleanedText));

      return response.candidates[0].content.parts[0].text;
}

function CareerDetails() {
    const [data,setData]=useState([])

    const location=useLocation();
    const {title}=location.state || {};

    useEffect(()=>{
        const details=localStorage.getItem(title);
        if(details){
            setData(JSON.parse(details));
        }
        else{
            generate(setData,title);
        }
    },[title])

  return (
    <div className='w-full h-full'>
        <div className="bg-gradient-to-r from-teal-400 to-blue-600  shadow-xl w-full">
            <h1 className="p-8 text-3xl md:text-5xl font-extrabold font-poppins text-white drop-shadow-sm text-center">
                {title}
            </h1>
        </div>
        {
            data.length>0 ? (
                data.map((val,idx)=>{
                    return <div key={idx} className='p-4 sm:p-10'>
                        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-gray-800 mb-4 tracking-tight">{val.title}</h1>
                        <hr className="w-1/3 border-t-2 border-teal-500 rounded-md"/>
                        <p className="text-base sm:text-lg mb-8 font-poppins leading-relaxed">
                            {val.description}
                        </p>
                    </div>
                })
            ):
            (
                <div className="py-4 sm:py-8 text-teal-600 font-semibold text-xl sm:text-2xl">
                    <Typewriter 
                        words={["Loading..."]}
                        loop={false}
                        cursor='|'
                        cursorBlinking={true}
                        typeSpeed={30}
                    />
                </div>
            )
        }
    </div>
  )
}

export default CareerDetails