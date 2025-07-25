import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Contact form submissions - Enhanced for all form types
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  industry: text("industry"),
  phone: text("phone"),
  message: text("message"),
  formType: text("form_type").notNull(), // 'contact', 'social_media', 'real_estate', 'medical', 'trades', 'small_business'
  challenges: text("challenges"),
  businessName: text("business_name"),
  brokerage: text("brokerage"),
  agentName: text("agent_name"),
  source: text("source").default("website"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  company: true,
  industry: true,
  phone: true,
  message: true,
  formType: true,
  challenges: true,
  businessName: true,
  brokerage: true,
  agentName: true,
  source: true,
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  message: true,
  sender: true,
});

// CRM TABLES
// Contacts table
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  tags: text("tags").array(),
  status: text("status").default("New"), // New, In Progress, Qualified, Proposal, Negotiation, Won, Lost
  source: text("source"), // Website, Social Media, Referral, Email, etc.
  ownerId: integer("owner_id").references(() => users.id),
  notes: text("notes"),
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  position: true,
  tags: true,
  status: true,
  source: true,
  ownerId: true,
  notes: true,
  lastContactDate: true,
});

// Deals table
export const crmDeals = pgTable("crm_deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  value: integer("value").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: text("status").default("New"), // New, In Progress, Qualified, Proposal, Negotiation, Won, Lost
  stage: text("stage"), // Discovery, Qualification, Proposal, Negotiation, Closing
  priority: text("priority").default("Medium"), // Low, Medium, High
  expectedCloseDate: date("expected_close_date"),
  actualCloseDate: date("actual_close_date"),
  ownerId: integer("owner_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCrmDealSchema = createInsertSchema(crmDeals).pick({
  title: true,
  contactId: true,
  value: true,
  currency: true,
  status: true,
  stage: true,
  priority: true,
  expectedCloseDate: true,
  actualCloseDate: true,
  ownerId: true,
  notes: true,
});

// Activities table for tracking interactions with contacts
export const crmActivities = pgTable("crm_activities", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  dealId: integer("deal_id").references(() => crmDeals.id),
  type: text("type").notNull(), // Call, Email, Meeting, Note, Task
  subject: text("subject").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  isCompleted: boolean("is_completed").default(false),
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCrmActivitySchema = createInsertSchema(crmActivities).pick({
  contactId: true,
  dealId: true,
  type: true,
  subject: true,
  description: true,
  dueDate: true,
  completedDate: true,
  isCompleted: true,
  ownerId: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof contactSubmissionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof chatMessageSchema>;

// CRM types
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;

export type CrmDeal = typeof crmDeals.$inferSelect;
export type InsertCrmDeal = z.infer<typeof insertCrmDealSchema>;

export type CrmActivity = typeof crmActivities.$inferSelect;
export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;

// Marketing Campaign tables
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  goal: text("goal").notNull(), // Promote, Announce, Celebrate, Educate, Sell
  businessType: text("business_type"), // Real Estate, Medical, Trades, Retail, Coaching, etc.
  status: text("status").default("Draft"), // Draft, Scheduled, Active, Paused, Completed
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: integer("budget"),
  tags: text("tags").array(),
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).pick({
  title: true,
  goal: true,
  businessType: true,
  status: true,
  startDate: true,
  endDate: true,
  budget: true,
  tags: true,
  ownerId: true,
});

// Social Posts table
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => marketingCampaigns.id),
  platform: text("platform").notNull(), // Facebook, Instagram, LinkedIn, Twitter
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(),
  tone: text("tone"), // Professional, Friendly, Funny, Minimalist, Aggressive
  scheduledDate: timestamp("scheduled_date"),
  publishedDate: timestamp("published_date"),
  status: text("status").default("Draft"), // Draft, Scheduled, Published, Failed
  metrics: jsonb("metrics").default({}), // likes, shares, comments, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).pick({
  campaignId: true,
  platform: true,
  content: true,
  mediaUrls: true,
  tone: true,
  scheduledDate: true,
  publishedDate: true,
  status: true,
  metrics: true,
});

