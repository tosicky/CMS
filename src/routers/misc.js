const express = require("express");
const Group = require("../models/groups");
const Newcomer = require("../models/newcomers");
const router = new express.Router();

router.get("/features", (req, res) => {
  res.render("about", {
    title: "Church Management System (CMS)",
  });
});

router.get("/addgroup", async (req, res) => {
  res.render("addGroup", {
    title: "Add new group",
  });
});

router.post("/addgroup", async (req, res) => {
  const group = new Group(req.body);
  try {
    await group.save();
    res.status(201).send({ status: 201 });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/addvisitor", async (req, res) => {
  res.render("addVisitor", {
    title: "Add new visitor",
  });
});

router.post("/addvisitor", async (req, res) => {
  const visitor = new Newcomer(req.body);
  try {
    await visitor.save();
    res.status(201).render("registrationSuccess", {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  } catch (e) {
    res.status(404).render("addvisitor", {
      err: e,
    });
  }
});

router.get("/visitors", async (req, res) => {
  try {
    const visitors = await Newcomer.find({});
    res.render("Visitors", {
      title: "Newcomers and visitors",
      visitors: visitors,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/visitorProfile/:id", async (req, res) => {
  try {
    const visitorId = req.params.id;
    const visitor = await Newcomer.findById(visitorId);
    res.render("visitorProfile", {
      title: "Guest Profile",
      visitor: visitor,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/editguestProfile/:id", async (req, res) => {
  try {
    const visitorId = req.params.id;
    const visitor = await Newcomer.findById(visitorId);
    let date = new Date(visitor.visitDate);
    const visit_date =
      date.getUTCFullYear() +
      "-" +
      ("0" + (date.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getUTCDate()).slice(-2);

    res.render("editguestProfile", {
      title: "Guest Profile",
      visitor: visitor,
      visitDate: visit_date,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/editguestProfile/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const visitorId = req.params.id;
  console.log(visitorId);
  try {
    const visitor = await Newcomer.findById(visitorId);

    updates.forEach((update) => (visitor[update] = req.body[update]));
    console.log(req.body);
    await visitor.save();

    console.log("i am here");

    res.redirect("/visitorProfile/" + visitorId);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/deleteguestprofile/:id", async (req, res) => {
  try {
    const guest = await Newcomer.deleteOne({ _id: req.params.id });
    if (guest.deletedCount === 1) {
      res.status(200).render("visitors");
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
