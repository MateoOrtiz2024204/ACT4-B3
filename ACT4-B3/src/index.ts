import { rl } from "./utils/readline";
import { UsuarioService } from "./services/usuarioService";
import { menu } from "./menu/menu";

const service = new UsuarioService();

async function main() {

    while (true) {

        const correo = await rl.question("Correo: ");
        const password = await rl.question("Contraseña: ");

        const acceso = await service.login(correo, password);

        if (acceso) {

            console.clear();

            await menu();

            break;

        }

        console.log("Usuario o contraseña incorrectos.");

    }

}

main();