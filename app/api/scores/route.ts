// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function GET(req: NextRequest) {
//   const { userId: clerkId } = await auth();

//   if (!clerkId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);
//   const articleId = searchParams.get("articleId");

//   if (!articleId) {
//     return NextResponse.json({ error: "articleId is required" }, { status: 400 });
//   }

//   try {
//     const scores = await prisma.score.findMany({
//       where: { clerkId, articleId },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(scores, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/scores error:", error);
//     return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   const { userId: clerkId } = await auth();

//   if (!clerkId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { articleId, score, timeSpent } = await req.json();

//     if (!articleId || score === undefined) {
//       return NextResponse.json({ error: "articleId and score are required" }, { status: 400 });
//     }

//     const saved = await prisma.score.create({
//       data: { clerkId, articleId, score, timeSpent: timeSpent ?? 0 },
//     });

//     return NextResponse.json(saved, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/scores error:", error);
//     return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
//   }
// }

// // mmm

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "articleId is required" },
        { status: 400 },
      );
    }

    const scores = await prisma.score.findMany({
      where: {
        clerkId,
        articleId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(scores, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/scores error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { articleId, score, timeSpent } = body;

    if (!articleId || score === undefined) {
      return NextResponse.json(
        { error: "articleId and score are required" },
        { status: 400 },
      );
    }

    // findUnique-ийн оронд findFirst ашиглаж алдааг засав
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const saved = await prisma.score.create({
      data: {
        clerkId,
        articleId,
        score: Number(score),
        timeSpent: timeSpent ?? 0,
        // userId: dbUser.id,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/scores error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save score" },
      { status: 500 },
    );
  }
}
