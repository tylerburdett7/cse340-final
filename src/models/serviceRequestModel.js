import db from '../db/index.js';

/**
 * Get all service requests (for service_manager and admin)
 */
export async function getAllServiceRequests() {
  try {
    const result = await db.query(`
      SELECT sr.*, u.email as customer_email, b.title as boat_title
      FROM service_requests sr
      JOIN users u ON sr.user_id = u.id
      LEFT JOIN boats b ON sr.boat_id = b.id
      ORDER BY sr.created_at DESC
    `);
    return result.rows;
  } catch (err) {
    console.error('DB Error in getAllServiceRequests:', err);
    return [];
  }
}

/**
 * Get service requests for a specific customer
 */
export async function getCustomerServiceRequests(userId) {
  try {
    const result = await db.query(`
      SELECT sr.*, b.title as boat_title
      FROM service_requests sr
      LEFT JOIN boats b ON sr.boat_id = b.id
      WHERE sr.user_id = $1
      ORDER BY sr.created_at DESC
    `, [userId]);
    return result.rows;
  } catch (err) {
    console.error('DB Error in getCustomerServiceRequests:', err);
    return [];
  }
}

/**
 * Get a single service request by ID
 */
export async function getServiceRequestById(id) {
  try {
    const result = await db.query(`
      SELECT sr.*, u.email as customer_email, b.title as boat_title
      FROM service_requests sr
      JOIN users u ON sr.user_id = u.id
      LEFT JOIN boats b ON sr.boat_id = b.id
      WHERE sr.id = $1
    `, [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('DB Error in getServiceRequestById:', err);
    return null;
  }
}

/**
 * Create a new service request
 */
export async function createServiceRequest(userId, boatYear, boatMake, boatModel, serviceTypes, description) {
  try {
    const result = await db.query(`
      INSERT INTO service_requests (user_id, boat_year, boat_make, boat_model, service_types, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
      RETURNING *
    `, [userId, boatYear, boatMake, boatModel, serviceTypes, description]);
    return result.rows[0];
  } catch (err) {
    console.error('DB Error in createServiceRequest:', err);
    return null;
  }
}

/**
 * Update service request status (for service_manager)
 */
export async function updateServiceRequestStatus(id, status, responseNotes) {
  try {
    const result = await db.query(`
      UPDATE service_requests
      SET status = $1, response_notes = $2, updated_at = CURRENT_TIMESTAMP, responded_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, responseNotes, id]);
    return result.rows[0];
  } catch (err) {
    console.error('DB Error in updateServiceRequestStatus:', err);
    return null;
  }
}
