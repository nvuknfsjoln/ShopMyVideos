// controllers/shopController.js

exports.getShopHome = (req, res) => {
  res.send('Welcome to the Shop!');
};

exports.getProduct = (req, res) => {
  const productId = req.params.id;
  res.send(`Details for product with ID: ${productId}`);
};

exports.getCart = (req, res) => {
  res.send('Your shopping cart is empty.');
};

exports.checkout = (req, res) => {
  res.send('Checkout page.');
};
