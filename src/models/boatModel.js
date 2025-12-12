import db from "../db/index.js";

export async function getBoatInventory() {
  try {
    const boatsResult = await db.query(`
      SELECT * FROM boats ORDER BY id
    `);
    
    // Get all images
    const imagesResult = await db.query(`
      SELECT id, boat_id, image_url FROM boat_images ORDER BY boat_id, id
    `);
    
    // Build a map of boat_id -> images
    const imagesMap = {};
    imagesResult.rows.forEach(img => {
      if (!imagesMap[img.boat_id]) {
        imagesMap[img.boat_id] = [];
      }
      imagesMap[img.boat_id].push({ id: img.id, image_url: img.image_url });
    });
    
    // Add images to each boat
    const boats = boatsResult.rows.map(boat => ({
      ...boat,
      images: imagesMap[boat.id] || []
    }));
    
    return boats;
  } catch (err) {
    if (err.code === "42P01") {
      return [];
    }
    throw err;
  }
}

export async function getBoatById(id) {
  try {
    const boatResult = await db.query(`
      SELECT * FROM boats WHERE id = $1
    `, [id]);
    
    if (!boatResult.rows[0]) {
      return null;
    }
    
    const boat = boatResult.rows[0];
    
    // Get images for this boat
    const imagesResult = await db.query(`
      SELECT id, image_url FROM boat_images WHERE boat_id = $1 ORDER BY id
    `, [id]);
    
    boat.images = imagesResult.rows;
    return boat;
  } catch (err) {
    console.error('Error fetching boat:', err);
    return null;
  }
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

export async function deleteBoat(boatId) {
  const query = "DELETE FROM boats WHERE id = $1";
  await db.query(query, [boatId]);
}
