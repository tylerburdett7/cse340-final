import db from "../db/index.js";

export async function getBoatInventory() {
  try {
    const result = await db.query(`
      SELECT b.*, 
             json_agg(json_build_object('id', i.id, 'image_url', i.image_url) ORDER BY i.id) 
             FILTER (WHERE i.id IS NOT NULL) as images
      FROM boats b
      LEFT JOIN boat_images i ON b.id = i.boat_id
      GROUP BY b.id
      ORDER BY b.id
    `);
    return result.rows;
  } catch (err) {
    if (err.code === "42P01") {
      return [];
    }
    throw err;
  }
}

export async function getBoatById(id) {
  const query = `
    SELECT b.*, 
           json_agg(json_build_object('id', i.id, 'image_url', i.image_url) ORDER BY i.id) 
           FILTER (WHERE i.id IS NOT NULL) as images
    FROM boats b
    LEFT JOIN boat_images i ON b.id = i.boat_id
    WHERE b.id = $1
    GROUP BY b.id
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
}

export async function addBoat({ title, year, price, make, model, condition, description, image_urls }) {
  const query = `
    INSERT INTO boats (title, year, price, make, model, condition, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [title, year ? parseInt(year) : null, price ? parseFloat(price) : null, make || null, model || null, condition, description || null];
  const result = await db.query(query, values);
  
  // Add images if provided
  if (image_urls && image_urls.length > 0) {
    for (const url of image_urls) {
      if (url.trim()) {
        await addBoatImage(result.rows[0].id, url);
      }
    }
  }
  
  return result.rows[0];
}

export async function updateBoat(id, { title, year, price, make, model, condition, description }) {
  const query = `
    UPDATE boats 
    SET title = $1, year = $2, price = $3, make = $4, model = $5, condition = $6, description = $7
    WHERE id = $8
    RETURNING *
  `;
  const values = [title, year ? parseInt(year) : null, price ? parseFloat(price) : null, make || null, model || null, condition, description || null, id];
  const result = await db.query(query, values);
  
  return result.rows[0];
}

export async function addBoatImage(boatId, imageUrl) {
  const query = `
    INSERT INTO boat_images (boat_id, image_url)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await db.query(query, [boatId, imageUrl]);
  return result.rows[0];
}

export async function deleteBoatImage(imageId) {
  const query = "DELETE FROM boat_images WHERE id = $1";
  await db.query(query, [imageId]);
}
