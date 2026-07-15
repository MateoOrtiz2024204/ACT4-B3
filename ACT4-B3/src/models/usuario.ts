import { Rol } from "./rol";
import { Estado } from "./estado";

export interface Usuario{

    id:number;
    nombre:string;
    correo:string;
    password:string;
    edad:number;
    rol:Rol;
    estado:Estado;

}