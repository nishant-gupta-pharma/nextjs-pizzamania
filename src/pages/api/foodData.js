// import PizzaData from "@/models/PizzaData"
// import db from "@/utils/db"

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     await db.connect()
//     for (let i = 0; i < req.body.length; i++) {
//       let p = new PizzaData({
//         name: req.body[i].name,
//         category: req.body[i].category,
//         foodType: req.body[i].foodType,
//         price: req.body[i].price,
//         description: req.body[i].description,
//         img: req.body[i].img,
//       })

//       await p.save()
//     }
//     res.status(200).json({ Data: "Done" })
//   }

//   if (req.method === "GET") {
//     await db.connect()

//     let data = await PizzaData.find()
//     res.status(200).json(data)
//   }
//   db.disconnect()
// }

import PizzaData from "@/models/PizzaData";
import db from "@/utils/db";

export default async function handler(req, res) {
  await db.connect();

  if (req.method === "POST") {
    try {
      const foodItems = req.body;

      // Ensure req.body is an array and validate the data structure
      if (!Array.isArray(foodItems)) {
        return res
          .status(400)
          .json({ error: "Expected an array of food items" });
      }

      for (let i = 0; i < foodItems.length; i++) {
        const { name, category, foodType, price, description, img } =
          foodItems[i];

        // Basic validation
        if (!name || !category || !foodType || !price || !description || !img) {
          return res.status(400).json({ error: "All fields must be provided" });
        }

        let p = new PizzaData({
          name,
          category,
          foodType,
          price,
          description,
          img,
        });

        await p.save();
      }

      return res.status(200).json({ Data: "Done" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create food data", details: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      let data = await PizzaData.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch food data" });
    }
  }

  await db.disconnect(); // Ensure database is disconnected
}