// Lead Magnets table
export const leadMagnets = pgTable("lead_magnets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // PDF, Ebook, Webinar, Template
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  campaignId: integer("campaign_id").references(() => marketingCampaigns.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadMagnetSchema = createInsertSchema(leadMagnets).pick({
  title: true,
  description: true,
  type: true,
  fileUrl: true,
  thumbnailUrl: true,
  campaignId: true,
});

// Lead Magnet Subscribers table
export const leadMagnetSubscribers = pgTable("lead_magnet_subscribers", {
  id: serial("id").primaryKey(),
  leadMagnetId: integer("lead_magnet_id").references(() => leadMagnets.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  businessType: text("business_type"),
  downloadDate: timestamp("download_date").defaultNow(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  campaignDrip: boolean("campaign_drip").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadMagnetSubscriberSchema = createInsertSchema(leadMagnetSubscribers).pick({
  leadMagnetId: true,
  name: true,
  email: true,
  businessType: true,
  downloadDate: true,
  contactId: true,
  campaignDrip: true,
});

// Marketing Automations table
export const marketingAutomations = pgTable("marketing_automations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: text("trigger").notNull(), // New lead, Form submission, Tag added
  condition: jsonb("condition").default({}), // JSON containing conditions
  actions: jsonb("actions").default([]), // Array of action objects
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMarketingAutomationSchema = createInsertSchema(marketingAutomations).pick({
  name: true,
  description: true,
  trigger: true,
  condition: true,
  actions: true,
  isActive: true,
});

// Email Templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // Welcome, Offer, Case Study, Newsletter
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).pick({
  name: true,
  subject: true,
  content: true,
  type: true,
});

// Email Campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  templateId: integer("template_id").references(() => emailTemplates.id),
  segmentFilter: jsonb("segment_filter").default({}),
  scheduledDate: timestamp("scheduled_date"),
  sentDate: timestamp("sent_date"),
  status: text("status").default("Draft"), // Draft, Scheduled, Sending, Sent
  metrics: jsonb("metrics").default({}), // opens, clicks, bounces
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).pick({
  name: true,
  subject: true,
  content: true,
  templateId: true,
  segmentFilter: true,
  scheduledDate: true,
  sentDate: true,
  status: true,
  metrics: true,
});

// Type exports for marketing tables
export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = z.infer<typeof insertMarketingCampaignSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type LeadMagnet = typeof leadMagnets.$inferSelect;
export type InsertLeadMagnet = z.infer<typeof insertLeadMagnetSchema>;

export type LeadMagnetSubscriber = typeof leadMagnetSubscribers.$inferSelect;
export type InsertLeadMagnetSubscriber = z.infer<typeof insertLeadMagnetSubscriberSchema>;

export type MarketingAutomation = typeof marketingAutomations.$inferSelect;
export type InsertMarketingAutomation = z.infer<typeof insertMarketingAutomationSchema>;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;

// Leads table for form submissions
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  business: text("business"),
  industry: text("industry"),
  interestedService: text("interested_service"),
  message: text("message"),
  source: text("source").notNull().default("Website"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  business: true,
  industry: true,
  interestedService: true,
  message: true,
  source: true,
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Social media trial signups
export const socialTrials = pgTable("social_trials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  currentFollowers: integer("current_followers").default(0),
  goals: text("goals"),
  status: text("status").notNull().default("pending"),
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialTrialSchema = createInsertSchema(socialTrials).pick({
  name: true,
  email: true,
  phone: true,
  businessName: true,
  businessType: true,
  currentFollowers: true,
  goals: true,
});

export type SocialTrial = typeof socialTrials.$inferSelect;
export type InsertSocialTrial = z.infer<typeof insertSocialTrialSchema>;
