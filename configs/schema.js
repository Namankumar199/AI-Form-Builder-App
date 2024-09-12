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