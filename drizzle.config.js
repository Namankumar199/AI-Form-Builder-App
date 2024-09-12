import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./configs/schema.js",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://ai-formbuilder_owner:vb5Gdkfj6exM@ep-dry-brook-a5r248qy.us-east-2.aws.neon.tech/ai-formbuilder?sslmode=require',
    }
});
