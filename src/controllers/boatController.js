import { getBoatInventory, getBoatById, addBoat, updateBoat, addBoatImage, deleteBoatImage } from "../models/boatModel.js";

export async function createBoat(req, res, next) {
  try {
    const { title, year, price, make, model, condition, description } = req.body;
    let { image_urls } = req.body;
    
    if (!title || !condition) {
      req.session.error = "Please fill in title and condition";
      return res.redirect('/add-listing');
    }

    if (!Array.isArray(image_urls)) {
      image_urls = image_urls ? [image_urls] : [];
    }

    await addBoat({ title, year, price, make, model, condition, description, image_urls });
    
    req.session.success = 'Boat added successfully!';
    res.redirect('/add-listing');
  } catch (err) {
    next(err);
  }
}

export async function updateBoatDetails(req, res, next) {
  try {
    const { title, year, price, make, model, condition, description } = req.body;
    
    if (!title || !condition) {
      req.session.error = "Please fill in title and condition";
      return res.redirect(`/admin/edit/${req.params.id}`);
    }

    await updateBoat(req.params.id, { 
      title, 
      year, 
      price, 
      make,
      model,
      condition, 
      description
    });

    req.session.success = 'Boat updated successfully!';
    res.redirect(`/admin/edit/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export async function addImage(req, res, next) {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      req.session.error = "Please provide an image URL";
      return res.redirect(`/admin/edit/${req.params.id}`);
    }

    await addBoatImage(req.params.id, image_url);
    
    req.session.success = 'Image added successfully!';
    res.redirect(`/admin/edit/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req, res, next) {
  try {
    await deleteBoatImage(req.params.imageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
}
