const News = require("../models/News");

// Create News
const createNews = async (req, res) => {
  try {
    const { title, content, media, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const news = new News({ title, content, media, author,  date: new Date() });
    await news.save();
    res.status(201).json({ message: "News article created successfully", news });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get All News
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update News
const updateNews = async (req, res) => {
  try {
    const { title, content, media, author } = req.body;
    const news = await News.findByIdAndUpdate(req.params.id, { title, content, media, author }, { new: true });
    if (!news) return res.status(404).json({ msg: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete News
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ msg: "News not found" });
    res.json({ msg: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { createNews, getAllNews, updateNews, deleteNews };
// Compare this snippet from newspaper-backend/routes/newsRoutes.js:
// const express = require('express');