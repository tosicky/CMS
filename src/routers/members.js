const express = require("express");
const Member = require("../models/members");
const Group = require("../models/groups");

const router = new express.Router();

router.get("/registerMember", async (req, res) => {
  const groups = await Group.find({});
  res.render("registermember", {
    title: "Member Registration",
    groups: groups,
  });
});

router.post("/registerMember", async (req, res) => {
  const member = new Member(req.body);
  try {
    await member.save();
    res.status(201).render("registrationSuccess", {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  } catch (e) {
    res.render("registerMember", {
      err: e,
    });
  }
});

router.get("/members", async (req, res) => {
  try {
    const members = await Member.find({});
    res.render("members", {
      title: "Church Members",
      members: members,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/memberProfile/:id", async (req, res) => {
  try {
    const membId = req.params.id;
    const member = await Member.findById(membId);
    res.render("memberProfile", {
      title: "Member Profile",
      member: member,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/editmemberProfile/:id", async (req, res) => {
  try {
    const membId = req.params.id;
    const member = await Member.findById(membId);
    const groups = await Group.find({});
    let date = new Date(member.birthDate);
    const birth_date =
      date.getUTCFullYear() +
      "-" +
      ("0" + (date.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getUTCDate()).slice(-2);

    res.render("editmemberProfile", {
      title: "Member Profile",
      member: member,
      birthDate: birth_date,
      groups: groups,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/editmemberProfile/:id", async (req, res) => {
  // const updates = Object.keys(req.body);
  const membId = req.params.id;
  console.log(req.body);
  try {
    const member = await Member.findOneAndUpdate(
      { _id: membId },
      { $set: req.body },
      {
        upsert: true,
      }
    );

    // updates.forEach((update) => (member[update] = req.body[update]));
    console.log(member);
    await member.save();

    res.redirect("/memberProfile/" + membId);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/deletememberprofile/:id", async (req, res) => {
  try {
    const member = await Member.deleteOne({ _id: req.params.id });
    if (member.deletedCount === 1) {
      res.status(200).render("members");
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
