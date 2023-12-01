

const mongoose = require("mongoose");
const Product = require("./models/Product");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@zuitt-bootcamp.fg8uhjl.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("DB connection successful");
  } catch (err) {
    console.error(err);
  }
}

async function seedProducts() {
  try {
    await Product.deleteMany(); // Clear existing products

    await Product.insertMany([
      {
        name: "Escape City Disc 2",
        description:
          "Commute to work, ride to class, find new adventures in your daily routine. This flat-bar all-rounder will get your legs spinning and motivate you to be active every day.",
        price: 30000,
        image:
          "https://images2.giant-bicycles.com/b_white,c_pad,h_850,q_80/tauckkc4wksgzum8kyq3/MY23Escape2CityDiscColorA_Metal.jpg",
        brand: 'Giant'
      }, 
      {
        name: "TCR Advanced",
        description:
          "WINNING RACE BIKES HAVE JUST THE RIGHT BALANCE OF LIGHT WEIGHT, SUPERIOR STIFFNESS AND SMOOTH COMPLIANCE ON THE ROAD. TCR ADVANCED DELIVERS ON ALL THREE.",
        price: 50000,
        image:
          "https://images2.giant-bicycles.com/b_white,c_pad,h_850,q_80/jbh80ylgezjkfxj8h40i/MY24TCRAdvanced2-PC_ColorACharcoal.jpg",
        brand: 'Giant'
      },
      {
        name: "Attend CS1 GTS",
        description:
          "Comfort, control, a breeze to ride. With an adjustable stem, suspension seatpost and grippy tires, Cypress makes it easy to experience the simple joy of riding a bike.",
        price: 50000,
        image:
          "https://images2.giant-bicycles.com/b_white,c_pad,h_850,q_80/c4fuxabri5jk9v3wviwg/MY21-Attend-CS-1-GTS_Color-A-Black.jpg",
        brand: 'Giant'
      },
      {
        name: "BIG.NINE 700",
        description:
          "Our BIG.NINE 700 is a cross-country bike that's more capable than most, with our high-value LITE aluminium frame paired with loads of comfort and control from high-volume tyres and plenty of clearance.",
        price: 35000,
        image:
          "https://d2lljesbicak00.cloudfront.net/merida-v2/crud-zoom-img//master/bikes/2024/BIG_NINE_700_bluslv_MY24.tif?p3",
        brand: 'Merida'
      },
      {
        name: "Scultura 6000",
        description:
          "The fifth generation of our lightweight racer marries outstanding handling with improved comfort and an even more aerodynamic chassis.",
        price: 38000,
        image:
          "https://d2lljesbicak00.cloudfront.net/merida-v2/crud-zoom-img//master/bikes/2024/SCULTURA_6000_whtgry_MY24.tif?p3",
        brand: 'Merida'
      },
      {
        name: "One-Twenty 700",
        description:
          "The ONE-TWENTY is a bike that doesn't need to be shoehorned into a category. Short travel trail, downcountry - call it whatever you want, but this is a fun mountain bike for doing fun mountain bike things.",
        price: 70000,
        image:
          "https://d2lljesbicak00.cloudfront.net/merida-v2/crud-zoom-img//master/bikes/2024/ONE-TWENTY_700_telsvl_MY24.tif?p3",
        brand: 'Merida'
      },
    ]);

    console.log("Products seeded successfully");
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  await connectDB();

  try {
    await seedProducts();
  } finally {
    mongoose.connection.close();
    console.log("DB connection closed");
  }
}

main();

