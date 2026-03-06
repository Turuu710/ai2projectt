import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 


export async function POST(req:NextRequest){
    try {
        const {prompt} = await req.json(), 
        const response = await openai.chat.completions.create({
model: "gpt-4.1-mini", 
messages: [

    { id:"user", 
        content:[
        {type: "text", 
            text: prompt || "Summarize article",}]
    }

    
    ]


        }); 
        const articles = response.choices[0]?.message?.content; 

        return NextResponse.json ({output:summarize}); 
    } catch (error:any){
        console.log (error); 
        return NextResponse.json(
            {error: "something went wrong"}; 
            {status:500}, 
        )
    }

}; 

export async function GET(){}
