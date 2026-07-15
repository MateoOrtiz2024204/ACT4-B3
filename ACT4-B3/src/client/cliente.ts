import { Usuario } from "../models/usuario";

const URL = "http://localhost:3000/usuarios";

export async function getUsuarios(): Promise<void> {

    try {
        const respuesta = await fetch(URL);
        const usuarios = await respuesta.json();
        console.log("\n==== Lista de usuarios ====\n");
        console.log(usuarios);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
    }

}

export async function getUsuarioPorId(id: number): Promise<void> {

    try {
        const respuesta = await fetch(`${URL}/${id}`);
        const usuario = await respuesta.json();
        console.log("\n==== Usuario por ID ====\n");
        console.log(usuario);
    } catch (error) {
        console.error(`Error al obtener el usuario con ID ${id}:`, error);
    }
}

export async function crearUsuario(usuario: Usuario): Promise<void> {

    try {
        const respuesta = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });
        const resultado = await respuesta.json();
        console.log("\n==== Usuario creado ====\n");
        console.log(resultado);
    } catch (error) {
        console.error("Error al crear el usuario:", error);
    }

}

export async function actualizarUsuario(id: number, usuario: Usuario): Promise<void> {

    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });
        const resultado = await respuesta.json();
        console.log("\n==== Usuario actualizado ====\n");
        console.log(resultado);
    } catch (error) {
        console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    }

}

export async function eliminarUsuario(id: number): Promise<void> {

    try {
        const respuesta = await fetch(`${URL}/${id}`, {
            method: "DELETE"
        });
        const resultado = await respuesta.json();
        console.log("\n==== Usuario eliminado ====\n");
        console.log(resultado);
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    }

}