/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Users Table
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('name').notNullable(); // Organization name
        table.string('address');
        table.float('latitude');
        table.float('longitude');
        table.string('contact_info');
        table.timestamps(true, true);
    });

    // Items (Surplus) Table
    await knex.schema.createTable('items', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('name').notNullable();
        table.integer('quantity').notNullable();
        table.string('unit').notNullable(); // e.g., kg, boxes
        table.date('expiry_date');
        table.string('category');
        table.string('status').defaultTo('available'); // available, reserved, taken
        table.timestamps(true, true);
    });

    // Requests Table
    await knex.schema.createTable('requests', (table) => {
        table.increments('id').primary();
        table.integer('requester_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE');
        table.string('status').defaultTo('pending'); // pending, accepted, rejected, completed
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('requests');
    await knex.schema.dropTableIfExists('items');
    await knex.schema.dropTableIfExists('users');
}
