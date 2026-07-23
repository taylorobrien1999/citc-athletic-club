const { Announcement, Event } = require('../models');

// ── GET /api/announcements ────────────────────────────────────────────────────
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ announcements });
  } catch (err) {
    console.error('Get announcements error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/announcements ───────────────────────────────────────────────────
// Admin only.
const createAnnouncement = async (req, res) => {
  try {
    const { title, body, postedBy, imageUrl, visibility } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }
    const announcement = await Announcement.create({ title, body, postedBy, imageUrl, visibility });
    return res.status(201).json({ announcement });
  } catch (err) {
    console.error('Create announcement error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/announcements/:id ─────────────────────────────────────────────
// Admin only.
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    await announcement.destroy();
    return res.status(200).json({ message: 'Announcement deleted.' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/announcements/:id ─────────────────────────────────────────────────
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });

    const { title, body, imageUrl, visibility } = req.body;
    if (title !== undefined) announcement.title = title;
    if (body !== undefined) announcement.body = body;
    if (imageUrl !== undefined) announcement.imageUrl = imageUrl;
    if (visibility !== undefined) announcement.visibility = visibility;
    await announcement.save();

    return res.status(200).json({ announcement });
  } catch (err) {
    console.error('Update announcement error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── GET /api/events ────────────────────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['eventDate', 'ASC']] });
    return res.status(200).json({ events });
  } catch (err) {
    console.error('Get events error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/events ──────────────────────────────────────────────────────────
// Admin only.
const createEvent = async (req, res) => {
  try {
    const { title, eventDate, startTime, location, notes, visibility } = req.body;
    if (!title || !eventDate) {
      return res.status(400).json({ message: 'Title and event date are required.' });
    }
    const event = await Event.create({ title, eventDate, startTime, location, notes, visibility });
    return res.status(201).json({ event });
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/events/:id ────────────────────────────────────────────────────
// Admin only.
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const { title, eventDate, startTime, location, notes, visibility } = req.body;
    if (title !== undefined) event.title = title;
    if (eventDate !== undefined) event.eventDate = eventDate;
    if (startTime !== undefined) event.startTime = startTime;
    if (location !== undefined) event.location = location;
    if (notes !== undefined) event.notes = notes;
    if (visibility !== undefined) event.visibility = visibility;
    await event.save();

    return res.status(200).json({ event });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/events/:id ─────────────────────────────────────────────────
// Admin only.
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    await event.destroy();
    return res.status(200).json({ message: 'Event deleted.' });
  } catch (err) {
    console.error('Delete event error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
