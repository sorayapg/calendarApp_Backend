const moment = require('moment'); // Importar la libreria moment para validar fechas



const isDate = ( value ) => {
    
    // Comprobar si el valor es una fecha válida
    if ( !value ) {
        return false;
    }

    const fecha = moment( value );
    // Comprobar si la fecha es válida
    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }


}



module.exports = {
    isDate
}