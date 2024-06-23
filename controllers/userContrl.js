import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");
  let { email } = req.body
  console.log(email);

  const userExists = await prisma.user.findUnique({ where: { email: email } })
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "user registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "user already registered" })
})

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, data } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true }
    })

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: "this residency already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id: id } }
        }
      });
      res.send("Your visit is booked successfully")
    }
  } catch (error) {
    throw new Error(error.message)
  }
})


export const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true }
    })
    res.status(200).send(bookings)
  } catch (error) {
    throw new Error(error.message)
  }
})


export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true }
    })
    const index = user.bookedVisits.findIndex((visit) => visit.id === id)
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" })
    } else {
      user.bookedVisits.splice(index, 1)
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits
        }
      })
      res.send("Booking Cancelled Successfully")
    }
  } catch (error) {
    throw new Error(error.message)
  }
})

export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body
  const { rid } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user.favResidenciesID.includes(rid)) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            set: user.favResidenciesID.filter((id) => id !== rid)
          }
        }
      })
      res.send({ message: "Removed from favourites", user: updatedUser })
    } else {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid
          }
        }
      })
      res.send({ message: "Updated favourites", user: updatedUser })
    }
  } catch (error) {
    throw new Error(error.message)
  }
})


export const getAllFav = asyncHandler(async (req, res) => {
  const { email } = rew.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true }
    })

    res.send(200).send(favResd)
  } catch (error) {
    throw new Error(error.message)
  }
})