import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Group from "@/models/Group";

export async function GET() {
    try {
        await connectDB();
        const groups = await Group.find()
            .populate("admin", "name email")
            .populate("members.user", "name email");

        return NextResponse.json({ success: true, data: groups }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/group:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener los grupos", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "No autenticado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, coverPicture } = body;

        if (!name || !description) {
            return NextResponse.json(
                { success: false, message: "El nombre y la descripción son obligatorios" },
                { status: 400 }
            );
        }

        const newGroup = await Group.create({
            name,
            description,
            coverPicture: coverPicture || "",
            admin: session.user.id,
            members: [
                {
                    user: session.user.id,
                    role: "admin",
                    joinedAt: new Date(),
                },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                message: "Grupo creado con éxito",
                data: newGroup,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en POST /api/group:", error);
        return NextResponse.json(
            { success: false, message: "Error al crear el grupo", error: error.message },
            { status: 500 }
        );
    }
}
