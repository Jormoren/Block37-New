const {
    createTables,
    createUser,
    createProduct,
    createUserProduct,
    fetchUsers,
    fetchProducts,
    fetchUserProducts,
    fetchSingleUser,
    deleteUserProduct,
    authenticate,
  } = require("./db");
  
 
  const seedUsers = async () => {
    return await Promise.all([
      createUser({
        firstName: "Jorge",
        lastName: "Moreno",
        email: "jorgemoreno@yahoo.com",
        password: "amzn12345",
        isAdmin: true,
      }),
      createUser({
        firstName: "Artur",
        lastName: "Smith",
        email: "artursmi@gmail.com",
        password: "tpa567",
        isAdmin: false,
      }),
      createUser({
        firstName: "Elvis",
        lastName: "Presley",
        email: "elvispresley@msn.com",
        password: "singer1935",
        isAdmin: false,
      }),
    ]);
  };
  
  const seedProducts = async () => {
    return await Promise.all([
      createProduct({
        name: "Barcelona",
        description: "Barcelona official jersey 2024",
        image: "barca.png",
        price: 185,
        stock: 50,
      }),
      createProduct({
        name: "Real Madrid",
        description: "Real Madrid official jersey 23/24",
        image: "real-madrid.png",
        price: 195,
        stock: 30,
      }),
      createProduct({
        name: "PSG",
        description: "PSG official jersey 23/24",
        image: "psg.png", 
        price: 195,
        stock: 30,
      }),
      createProduct({
        name: "Manchester",
        description: "Manchester United official jersey 24/25",
        image: "manchester-united.jpg", 
        price: 170,
        stock: 50,
      }),
    ]);
  };
  
  const seedUserProducts = async (users, products) => {
    const [Elvis, Artur, Jorge] = users;
    const [barcelona, realmadrid, psg, manchester] = products;
    return await Promise.all([
      createUserProduct({
        user_id: Elvis.id,
        product_id: barcelona.id,
        quantity: 2,
        purchased: false,
      }),
      createUserProduct({
        user_id: Artur.id,
        product_id: psg.id,
        quantity: 4,
        purchased: false,
      }),
      createUserProduct({
        user_id: Jorge.id,
        product_id: manchester.id,
        quantity: 6,
        purchased: false,
      }),
      createUserProduct({
        user_id: Elvis.id,
        product_id: realmadrid.id,
        quantity: 2,
        purchased: false,
      }),
    ]);
  };
  
  module.exports = async () => {
    await createTables();
    console.log("Tables created");
    const users = await seedUsers();
    const products = await seedProducts();
    const userProducts = await seedUserProducts(users, products);
    console.log("Data seeded successfully");
  };
  
