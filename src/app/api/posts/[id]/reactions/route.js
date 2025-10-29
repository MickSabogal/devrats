import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import Reaction from "@/models/Reaction";
import Post from "@/models/Post";


const ALLOWED_TYPES = ["like", "love", "clap", "laugh", "fire"];

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params; 

        const postExists = await Post.findById(id);
        if (!postExists) {
            return NextResponse.json(
                { success: false, message: "Publicación no encontrada" },
                { status: 404 }
            );
        }

        const reactions = await Reaction.find({ post: id })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: reactions },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/post/[id]/reactions error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener reacciones",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "No autenticado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { type } = body || {};

        if (!type || !ALLOWED_TYPES.includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Tipo de reacción inválido. Usa uno de: ${ALLOWED_TYPES.join(", ")}`,
                },
                { status: 400 }
            );
        }
        const postExists = await Post.findById(id);
        if (!postExists) {
            return NextResponse.json(
                { success: false, message: "Publicación no encontrada" },
                { status: 404 }
            );
        }
        const existing = await Reaction.findOne({
            post: id,
            user: session.user.id,
            type,
        });

        if (existing) {
            await Reaction.findByIdAndDelete(existing._id);
            return NextResponse.json(
                { success: true, message: "Reacción eliminada" },
                { status: 200 }
            );
        }
        const newReaction = await Reaction.create({
            post: id,
            user: session.user.id,
            type,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Reacción añadida con éxito",
                data: newReaction,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/post/[id]/reactions error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al procesar la reacción",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
