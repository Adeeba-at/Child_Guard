import { Router } from "express";
import { SponsorModel } from "../models/sponsor";

const router = Router();

// ----------------------
// 1) GET sponsor profile
// ----------------------
router.get("/profile/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        console.log(`Fetching profile for sponsor: ${sponsor_id}`);
        
        const sponsor = await SponsorModel.getById(sponsor_id);

        if (!sponsor) {
            console.log(`Sponsor not found: ${sponsor_id}`);
            return res.status(404).json({ error: "Sponsor not found" });
        }

        res.json(sponsor);
    } catch (err) {
        console.error("Error fetching sponsor profile:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// 2) CREATE sponsor record (on registration)
// ----------------------
router.post("/create/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        console.log(`Creating sponsor record: ${sponsor_id}`);

        const newSponsor = await SponsorModel.create(sponsor_id);
        res.json(newSponsor);
    } catch (err) {
        console.error("Error creating sponsor:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// 3) UPDATE sponsor information
// ----------------------
router.put("/profile/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        const { phone, preferences } = req.body;

        console.log(`Updating sponsor ${sponsor_id}:`, { phone, preferences });

        // Validate input
        if (!phone && !preferences) {
            return res.status(400).json({ error: "No data provided to update" });
        }

        if (preferences && (!preferences.ageRange || !preferences.location)) {
            return res.status(400).json({ 
                error: "Invalid preferences format. Must include ageRange and location" 
            });
        }

        const updated = await SponsorModel.updateInfo(sponsor_id, {
            phone,
            preferences,
        });

        if (!updated) {
            return res.status(404).json({ error: "Sponsor not found or update failed" });
        }

        console.log(`Sponsor ${sponsor_id} updated successfully`);
        res.json(updated);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// 4) GET matching children for this sponsor
// ----------------------
router.get("/matching-children/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        console.log(`=== Fetching matching children for: ${sponsor_id} ===`);

        const children = await SponsorModel.getMatchingChildren(sponsor_id);
        
        console.log(`Returning ${children.length} matching children`);
        res.json(children);
    } catch (err) {
        console.error("=== Error fetching matching children ===");
        console.error("Error:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// 5) Sponsor selects a child
// ----------------------
router.post("/sponsor-child", async (req, res) => {
    try {
        const { sponsor_id, application_id } = req.body;

        console.log(`Sponsor ${sponsor_id} sponsoring application ${application_id}`);

        if (!sponsor_id || !application_id) {
            return res.status(400).json({ error: "Missing sponsor_id or application_id" });
        }

        const result = await SponsorModel.sponsorChild(sponsor_id, application_id);

        if (!result) {
            return res.status(400).json({ 
                error: "Unable to sponsor child. Application may not exist or already sponsored." 
            });
        }

        console.log(`Child successfully sponsored:`, result);
        res.json({
            message: "Child successfully sponsored",
            data: result,
        });
    } catch (err) {
        console.error("Error sponsoring child:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// 6) GET all children sponsored by this sponsor
// ----------------------
router.get("/my-sponsored-children/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        console.log(`Fetching sponsored children for: ${sponsor_id}`);

        if (!sponsor_id) {
            return res.status(400).json({ error: "Missing sponsor ID" });
        }

        const children = await SponsorModel.mySponsoredChildren(sponsor_id);
        
        console.log(`Found ${children.length} sponsored children`);
        res.json(children);
    } catch (err) {
        console.error("Error fetching sponsored children:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
});

// ----------------------
// DEBUG ENDPOINT (Remove in production)
// ----------------------
router.get("/debug/:sponsor_id", async (req, res) => {
    try {
        const { sponsor_id } = req.params;
        const sponsor = await SponsorModel.getById(sponsor_id);
        
        let parsedPrefs = null;
        if (sponsor?.preferences) {
            try {
                parsedPrefs = JSON.parse(sponsor.preferences);
            } catch (e) {
                parsedPrefs = { error: "Invalid JSON", raw: sponsor.preferences };
            }
        }
        
        res.json({
            sponsor,
            parsedPreferences: parsedPrefs,
            hasPreferences: !!sponsor?.preferences,
            hasPhone: !!sponsor?.phone
        });
    } catch (err) {
        res.status(500).json({ 
            error: err instanceof Error ? err.message : "Unknown error",
            stack: err instanceof Error ? err.stack : undefined
        });
    }
});

export default router;