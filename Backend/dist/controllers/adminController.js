"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolunteerAvailability = exports.rejectVolunteer = exports.approveVolunteer = exports.getVolunteerById = exports.getRequestedVolunteers = exports.getAllVolunteers = exports.deleteAwarenessContent = exports.updateAwarenessContent = exports.getAllAwarenessContents = exports.createAwarenessContent = void 0;
const AwarenessContent_1 = require("../models/AwarenessContent");
const admin_1 = require("../models/admin");
const volunteer_1 = require("../models/volunteer");
// Create new awareness content (admin only)
const createAwarenessContent = async (req, res) => {
    const admin_id = req.user.user_id;
    const { title, content, type, status } = req.body;
    // Validate required fields
    if (!title || !content || !type) {
        return res.status(400).json({ success: false, message: 'title, content, and type are required' });
    }
    // Validate type
    if (!['article', 'video', 'guide'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid type. Must be article, video, or guide' });
    }
    try {
        const newContent = await AwarenessContent_1.AwarenessContentModel.create({
            admin_id,
            title,
            content,
            type: type,
            status: status,
        });
        return res.status(201).json({
            success: true,
            message: 'Awareness content created successfully',
            data: newContent,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAwarenessContent = createAwarenessContent;
// Get all awareness content including drafts (admin panel only)
const getAllAwarenessContents = async (_req, res) => {
    try {
        const contents = await AwarenessContent_1.AwarenessContentModel.getAll();
        res.json({ success: true, data: contents });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllAwarenessContents = getAllAwarenessContents;
// Update existing awareness content
const updateAwarenessContent = async (req, res) => {
    const { content_id } = req.params;
    const updates = req.body;
    try {
        const updated = await AwarenessContent_1.AwarenessContentModel.update(content_id, updates);
        res.json({ success: true, message: 'Content updated successfully', data: updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateAwarenessContent = updateAwarenessContent;
// Delete awareness content by ID
const deleteAwarenessContent = async (req, res) => {
    const { content_id } = req.params;
    try {
        const deleted = await AwarenessContent_1.AwarenessContentModel.delete(content_id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, message: 'Content deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAwarenessContent = deleteAwarenessContent;
// Get all volunteers (admin only) ←←← UPDATED: Now 100% works with your frontend
const getAllVolunteers = async (_req, res) => {
    try {
        const volunteers = await admin_1.AdminModel.getAllVolunteers();
        // ←←← FIX: Ensure null/undefined fields don't break JSON.parse on frontend
        const sanitized = volunteers.map(v => ({
            volunteer_id: v.volunteer_id,
            phone: v.phone ?? null,
            area: v.area ?? null,
            age: v.age ?? null,
            availability: v.availability ?? null,
            status: v.status ?? 'pending',
        }));
        res.json({ success: true, data: sanitized });
    }
    catch (error) {
        console.error('Error in getAllVolunteers:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
exports.getAllVolunteers = getAllVolunteers;
// Get requested volunteers (admin only) ←←← ALSO FIXED
const getRequestedVolunteers = async (_req, res) => {
    try {
        const volunteers = await admin_1.AdminModel.getRequestedVolunteers();
        const sanitized = volunteers.map(v => ({
            volunteer_id: v.volunteer_id,
            phone: v.phone ?? null,
            area: v.area ?? null,
            age: v.age ?? null,
            availability: v.availability ?? null,
            status: v.status ?? 'pending',
        }));
        res.json({ success: true, data: sanitized });
    }
    catch (error) {
        console.error('Error in getRequestedVolunteers:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
exports.getRequestedVolunteers = getRequestedVolunteers;
// Get volunteer by ID (admin only)
const getVolunteerById = async (req, res) => {
    const { volunteer_id } = req.params;
    try {
        const volunteer = await volunteer_1.VolunteerModel.getById(volunteer_id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, data: volunteer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getVolunteerById = getVolunteerById;
// Approve volunteer (admin only)
const approveVolunteer = async (req, res) => {
    const { volunteer_id } = req.params;
    try {
        const approved = await admin_1.AdminModel.approveVolunteer(volunteer_id);
        if (!approved) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, message: 'Volunteer approved successfully', data: approved });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.approveVolunteer = approveVolunteer;
// Reject volunteer (admin only)
const rejectVolunteer = async (req, res) => {
    const { volunteer_id } = req.params;
    try {
        const rejected = await admin_1.AdminModel.rejectVolunteer(volunteer_id);
        if (!rejected) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, message: 'Volunteer rejected successfully', data: rejected });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.rejectVolunteer = rejectVolunteer;
// Update volunteer availability (admin only)
const updateVolunteerAvailability = async (req, res) => {
    const { volunteer_id } = req.params;
    const { availability } = req.body;
    if (!availability) {
        return res.status(400).json({ success: false, message: 'Availability is required' });
    }
    try {
        const updated = await volunteer_1.VolunteerModel.updateAvailability(volunteer_id, availability);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, message: 'Availability updated successfully', data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateVolunteerAvailability = updateVolunteerAvailability;
