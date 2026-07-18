export interface ErrorRegistro{

    tipo:string;
    mensaje:string;
    fecha:string;

}

export function registrarError(tipo:string,error:unknown):ErrorRegistro{

    const mensaje=error instanceof Error?error.message:String(error);

    const registro:ErrorRegistro={

        tipo,
        mensaje,
        fecha:new Date().toISOString()

    };

    console.log("\n==== ERROR ====");
    console.log(`Tipo: ${registro.tipo}`);
    console.log(`Mensaje: ${registro.mensaje}`);
    console.log(`Fecha: ${registro.fecha}`);
    console.log("================\n");

    return registro;

}

export function clasificarError(error:unknown):string{

    if(error instanceof TypeError){

        return "ERROR_RED";

    }

    if(error instanceof SyntaxError){

        return "ERROR_FORMATO_DATOS";

    }

    if(error instanceof DOMException && error.name==="AbortError"){

        return "ERROR_TIEMPO_ESPERA";

    }

    return "ERROR_DESCONOCIDO";

}
