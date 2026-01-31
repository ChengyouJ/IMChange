/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Add delivery tracking columns to requests table
    await knex.schema.alterTable('requests', (table) => {
        table.string('delivery_status').defaultTo('pending');
        table.timestamp('sent_at').nullable();
        table.timestamp('received_at').nullable();
    });

    // Migrate existing data: set delivery_status based on current status
    await knex('requests')
        .where('status', 'accepted')
        .update({ delivery_status: 'accepted' });

    await knex('requests')
        .whereIn('status', ['pending', 'rejected'])
        .update({ delivery_status: knex.ref('status') });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('requests', (table) => {
        table.dropColumn('delivery_status');
        table.dropColumn('sent_at');
        table.dropColumn('received_at');
    });
}
