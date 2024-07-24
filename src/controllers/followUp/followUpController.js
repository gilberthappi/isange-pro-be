import { FollowUp } from "../../models";

// Create a new follow-up
export const createFollowUp = async (req, res) => {
  try {
    const followUp = new FollowUp(req.body);
    const savedFollowUp = await followUp.save();
    res.status(201).json(savedFollowUp);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all follow-ups
export const getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find();
    res.status(200).json(followUps);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a follow-up by ID
export const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }
    res.status(200).json(followUp);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a follow-up
export const updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!followUp) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }
    res.status(200).json(followUp);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a follow-up
export const deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    if (!followUp) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
