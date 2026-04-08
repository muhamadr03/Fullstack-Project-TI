const { Address } = require("../models");

exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
    });
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil alamat.", error: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { street, city, postal_code, is_default } = req.body;

    // Jika diset default, kita bisa mematikan default alamat yang lain dulu (opsional tingkat lanjut)
    // Tapi untuk sekarang kita simpan langsung:
    const newAddress = await Address.create({
      user_id: req.user.id,
      street,
      city,
      postal_code,
      is_default: is_default || false,
    });

    res
      .status(201)
      .json({ message: "Alamat berhasil ditambahkan!", data: newAddress });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan alamat.", error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await Address.destroy({
      where: { id: req.params.id, user_id: req.user.id },
    });
    res.status(200).json({ message: "Alamat berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus alamat." });
  }
};
