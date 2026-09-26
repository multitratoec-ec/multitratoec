import { pgTable, serial, integer, text, real, index, uniqueIndex } from "drizzle-orm/pg-core";
export const ads = pgTable("ads", {
 id: serial("id").primaryKey(),
 owner: text("owner").notNull(),
 kind: text("kind").notNull(), title: text("title").notNull(), category: text("category").notNull(),
 city: text("city").notNull(), price: real("price").notNull(), unit: text("unit").notNull(),
 description: text("description").notNull(), contact: text("contact").notNull(),
 createdAt: text("created_at").notNull(),
 latitude: real("latitude"),
 longitude: real("longitude"),
 photoCount: integer("photo_count").notNull().default(0),
 reachKm: integer("reach_km").notNull().default(30),
 condition: text("condition").notNull().default("no_aplica"),
 hiddenAt: text("hidden_at"),
}, t=>[index("idx_ads_created_at").on(t.createdAt)]);

export const profiles = pgTable("profiles", {
 userId: text("user_id").primaryKey(),
 displayName: text("display_name").notNull(),
 accountType: text("account_type").notNull().default("persona"),
 bio: text("bio").notNull().default(""),
 city: text("city").notNull().default(""),
 whatsapp: text("whatsapp").notNull().default(""),
 showWhatsapp: integer("show_whatsapp").notNull().default(0),
 updatedAt: text("updated_at").notNull(),
 joinedAt: text("joined_at"),
 avatarKey: text("avatar_key"),
 verifiedAt: text("verified_at"),
 verificationRequestedAt: text("verification_requested_at"),
});
export const photos = pgTable("photos", {
 id: serial("id").primaryKey(),
 adId: integer("ad_id").notNull().references(()=>ads.id),
 objectKey: text("object_key").notNull(),
}, t=>[index("idx_photos_ad").on(t.adId)]);
export const conversations = pgTable("conversations", {
 id: serial("id").primaryKey(),
 adId: integer("ad_id").notNull().references(()=>ads.id),
 buyerId: text("buyer_id").notNull(),
 sellerId: text("seller_id").notNull(),
 createdAt: text("created_at").notNull(),
 updatedAt: text("updated_at").notNull(),
}, t=>[uniqueIndex("uniq_conversation_ad_buyer").on(t.adId,t.buyerId),index("idx_conversations_seller").on(t.sellerId)]);
export const messages = pgTable("messages", {
 id: serial("id").primaryKey(),
 conversationId: integer("conversation_id").notNull().references(()=>conversations.id),
 senderId: text("sender_id").notNull(),
 body: text("body").notNull(),
 createdAt: text("created_at").notNull(),
}, t=>[index("idx_messages_conversation").on(t.conversationId)]);
export const reviews = pgTable("reviews", {
 id: serial("id").primaryKey(),
 reviewerId: text("reviewer_id").notNull(),
 subjectId: text("subject_id").notNull(),
 conversationId: integer("conversation_id").notNull().references(()=>conversations.id),
 stars: integer("stars").notNull(),
 comment: text("comment").notNull().default(""),
 createdAt: text("created_at").notNull(),
}, t=>[uniqueIndex("uniq_review_conversation_reviewer").on(t.conversationId,t.reviewerId),index("idx_reviews_subject").on(t.subjectId)]);
export const notifications = pgTable("notifications", {
 id: serial("id").primaryKey(),
 recipientId: text("recipient_id").notNull(),
 type: text("type").notNull(),
 actorId: text("actor_id").notNull(),
 adId: integer("ad_id"),
 conversationId: integer("conversation_id"),
 createdAt: text("created_at").notNull(),
 readAt: text("read_at"),
}, t=>[index("idx_notifications_recipient").on(t.recipientId,t.createdAt)]);

export const favorites = pgTable("favorites", {
 userId: text("user_id").notNull(),
 adId: integer("ad_id").notNull().references(()=>ads.id),
 createdAt: text("created_at").notNull(),
}, t=>[uniqueIndex("uniq_favorite_user_ad").on(t.userId,t.adId),index("idx_favorite_user").on(t.userId)]);
export const savedSearches = pgTable("saved_searches", {
 id: serial("id").primaryKey(),
 userId: text("user_id").notNull(),
 name: text("name").notNull(),
 query: text("query").notNull().default(""),
 kind: text("kind").notNull().default("Todos"),
 category: text("category").notNull().default("Todas"),
 city: text("city").notNull().default("Todas las ciudades"),
 minPrice: real("min_price"),
 maxPrice: real("max_price"),
 condition: text("condition").notNull().default("todos"),
 minRating: integer("min_rating"),
 latitude: real("latitude"),
 longitude: real("longitude"),
 radiusKm: integer("radius_km"),
 createdAt: text("created_at").notNull(),
}, t=>[index("idx_saved_search_user").on(t.userId)]);
export const reports = pgTable("reports", {
 id: serial("id").primaryKey(),
 reporterId: text("reporter_id").notNull(),
 targetType: text("target_type").notNull(),
 targetId: integer("target_id").notNull(),
 reason: text("reason").notNull(),
 detail: text("detail").notNull().default(""),
 status: text("status").notNull().default("pendiente"),
 createdAt: text("created_at").notNull(),
 resolvedAt: text("resolved_at"),
}, t=>[index("idx_reports_status").on(t.status,t.createdAt)]);

export {user,session,account,verification} from "./auth-schema";
