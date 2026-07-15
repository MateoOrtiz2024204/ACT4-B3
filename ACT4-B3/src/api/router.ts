import { IncomingMessage, ServerResponse } from 'http';
import { UsuarioService } from '../services/usuarioService';
import { Usuario } from '../models/usuario';

const service = new UsuarioService();

function leerBody(req: IncomingMessage): Promise<any> {

    return new Promise((resolve, reject) => {

        let cuerpo = '';

        req.on('data', chunk => {
            cuerpo += chunk;
        });

        req.on('end', () => {

            try {
                resolve(cuerpo ? JSON.parse(cuerpo) : {});
            } catch (error) {
                reject(error);
            }

        });

    });

}

function enviarJson(res: ServerResponse, status: number, data: unknown) {

    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

}

export async function routes(req: IncomingMessage, res: ServerResponse) {

    const url = new URL(req.url ?? '/', 'http://localhost:3000');
    const partes = url.pathname.split('/').filter(Boolean);

    if (partes[0] !== 'usuarios') {

        enviarJson(res, 404, { mensaje: 'Ruta no encontrada' });
        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === 'GET' && id === undefined) {

            const usuarios = await service.listar();
            enviarJson(res, 200, usuarios);
            return;

        }

        if (req.method === 'GET' && id !== undefined) {

            const usuario = await service.buscar(id);

            if (!usuario) {
                enviarJson(res, 404, { mensaje: 'Usuario no encontrado' });
                return;
            }

            enviarJson(res, 200, usuario);
            return;

        }

        if (req.method === 'POST') {

            const body = await leerBody(req) as Usuario;

            await service.agregar(body);
            enviarJson(res, 201, { mensaje: 'Usuario agregado' });
            return;

        }

        if (req.method === 'PUT' && id !== undefined) {

            const body = await leerBody(req) as Usuario;

            const actualizado = await service.actualizar({ ...body, id });

            if (!actualizado) {
                enviarJson(res, 404, { mensaje: 'Usuario no encontrado' });
                return;
            }

            enviarJson(res, 200, { mensaje: 'Usuario actualizado' });
            return;

        }

        if (req.method === 'DELETE' && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {
                enviarJson(res, 404, { mensaje: 'Usuario no encontrado' });
                return;
            }

            enviarJson(res, 200, { mensaje: 'Usuario eliminado' });
            return;

        }

        enviarJson(res, 405, { mensaje: 'Método no permitido' });

    } catch (error) {

        enviarJson(res, 500, { mensaje: 'Error interno del servidor' });

    }

}