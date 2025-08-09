const { pgTable, serial, text, varchar, integer } = require("drizzle-orm/pg-core");

export const JsonForms = pgTable('JsonForms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
    theme: varchar('theme'),
    background: varchar('background'),
    style: varchar('style'),
    createdBy: varchar('createdBy', { length: 100 }).notNull(),
    createdAt: varchar('createdAt', { length: 100 }).notNull(),
})

export const userResponse = pgTable('userResponse', {
    id: serial('id').primaryKey(),
    jsonResponse: text('jsonResponse').notNull(),
    createdBy: varchar('createdBy', { length: 100 }).default('anonymus'),
    createdAt: varchar('createdAt', { length: 100 }).notNull(),
    formRef: integer('formRef').references(() => JsonForms.id)
})

export const Teams = pgTable('Teams', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    createdBy: varchar('createdBy', { length: 100 }).notNull(),
    createdAt: varchar('createdAt', { length: 100 }).notNull(),
    plan: varchar('plan', { length: 50 }).default('free')
})

export const TeamMembers = pgTable('TeamMembers', {
    id: serial('id').primaryKey(),
    teamId: integer('teamId'),
    userEmail: varchar('userEmail', { length: 100 }).notNull(),
    role: varchar('role', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    invitedBy: varchar('invitedBy', { length: 100 }).notNull(),
    joinedAt: varchar('joinedAt', { length: 100 }),
    invitedAt: varchar('invitedAt', { length: 100 }).notNull()
})

export const FormCollaborators = pgTable('FormCollaborators', {
    id: serial('id').primaryKey(),
    formId: integer('formId').references(() => JsonForms.id),
    userEmail: varchar('userEmail', { length: 100 }).notNull(),
    permission: varchar('permission', { length: 50 }).notNull(),
    addedBy: varchar('addedBy', { length: 100 }).notNull(),
    addedAt: varchar('addedAt', { length: 100 }).notNull()
})