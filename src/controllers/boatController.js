import { getBoatInventory, getBoatById, addBoat, updateBoat, addBoatImage, deleteBoatImage } from "../models/boatModel.js";

export async function getBoatsPage(req, res, next) {
  try {
    const boats = await getBoatInventory();
    res.render("pages/boats", { boats });
  } catch (err) {
    next(err);
  }
}

export async function getAdminPage(req, res) {
  try {
    const boats = await getBoatInventory();
    res.render("pages/admin", { boats });
  } catch (err) {
    res.render("admin", { boats: [] });
  }
}

export async function getEditBoatPage(req, res, next) {
  try {
    const boat = await getBoatById(req.params.id);
    if (!boat) {
      return res.status(404).render("pages/error", {
        message: "Boat not found",
        error: {}
      });
    }
    res.render("pages/edit-boat", { boat });
  } catch (err) {
    next(err);
  }
}

export async function createBoat(req, res, next) {
  try {
    const { title, year, price, make, model, condition, description } = req.body;
    let { image_urls } = req.body;
    
    if (!title || !condition) {
      const boats = await getBoatInventory();
      return res.status(400).render("pages/admin", {
        boats,
        error: "Please fill in title and condition"
      });
    }

    if (!Array.isArray(image_urls)) {
      image_urls = image_urls ? [image_urls] : [];
    }

    await addBoat({ title, year, price, make, model, condition, description, image_urls });
    
    const boats = await getBoatInventory();
    res.status(201).render("pages/admin", {
      boats,
      success: "Boat added successfully!"
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBoatDetails(req, res, next) {
  try {
    const { title, year, price, make, model, condition, description } = req.body;
    
    if (!title || !condition) {
      const boat = await getBoatById(req.params.id);
      return res.status(400).render("pages/edit-boat", {
        boat,
        error: "Please fill in title and condition"
      });
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

    const boat = await getBoatById(req.params.id);
    res.render("pages/edit-boat", {
      boat,
      success: "Boat updated successfully!"
    });
  } catch (err) {
    next(err);
  }
}

export async function addImage(req, res, next) {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      const boat = await getBoatById(req.params.id);
      return res.status(400).render("pages/edit-boat", {
        boat,
        error: "Please provide an image URL"
      });
    }

    await addBoatImage(req.params.id, image_url);
    const boat = await getBoatById(req.params.id);
    
    res.render("pages/edit-boat", {
      boat,
      success: "Image added successfully!"
    });
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
