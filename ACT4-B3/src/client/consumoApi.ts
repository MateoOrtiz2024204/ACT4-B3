import { writeFile } from "fs/promises";
import { registrarError, clasificarError } from "./registroErrores";

const URL = "http://localhost:3000/usuarios";
const RUTA_SALIDA = "./src/data/usuarios-consumo.json";
const TIEMPO_LIMITE_MS = 5000;

interface UsuarioResumen{

    id:number;
    nombre:string;
    correo:string;
    rol:string;
    estado:string;

}

interface SalidaConsumo{

    fechaConsulta:string;
    totalUsuarios:number;
    tiempos:{

        peticionMs:number;
        procesamientoMs:number;
        guardadoMs:number;
        totalMs:number;

    };
    usuarios:UsuarioResumen[];

}

async function consultarUsuarios():Promise<any[]>{

    const controlador=new AbortController();

    const limite=setTimeout(()=>controlador.abort(),TIEMPO_LIMITE_MS);

    try{

        const respuesta=await fetch(URL,{signal:controlador.signal});

        if(!respuesta.ok){

            throw new Error(`Respuesta no válida. Código: ${respuesta.status}`);

        }

        const datos=await respuesta.json();

        if(!Array.isArray(datos)){

            throw new SyntaxError("El formato de los datos recibidos no es el esperado.");

        }

        return datos;

    }finally{

        clearTimeout(limite);

    }

}

function procesarUsuarios(datos:any[]):UsuarioResumen[]{

    return datos.map(u=>({

        id:u.id,
        nombre:u.nombre,
        correo:u.correo,
        rol:u.rol,
        estado:u.estado

    }));

}

async function guardarSalida(usuarios:UsuarioResumen[],tiempos:SalidaConsumo["tiempos"]):Promise<void>{

    const salida:SalidaConsumo={

        fechaConsulta:new Date().toISOString(),
        totalUsuarios:usuarios.length,
        tiempos,
        usuarios

    };

    await writeFile(RUTA_SALIDA,JSON.stringify(salida,null,4));

}

async function main(){

    console.log("==== Consumo de API de usuarios ====\n");

    const inicioTotal=performance.now();

    try{

        const inicioPeticion=performance.now();

        const datos=await consultarUsuarios();

        const finPeticion=performance.now();

        const inicioProcesamiento=performance.now();

        const usuarios=procesarUsuarios(datos);

        const finProcesamiento=performance.now();

        const inicioGuardado=performance.now();

        const tiempos={

            peticionMs:Number((finPeticion-inicioPeticion).toFixed(2)),
            procesamientoMs:Number((finProcesamiento-inicioProcesamiento).toFixed(2)),
            guardadoMs:0,
            totalMs:0

        };

        await guardarSalida(usuarios,tiempos);

        const finGuardado=performance.now();

        tiempos.guardadoMs=Number((finGuardado-inicioGuardado).toFixed(2));
        tiempos.totalMs=Number((finGuardado-inicioTotal).toFixed(2));

        await guardarSalida(usuarios,tiempos);

        console.log(`Usuarios procesados: ${usuarios.length}`);
        console.log(`Tiempo de petición: ${tiempos.peticionMs} ms`);
        console.log(`Tiempo de procesamiento: ${tiempos.procesamientoMs} ms`);
        console.log(`Tiempo de guardado: ${tiempos.guardadoMs} ms`);
        console.log(`Tiempo total: ${tiempos.totalMs} ms`);
        console.log(`\nArchivo generado en: ${RUTA_SALIDA}`);

    }catch(error){

        const tipo=clasificarError(error);

        registrarError(tipo,error);

    }

}

main();
