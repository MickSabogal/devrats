import connectDB from '@/lib/mongodb';
import Group from '@/models/Group';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    await connectDB();

    // GET group info
    if (req.method === 'GET') {
      const groups = await Group.find({ 'members.user': userId })
        .populate('admin', 'name avatar')
        .populate('members.user', 'name avatar');
      return res.status(200).json(groups);
    }

    // POST create new group
    if (req.method === 'POST') {
      const { name, description, coverPicture } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });

      const newGroup = new Group({
        name,
        description,
        coverPicture,
        admin: userId,
        members: [{ user: userId, role: 'admin' }],
      });

      await newGroup.save();
      await newGroup.populate('admin', 'name avatar');
      return res.status(201).json(newGroup);
    }

    // PATCH 
    if (req.method === 'PATCH') {
      const { groupId, name, description, coverPicture, action, memberId } = req.body;
      if (!groupId) return res.status(400).json({ message: 'Group ID is required' });

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });

      if (group.admin.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // update group info
      if (!action) {
        if (name) group.name = name;
        if (description) group.description = description;
        if (coverPicture) group.coverPicture = coverPicture;
      }

      // remove member
      if (action === 'remove-member' && memberId) {
        group.members = group.members.filter(m => m.user.toString() !== memberId);
      }

      await group.save();
      await group.populate('admin', 'name avatar');
      await group.populate('members.user', 'name avatar');

      return res.status(200).json(group);
    }

    // PUT add new member to the group
    if (req.method === 'PUT') {
      const { groupId, memberId } = req.body;
      if (!groupId || !memberId) return res.status(400).json({ message: 'groupId and memberId required' });

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });

      if (group.admin.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // avoid duplicity
      if (group.members.some(m => m.user.toString() === memberId)) {
        return res.status(400).json({ message: 'User already in group' });
      }

      group.members.push({ user: memberId, role: 'member' });
      await group.save();
      await group.populate('members.user', 'name avatar');

      return res.status(200).json(group);
    }

    // DELETE group - only admin
    if (req.method === 'DELETE') {
      const { groupId } = req.body;
      if (!groupId) return res.status(400).json({ message: 'Group ID is required' });

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });

      if (group.admin.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await group.remove();
      return res.status(200).json({ message: 'Group deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Groups API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}