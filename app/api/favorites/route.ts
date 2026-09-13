import { and, desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { favorites } from "../../../db/schema";

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "服务暂时不可用";
  if (message.includes("no such table") || message.includes("favorites")) {
    return "收藏夹还在初始化，请稍后再试。";
  }
  return message;
}

async function requireUser() {
  const user = await getChatGPTUser();
  if (!user) {
    return null;
  }
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, user.userId))
      .orderBy(desc(favorites.createdAt), desc(favorites.id));
    return Response.json({ favorites: rows });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  try {
    const payload = (await request.json()) as {
      city?: string;
      country?: string;
      label?: string;
    };
    const city = payload.city?.trim() ?? "";
    if (!city) return Response.json({ error: "城市不能为空" }, { status: 400 });

    const db = getDb();
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.userId), eq(favorites.city, city)))
      .limit(1);
    if (existing[0]) return Response.json({ favorite: existing[0] });

    const [favorite] = await db
      .insert(favorites)
      .values({
        userId: user.userId,
        city,
        country: payload.country?.trim() || "中国",
        label: payload.label?.trim() || "已收藏",
      })
      .returning();
    return Response.json({ favorite }, { status: 201 });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";
  if (!city) return Response.json({ error: "城市不能为空" }, { status: 400 });

  try {
    const db = getDb();
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, user.userId), eq(favorites.city, city)));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}
