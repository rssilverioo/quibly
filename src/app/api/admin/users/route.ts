import { requireAdmin } from "@/lib/adminAuth.guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ("error" in auth) return auth.error;

    const url = req.nextUrl;
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const search = url.searchParams.get("search") || "";
    const planFilter = url.searchParams.get("plan") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (planFilter === "PRO" || planFilter === "FREE") {
      where.plan = planFilter;
    }

    const allowedSortFields: Record<string, Prisma.UserOrderByWithRelationInput> = {
      createdAt: { createdAt: sortOrder },
      name: { name: sortOrder },
      email: { email: sortOrder },
      xp: { xp: sortOrder },
      plan: { plan: sortOrder },
    };

    const orderBy = allowedSortFields[sortBy] || { createdAt: "desc" };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
          plan: true,
          role: true,
          xp: true,
          streak: true,
          level: true,
          createdAt: true,
          subscriptionStatus: true,
          _count: {
            select: {
              flashcardSets: true,
              quizzes: true,
              documents: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching admin users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users", details: String(err) },
      { status: 500 }
    );
  }
}
