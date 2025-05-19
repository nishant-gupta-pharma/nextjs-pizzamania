import PizzaData from "@/models/PizzaData";
import db from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await db.connect();

    const { id } = req.query;

    try {
      const deletedItem = await PizzaData.findByIdAndDelete(id);

      if (!deletedItem) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    } finally {
      await db.disconnect();
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
