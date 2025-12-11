import { body, validationResult } from 'express-validator';
import { getAllServiceRequests, getCustomerServiceRequests, getServiceRequestById, createServiceRequest, updateServiceRequestStatus } from '../models/serviceRequestModel.js';
import { getBoatInventory } from '../models/boatModel.js';

/**
 * Validation for service request form
 */
export const serviceRequestValidation = [
  body('service_types')
    .custom((value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        throw new Error('At least one service type is required');
      }
      return true;
    }),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
];

/**
 * Show the service request form (customer)
 */
export async function showServiceRequestForm(req, res, next) {
  try {
    res.render('pages/service-request', {
      error: null,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new service request (customer)
 */
export async function submitServiceRequest(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/service-request', {
        error: null,
        errors: errors.array(),
      });
    }

    const { boat_year, boat_make, boat_model, service_types, description } = req.body;
    const userId = req.session.user.id;

    // Ensure service_types is an array
    const serviceTypesArray = Array.isArray(service_types) ? service_types : [service_types];

    const newRequest = await createServiceRequest(userId, boat_year, boat_make, boat_model, serviceTypesArray, description);
    
    if (!newRequest) {
      return res.status(500).render('pages/service-request', {
        error: 'Error submitting request. Please try again.',
        errors: [],
      });
    }

    res.redirect(`/my-requests?success=Service request submitted successfully!`);
  } catch (err) {
    next(err);
  }
}

/**
 * View customer's service requests (customer)
 */
export async function getMyServiceRequests(req, res, next) {
  try {
    const userId = req.session.user.id;
    const requests = await getCustomerServiceRequests(userId);

    res.render('pages/my-requests', {
      requests,
      success: req.query.success || null,
      error: null,
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * View all service requests (service_manager/admin)
 */
export async function getAllRequests(req, res, next) {
  try {
    const requests = await getAllServiceRequests();
    res.render('pages/service-requests', {
      requests,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Show request detail page for approval (service_manager/admin)
 */
export async function getServiceRequestDetail(req, res, next) {
  try {
    const request = await getServiceRequestById(req.params.id);
    
    if (!request) {
      return res.status(404).render('pages/error', {
        message: 'Service request not found',
        error: {},
      });
    }

    res.render('pages/service-request-detail', {
      request,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update service request status (service_manager/admin)
 */
export async function updateRequest(req, res, next) {
  try {
    const { status, response_notes } = req.body;
    const { id } = req.params;

    if (!['approved', 'denied', 'completed'].includes(status)) {
      const request = await getServiceRequestById(id);
      return res.status(400).render('pages/service-request-detail', {
        request,
        error: 'Invalid status',
      });
    }

    const updated = await updateServiceRequestStatus(id, status, response_notes);

    if (!updated) {
      const request = await getServiceRequestById(id);
      return res.status(500).render('pages/service-request-detail', {
        request,
        error: 'Error updating request',
      });
    }

    res.redirect(`/admin/service-requests?success=Request updated successfully!`);
  } catch (err) {
    next(err);
  }
}
