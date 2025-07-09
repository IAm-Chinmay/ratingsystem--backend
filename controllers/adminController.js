const { User, Store, Rating } = require("../models");

exports.getDashboard = async (req, res) => {
  const userCount = await User.count();
  const storeCount = await Store.count();
  const ratingCount = await Rating.count();
  res.json({ users: userCount, stores: storeCount, ratings: ratingCount });
};

exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const bcrypt = require("bcryptjs");
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    address,
    role,
  });
  res.status(201).json({ message: "User created", user });
};

exports.addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await Store.create({ name, email, address, ownerId });
  res.status(201).json({ message: "Store created", store });
};

exports.getUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  const filter = {};
  if (name) filter.name = name;
  if (email) filter.email = email;
  if (address) filter.address = address;
  if (role) {
    filter.role = role;
  } else {
    filter.role = ["admin", "normal"];
  }

  const users = await User.findAll({ where: filter });
  res.json(users);
};

exports.getStores = async (req, res) => {
  const { name, email, address } = req.query;
  const filter = {};
  if (name) filter.name = name;
  if (email) filter.email = email;
  if (address) filter.address = address;

  const stores = await Store.findAll({
    where: filter,
    include: [
      {
        model: User,
        where: { role: "store_owner" },
        attributes: ["id", "name", "email", "address", "role"],
      },
    ],
  });

  const results = await Promise.all(
    stores.map(async (store) => {
      const ratings = await Rating.findAll({ where: { storeId: store.id } });
      const average =
        ratings.length === 0
          ? null
          : ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
      return { ...store.toJSON(), averageRating: average };
    })
  );

  res.json(results);
};

exports.getUserDetails = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  let rating = null;
  if (user.role === "store_owner") {
    const stores = await Store.findAll({ where: { ownerId: user.id } });
    const storeIds = stores.map((s) => s.id);
    const ratings = await Rating.findAll({ where: { storeId: storeIds } });
    if (ratings.length > 0) {
      const avg = ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;
      rating = avg;
    }
  }

  res.json({ ...user.toJSON(), storeRating: rating });
};
