import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Group from "@/models/Group";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const group = await Group.findById(id)
            .populate("admin", "name email")
            .populate("members.user", "name email");

        if (!group) {
            return NextResponse.json(
                { success: false, message: "Grupo no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: group }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/group/[id]:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener el grupo", error: error.message },
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
        const group = await Group.findById(id);
        if (!group) {
            return NextResponse.json(
                { success: false, message: "Grupo no encontrado" },
                { status: 404 }
            );
        }
        if (group.admin.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "No tienes permisos para editar este grupo" },
                { status: 403 }
            );
        }
        const body = await request.json();
        const { name, description, coverPicture } = body;
        if (name) group.name = name;
        if (description) group.description = description;
        if (coverPicture) group.coverPicture = coverPicture;

        await group.save();

        return NextResponse.json(
            { success: true, message: "Grupo actualizado correctamente", data: group },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en PUT /api/group/[id]:", error);
        return NextResponse.json(
            { success: false, message: "Error al actualizar el grupo", error: error.message },
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

        const group = await Group.findById(id);
        if (!group) {
            return NextResponse.json(
                { success: false, message: "Grupo no encontrado" },
                { status: 404 }
            );
        }
        if (group.admin.toString() !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "No tienes permisos para eliminar este grupo" },
                { status: 403 }
            );
        }

        await group.deleteOne();

        return NextResponse.json(
            { success: true, message: "Grupo eliminado correctamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en DELETE /api/group/[id]:", error);
        return NextResponse.json(
            { success: false, message: "Error al eliminar el grupo", error: error.message },
            { status: 500 }
        );
    }
}
