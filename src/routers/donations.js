const express = require("express");
const Donation = require("../models/donations");
const mongoose = require("mongoose");
const router = new express.Router();

router.get("/donations", async (req, res) => {
  try {
    //const donations = await Donation.find({});
    const donations = await Donation.aggregate([
      {
        $group: { _id: "$donatedBy", count: { $push: { amount: "$amount" } } },
      },
    ]);
    res.render("donations", {
      donation: donations,
      title: "Members Donations",
    });
  } catch (e) {
    res.status(401).send(e);
  }
});

router.get("/recordDonation", (req, res) => {
  res.render("recordDonation", {
    title: "Record Donation",
    firstname: req.query.first_name,
    lastname: req.query.last_name,
    membId: req.query.mid,
    guestId: req.query.gid,
  });
});

router.post("/donation", async (req, res) => {
  const donation = new Donation(req.body);
  console.log(donation);
  try {
    await donation.save();
    res.send({ status: 201 });
  } catch (e) {
    res.status(404).render("donations", {
      err: e,
    });
  }
});

router.get("/memberDonations", async (req, res) => {
  let member_total_donations;
  try {
    const membId = req.query.mid;
    // console.log(membId);
    // const member_donations = await Donation.aggregate([
    //   {
    //     $lookup: {
    //       from: "members",
    //       localField: "donatedBy",
    //       foreignField: "_id",
    //       as: "member_details",
    //     },
    //   },
    //   { $unwind: "$member_details" },
    //   {
    //     $match: {
    //       "member_details._id": mongoose.Types.ObjectId(membId),
    //     },
    //   },
    //   {
    //     $project: {
    //       donatedBy: 1,
    //       amount: 1,
    //       donationDate: 1,
    //       member_details: 1,
    //     },
    //   },
    //   { $group: { _id: null, total: { $sum: "$amount" } } },

    //   // {
    //   //   $addFields: {
    //   //     total: { $sum: "$amount" },
    //   //   },
    //   // },
    //   // {
    //   //   $lookup: {
    //   //     from: "members",
    //   //     let: {
    //   //       id: $_id,
    //   //     },
    //   //     pipeline: [
    //   //       {
    //   //         $match: { donatedBy: { $eq: membId } },
    //   //       },
    //   //     ],
    //   //     as: "member_details",
    //   //   },
    //   // },
    //   // { $group: { _id: membId, count: { $sum: 1 } } },
    // ]);
    // const member_total_donations = await Donation.aggregate([
    //   {
    //     $group: {
    //       _id: mongoose.Types.ObjectId(membId),
    //       // amount: "$amount",
    //       // donationDate: "$donationDate",
    //       total: { $sum: "$amount" },
    //     },
    //   },
    // ]);

    const member_donations = await Donation.find({
      donatedBy: membId,
    })
      .sort({ donationDate: "ascending" })
      .populate({
        path: "donatedBy",
        model: "Member",
        match: {
          _id: membId,
        },
        $addFields: {
          score: {
            $sum: "$amount",
          },
        },
      });
    member_total_donations = await Donation.aggregate([
      {
        $match: {
          donatedBy: mongoose.Types.ObjectId(membId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log(member_total_donations);
    console.log(member_donations);
    res.status(200).render("donations", {
      donations: member_donations,
      memberId: membId,
      total: member_total_donations[0].total / 100,
    });
  } catch (e) {
    res.status(404).render("donations");
  }
});

router.get("/guestDonations", async (req, res) => {
  let guest_total_donations;
  try {
    const guestId = req.query.gid;
    // console.log(membId);
    // const member_donations = await Donation.aggregate([
    //   {
    //     $lookup: {
    //       from: "members",
    //       localField: "donatedBy",
    //       foreignField: "_id",
    //       as: "member_details",
    //     },
    //   },
    //   { $unwind: "$member_details" },
    //   {
    //     $match: {
    //       "member_details._id": mongoose.Types.ObjectId(membId),
    //     },
    //   },
    //   {
    //     $project: {
    //       donatedBy: 1,
    //       amount: 1,
    //       donationDate: 1,
    //       member_details: 1,
    //     },
    //   },
    //   { $group: { _id: null, total: { $sum: "$amount" } } },

    //   // {
    //   //   $addFields: {
    //   //     total: { $sum: "$amount" },
    //   //   },
    //   // },
    //   // {
    //   //   $lookup: {
    //   //     from: "members",
    //   //     let: {
    //   //       id: $_id,
    //   //     },
    //   //     pipeline: [
    //   //       {
    //   //         $match: { donatedBy: { $eq: membId } },
    //   //       },
    //   //     ],
    //   //     as: "member_details",
    //   //   },
    //   // },
    //   // { $group: { _id: membId, count: { $sum: 1 } } },
    // ]);
    // const member_total_donations = await Donation.aggregate([
    //   {
    //     $group: {
    //       _id: mongoose.Types.ObjectId(membId),
    //       // amount: "$amount",
    //       // donationDate: "$donationDate",
    //       total: { $sum: "$amount" },
    //     },
    //   },
    // ]);

    const guest_donations = await Donation.find({
      donatedBy: guestId,
    })
      .sort({ donationDate: "ascending" })
      .populate({
        path: "donatedBy",
        model: "Newcomer",
        match: {
          _id: guestId,
        },
      });
    guest_total_donations = await Donation.aggregate([
      {
        $match: {
          donatedBy: mongoose.Types.ObjectId(guestId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log(guest_total_donations);
    console.log(guest_donations);
    res.status(200).render("donations", {
      donations: guest_donations,
      gId: guestId,
      total: guest_total_donations[0].total / 100,
    });
  } catch (e) {
    res.status(404).render("donations");
  }
});

module.exports = router;
