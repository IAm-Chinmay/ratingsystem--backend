const { Store, Rating, User } = require("../models");
const bcrypt = require("bcryptjs");

exports.getStores = async (req, res) => {
  const { name, address } = req.query;

  const where = {};
  if (name) where.name = name;
  if (address) where.address = address;

  const stores = await Store.findAll({ where });

  const result = await Promise.all(
    stores.map(async (store) => {
      const ratings = await Rating.findAll({ where: { storeId: store.id } });
      const avgRating =
        ratings.length === 0
          ? null
          : ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;

      const userRating = await Rating.findOne({
        where: {
          storeId: store.id,
          userId: req.user.id,
        },
      });

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avgRating,
        yourRating: userRating?.rating || null,
      };
    })
  );

  res.json(result);
};

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;

  const existing = await Rating.findOne({
    where: { storeId, userId: req.user.id },
  });
  if (existing) {
    return res
      .status(400)
      .json({ message: "Rating already exists. Use update." });
  }

  const newRating = await Rating.create({
    userId: req.user.id,
    storeId,
    rating,
  });

  res.status(201).json({ message: "Rating submitted", rating: newRating });
};

exports.updateRating = async (req, res) => {
  const { storeId, rating } = req.body;

  const existing = await Rating.findOne({
    where: { storeId, userId: req.user.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Rating not found" });
  }

  existing.rating = rating;
  await existing.save();

  res.json({ message: "Rating updated", rating: existing });
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};
