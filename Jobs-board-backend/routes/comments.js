import express from "express";
import { authenticate } from "../Utils/authMiddleware.js";
import { pool } from "../DB/db.js";

const router = express.Router();

// Get comments for a trainee-mentor pair
router.get("/comments", authenticate, async (req, res) => {
  try {
    const { traineeId, mentorId } = req.query;

    if (!traineeId || !mentorId) {
      return res.status(400).json({ error: "traineeId and mentorId are required" });
    }

    const result = await pool.query(
      `SELECT 
        c.comment_id,
        c.comment_text,
        c.created_at,
        c.author_id,
        u.full_name as author_name,
        u.user_role as role
       FROM comments c
       JOIN users u ON c.author_id = u.user_id
       WHERE c.trainee_id = $1 AND c.mentor_id = $2
       ORDER BY c.created_at ASC`,
      [traineeId, mentorId]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Post a new comment
router.post("/comments", authenticate, async (req, res) => {
  try {
    const { traineeId, mentorId, comment } = req.body;
    const authorId = req.user.user_id;

    if (!traineeId || !mentorId || !comment) {
      return res.status(400).json({ error: "traineeId, mentorId, and comment are required" });
    }

    // Verify that the author is either the trainee or the mentor
    if (authorId !== parseInt(traineeId) && authorId !== parseInt(mentorId)) {
      return res.status(403).json({ error: "You can only comment on your own mentor-trainee relationship" });
    }

    const result = await pool.query(
      `INSERT INTO comments (trainee_id, mentor_id, author_id, comment_text)
       VALUES ($1, $2, $3, $4)
       RETURNING comment_id, comment_text, created_at, author_id`,
      [traineeId, mentorId, authorId, comment]
    );

    // Get author details
    const authorResult = await pool.query(
      `SELECT full_name, user_role FROM users WHERE user_id = $1`,
      [authorId]
    );

    const newComment = {
      ...result.rows[0],
      author_name: authorResult.rows[0].full_name,
      role: authorResult.rows[0].user_role,
    };

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

export default router;
