const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");

// Middleware to parse incoming form data
router.use(express.urlencoded({ extended: true }));

// File path to db.json
const DB_FILE_PATH = "./data/db.json";

// Check if db.json exists, if not, create it with an empty array
if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
}
if (!fs.existsSync(DB_FILE_PATH)) {
    fs.writeFileSync(DB_FILE_PATH, "[]", "utf-8");
}

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/contact", (req, res) => {
    // Read existing data from db.json
    fs.readFile(DB_FILE_PATH, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        const contacts = JSON.parse(data);
        res.render("contact", { contacts });
    });
});

router.post("/contact", multer().none(), (req, res) => {
    // Extract form data
    const { fullname, email, age } = req.body;

    // Create an object to hold the form data
    const formData = {
        fullname,
        email,
        age
    };

    // Read existing data from db.json
    fs.readFile(DB_FILE_PATH, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let contacts = [];
        if (data) {
            try {
                contacts = JSON.parse(data);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return res.status(500).send("Internal Server Error");
            }
        }

        // Add new form data to existing data
        contacts.push(formData);

        // Write updated data back to db.json
        fs.writeFile(DB_FILE_PATH, JSON.stringify(contacts, null, 2), err => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Internal Server Error");
            }
            
            console.log("Data saved successfully.");
            res.redirect("/contact");
        });
    });
});

// Route to delete a contact
router.post("/contact/delete/:index", (req, res) => {
    const { index } = req.params;

    fs.readFile(DB_FILE_PATH, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let contacts = [];
        if (data) {
            try {
                contacts = JSON.parse(data);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return res.status(500).send("Internal Server Error");
            }
        }

        // Remove the contact at the specified index
        contacts.splice(index, 1);

        // Write updated data back to db.json
        fs.writeFile(DB_FILE_PATH, JSON.stringify(contacts, null, 2), err => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Internal Server Error");
            }
            
            console.log("Contact deleted successfully.");
            res.redirect("/contact");
        });
    });
});

// Route to update a contact
router.post("/contact/update/:index", multer().none(), (req, res) => {
    const { index } = req.params;
    const { fullname, email, age } = req.body;

    fs.readFile(DB_FILE_PATH, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let contacts = [];
        if (data) {
            try {
                contacts = JSON.parse(data);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return res.status(500).send("Internal Server Error");
            }
        }

        // Update the contact at the specified index
        if (index >= 0 && index < contacts.length) {
            contacts[index] = {
                fullname,
                email,
                age
            };

            // Write updated data back to db.json
            fs.writeFile(DB_FILE_PATH, JSON.stringify(contacts, null, 2), err => {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Internal Server Error");
                }
                
                console.log("Contact updated successfully.");
                res.redirect("/contact");
            });
        } else {
            res.status(400).send("Invalid index for updating contact.");
        }
    });
});

module.exports = router;
