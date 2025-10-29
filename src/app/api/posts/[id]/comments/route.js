import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params; // ID del post

        // Buscar comentarios relacionados con el post
        const comments = await Comment.find({ post: id })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: comments },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en GET /api/post/[id]/comments:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener los comentarios", error: error.message },
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
        const { text } = body;

        if (!text || text.trim() === "") {
            return NextResponse.json(
                { success: false, message: "El comentario no puede estar vacío" },
                { status: 400 }
            );
        }
        const newComment = await Comment.create({
            post: id,
            user: session.user.id,
            text,
        });

        return NextResponse.json(
            { success: true, message: "Comentario creado con éxito", data: newComment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en POST /api/post/[id]/comments:", error);
        return NextResponse.json(
            { success: false, message: "Error al crear el comentario", error: error.message },
            { status: 500 }
        );
    }
}
