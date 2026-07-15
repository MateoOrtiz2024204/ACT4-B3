import { Usuario } from "../models/usuario";
import { Rol } from "../models/rol";

export const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Eduardo",
    edad: 20,
    correo: "mortiz-2024204@kinal.edu.gt",
    password: "123456",
    rol: Rol.USER,
    estado: "activo"
  },

  {
    id: 2,
    nombre: "Ana",
    edad: 22,
    correo: "mortiz-2024204@kinal.edu.gt",
    password: "123456",
    rol: Rol.USER,
    estado: "inactivo"
  },
  {
    id: 3,
    nombre: "Emilio",
    edad: 24,
    correo: "mortiz-2024204@kinal.edu.gt",
    password: "123456",
    rol: Rol.USER,
    estado: "nulo"
  }

];