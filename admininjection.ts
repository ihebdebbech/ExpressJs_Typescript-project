import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import 'dotenv/config';
const prisma = new PrismaClient()
const passwordadmin = process.env.passwordAdmin;
async function main() {
  try {
    const adminbirthdate = process.env.birthdateadmin;
    const hashedPassword = await bcrypt.hash(passwordadmin!, 10);

    await prisma.user.create({
      data: {
        username: process.env.usernameadmin!,
        firstname: process.env.firstnameadmin!,
        lastname: process.env.lastnameadmin!,
        phonenumber: Number(process.env.phonenumberadmin!),
        birthdate: adminbirthdate,
        password: hashedPassword,
        role: 'admin',
        email: process.env.emailadmin!,
      }
    });
  } catch (error) {
    console.log(error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })