import {pool} from "../data/database.js"; // Import MySQL2 connection

export const getCirculars = (req, res) => {
    const { circular_id } = req.params;
    
    let query = "SELECT * FROM department_circular";
    let params = [];

    if (circular_id) {
        query += " WHERE circular_number = ?";
        params.push(circular_id);
    }

    pool.query(query, params, (err, results) => {
        if (err) {
            console.error("Error fetching circulars:", err);
            return res.status(500).json({ message: "Error fetching circulars", error: err });
        }

        if (circular_id && results.length === 0) {
            return res.status(404).json({ message: "Circular not found" });
        }

        res.status(200).json({ message: "Circulars retrieved successfully", data: results });
    });
};

export const addCircular = (req, res) => {
  const { circular_number, circular_name, circular_date, subject, circular_photo } = req.body;

  if (!circular_number || !circular_name || !circular_date || !subject || !circular_photo) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO department_circular (circular_number, circular_name, circular_date, subject, circular_photo) VALUES (?, ?, ?, ?, ?)";
  const params = [circular_number, circular_name, circular_date, subject, circular_photo];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error adding circular:", err);
          return res.status(500).json({ message: "Error adding circular", error: err });
      }
      res.status(201).json({ message: "Circular added successfully", insertId: result.insertId });
  });
};


export const updateCircular = (req, res) => {
  const { circular_id } = req.params;
  const { circular_number, circular_name, circular_date, subject, circular_photo } = req.body;


  const query = "UPDATE department_circular SET circular_number=?, circular_name=?, circular_date=?, subject=?, circular_photo=? WHERE circular_id=?";
  const params = [circular_number, circular_name, circular_date, subject, circular_photo, circular_id];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error updating circular:", err);
          return res.status(500).json({ message: "Error updating circular", error: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Circular not found" });
      }

      res.status(200).json({ message: "Circular updated successfully" });
  });
};


export const deleteCircular = (req, res) => {
    const { circular_id } = req.params;

    pool.query("DELETE FROM department_circular WHERE circular_id=?", [circular_id], (err, result) => {
        if (err) {
            console.error("Error deleting circular:", err);
            return res.status(500).json({ message: "Error deleting circular", error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Circular not found" });

        res.status(200).json({ message: "Circular deleted successfully" });
    });
};


export const getOrders = (req, res) => {
  const { order_number } = req.params;

  let query = "SELECT * FROM department_duty_orders";
  let params = [];

  if (order_number) {
      query = "SELECT * FROM department_duty_orders WHERE order_number = ?";
      params = [order_number];
  }

  pool.query(query, params, (err, results) => {
      if (err) {
          console.error("Error fetching orders:", err);
          return res.status(500).json({ message: "Error fetching orders", error: err });
      }

      if (order_number && results.length === 0) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Orders retrieved successfully", data: results });
  });
};



export const addOrder = (req, res) => {
  const { order_number, order_name, order_date, execution_date, subject, order_photo } = req.body;

  // Check if all required fields are provided
  if (!order_number || !order_name || !order_date || !execution_date || !subject || !order_photo) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO department_duty_orders (order_number, order_name, order_date, execution_date, subject, order_photo) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [order_number, order_name, order_date, execution_date, subject, order_photo];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error adding order:", err);
          return res.status(500).json({ message: "Error adding order", error: err });
      }
      res.status(201).json({ message: "Order added successfully", insertId: result.insertId });
  });
};


export const updateOrder = (req, res) => {
  const { order_id } = req.params;
  const { order_number, order_name, order_date, execution_date, subject, order_photo } = req.body;

  if (!order_number || !order_name || !order_date || !execution_date || !subject || !order_photo) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const query = "UPDATE department_duty_orders SET order_number=?, order_name=?, order_date=?, execution_date=?, subject=?, order_photo=? WHERE order_id=?";
  const params = [order_number, order_name, order_date, execution_date, subject, order_photo, order_id];

  pool.query(query, params, (err, result) => {
      if (err) {
          console.error("Error updating order:", err);
          return res.status(500).json({ message: "Error updating order", error: err });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order updated successfully" });
  });
};


export const deleteOrder = (req, res) => {
  const { order_id } = req.params; // Change 'id' to 'order_id'

  pool.query("DELETE FROM department_duty_orders WHERE order_id=?", [order_id], (err, result) => {
      if (err) {
          console.error("Error deleting order:", err);
          return res.status(500).json({ message: "Error deleting order", error: err });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
  });
};


export const getFacultyOrders = (req, res) => {
  const { faculty_id } = req.params;

  let query = "SELECT * FROM faculty_orders";
  let params = [];

  if (faculty_id) {
      query += " WHERE faculty_id = ?";
      params.push(faculty_id);
  }

  pool.query(query, params, (err, results) => {
      if (err) {
          console.error("Error fetching faculty orders:", err);
          return res.status(500).json({ message: "Internal Server Error", error: err });
      }

      res.json(results);
  });
};

  
  

export const addFacultyOrder = (req, res) => {
  const { faculty_id, order_number } = req.body;

  pool.query(
      "INSERT INTO faculty_orders (faculty_id, order_number) VALUES (?, ?)",
      [faculty_id, order_number],
      (err, result) => {
          if (err) {
              console.error("Error assigning order:", err);
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          res.status(201).json({ message: "Order assigned successfully", id: result.insertId });
      }
  );
};


export const updateFacultyOrder = (req, res) => {
  const { id } = req.params; // ID from faculty_orders table
  const { faculty_id, order_number } = req.body; // New faculty_id and order_number to update

  pool.query(
      "UPDATE faculty_orders SET faculty_id = ?, order_number = ? WHERE id = ?",
      [faculty_id, order_number, id],
      (err, result) => {
          if (err) {
              console.error("Error updating faculty order:", err);
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "No matching faculty order found to update" });
          }

          res.json({ message: "Faculty order updated successfully" });
      }
  );
};




export const deleteFacultyOrder = (req, res) => {
  const { id } = req.params; // ID from faculty_orders table

  pool.query(
      "DELETE FROM faculty_orders WHERE id = ?",
      [id],
      (err, result) => {
          if (err) {
              console.error("Error deleting faculty order:", err);
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "No matching faculty order found to delete" });
          }

          res.json({ message: "Faculty order deleted successfully" });
      }
  );
};


export const getFacultiesForOrder = (req, res) => {
  const { order_number } = req.params;

  pool.query(
      `SELECT f.faculty_id, f.faculty_name, f.email_id, f.mobile_number
       FROM faculty_details f
       JOIN faculty_orders fo ON fo.faculty_id = f.faculty_id
       WHERE fo.order_number = ?`,
      [order_number],
      (err, rows) => {
          if (err) {
              console.error("Error fetching faculties for order:", err);
              return res.status(500).json({ message: "Internal Server Error", error: err });
          }

          if (rows.length === 0) {
              return res.status(404).json({ message: "No faculties found for this order" });
          }

          res.json(rows);
      }
  );
};
