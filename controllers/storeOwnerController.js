const { Store, Rating, User } = require("../models");
const bcrypt = require("bcryptjs");

exports.getDashboard = async (req, res) => {
  const stores = await Store.findAll({ where: { ownerId: req.user.id } });
  const storeIds = stores.map((store) => store.id);

  const ratings = await Rating.findAll({
    where: { storeId: storeIds },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : null;

  const userRatings = ratings.map((r) => ({
    storeId: r.storeId,
    rating: r.rating,
    user: r.User,
  }));

  res.json({
    averageRating,
    ratings: userRatings,
  });
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
