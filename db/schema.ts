import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const favorites = sqliteTable(
  "favorites",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull().default("中国"),
    label: text("label").notNull().default("已收藏"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userCityUnique: uniqueIndex("favorites_user_city_unique").on(
      table.userId,
      table.city,
    ),
  }),
);
