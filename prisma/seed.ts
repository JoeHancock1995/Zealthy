import bcrypt from "bcryptjs";
import { PrismaClient, RepeatSchedule } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = {
  users: [
    {
      id: 1,
      name: "Mark Johnson",
      email: "mark@some-email-provider.net",
      password: "Password123!",
      appointments: [
        { id: 1, provider: "Dr Kim West", datetime: "2026-02-16T16:30:00.000-07:00", repeat: "weekly" },
        { id: 2, provider: "Dr Lin James", datetime: "2026-02-19T18:30:00.000-07:00", repeat: "monthly" }
      ],
      prescriptions: [
        { id: 1, medication: "Lexapro", dosage: "5mg", quantity: 2, refill_on: "2026-02-05", refill_schedule: "monthly" },
        { id: 2, medication: "Ozempic", dosage: "1mg", quantity: 1, refill_on: "2026-02-10", refill_schedule: "monthly" }
      ]
    },
    {
      id: 2,
      name: "Lisa Smith",
      email: "lisa@some-email-provider.net",
      password: "Password123!",
      appointments: [
        { id: 3, provider: "Dr Sally Field", datetime: "2026-02-22T18:15:00.000-07:00", repeat: "monthly" },
        { id: 4, provider: "Dr Lin James", datetime: "2026-02-25T20:00:00.000-07:00", repeat: "weekly" }
      ],
      prescriptions: [
        { id: 3, medication: "Metformin", dosage: "500mg", quantity: 2, refill_on: "2026-02-15", refill_schedule: "monthly" },
        { id: 4, medication: "Diovan", dosage: "100mg", quantity: 1, refill_on: "2026-02-25", refill_schedule: "monthly" }
      ]
    }
  ],
  medications: ["Diovan", "Lexapro", "Metformin", "Ozempic", "Prozac", "Seroquel", "Tegretol"],
  dosages: ["1mg", "2mg", "3mg", "5mg", "10mg", "25mg", "50mg", "100mg", "250mg", "500mg", "1000mg"]
};

function toRepeatSchedule(value?: string): RepeatSchedule {
  if (value === "weekly") return RepeatSchedule.weekly;
  if (value === "monthly") return RepeatSchedule.monthly;
  return RepeatSchedule.none;
}

async function main() {
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.medicationOption.deleteMany();
  await prisma.dosageOption.deleteMany();

  await prisma.medicationOption.createMany({ data: seedData.medications.map((name) => ({ name })), skipDuplicates: true });
  await prisma.dosageOption.createMany({ data: seedData.dosages.map((value) => ({ value })), skipDuplicates: true });

  for (const user of seedData.users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const patient = await prisma.patient.create({ data: { name: user.name, email: user.email, passwordHash } });

    for (const appointment of user.appointments) {
      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          providerName: appointment.provider,
          startDateTime: new Date(appointment.datetime),
          repeatSchedule: toRepeatSchedule(appointment.repeat)
        }
      });
    }

    for (const prescription of user.prescriptions) {
      await prisma.prescription.create({
        data: {
          patientId: patient.id,
          medicationName: prescription.medication,
          dosage: prescription.dosage,
          quantity: prescription.quantity,
          refillDate: new Date(prescription.refill_on),
          refillSchedule: toRepeatSchedule(prescription.refill_schedule)
        }
      });
    }
  }

  console.log("Seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
