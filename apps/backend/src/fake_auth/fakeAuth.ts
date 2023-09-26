// import { PrismaClient, User } from "@prisma/client";

// const prisma = new PrismaClient;



// async function create_user(): Promise<User> {
//     const fz = await prisma.user.create({
//         data: {
//             username: "fatimzehra",
//             login: "fael-bou",
//             email: "elbouaazzaouitema@gmail.com",
//         }
//     });
//     return fz;
// }
// const fz = create_user();

// function fakeAuth(token: string): Promise<User | null> {
//     const validToken = "tokenHere";
//     return new Promise<User | null>((resolve, reject) =>{
//         if (token === validToken) {
    
//             resolve(fz);
//         }
//         else {
//             reject(null);
//         }
//     })
// }

