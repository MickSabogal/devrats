import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Post from "@/models/Post";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const post = await Post.findById(id)
            .populate("user", "name email")
            .populate("comments") 
            .populate("reactions"); 

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Publicación no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: post }, { status: 200 });
    } catch (error) {
        console.error("GET /api/post/[id] error:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener la publicación", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
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

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { success: false, message: "Publicación no encontrada" },
                { status: 404 }
            );
        }

        if (post.user.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "No tienes permisos para editar esta publicación" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, content, image } = body;

        if (title) post.title = title;
        if (content) post.content = content;
        if (image) post.image = image;

        await post.save();

        return NextResponse.json(
            { success: true, message: "Publicación actualizada correctamente", data: post },
            { status: 200 }
        );
    } catch (error) {
        console.error("PUT /api/post/[id] error:", error);
        return NextResponse.json(
            { success: false, message: "Error al actualizar la publicación", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
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

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { success: false, message: "Publicación no encontrada" },
                { status: 404 }
            );
        }

        if (post.user.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "No tienes permisos para eliminar esta publicación" },
                { status: 403 }
            );
        }

        await post.deleteOne();

        return NextResponse.json(
            { success: true, message: "Publicación eliminada correctamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /api/post/[id] error:", error);
        return NextResponse.json(
            { success: false, message: "Error al eliminar la publicación", error: error.message },
            { status: 500 }
        );
    }
}
