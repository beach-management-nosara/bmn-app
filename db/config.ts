import { defineDb, defineTable, column } from "astro:db";

const testimonials = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        author: column.text(),
        email: column.text({ optional: true }),
        comments: column.text(),
        property: column.text(),
        image: column.text({ optional: true }),
        consent: column.boolean({ default: false }),
        show: column.boolean({ default: false })
    }
});

// https://astro.build/db/config
export default defineDb({
    tables: { testimonials }
});
