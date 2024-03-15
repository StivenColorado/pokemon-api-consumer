const userEmail = localStorage.getItem('email');
if (userEmail) {
    //hay una sesion activa
    console.log(`sesion activa ${userEmail}`)
} else {
    // console.log(`no hay activa ${userEmail} inicie sesion para ver esta informacion`)
    console.log('no hay una sesion activa, ingrese con su cuenta')
    window.location.href = '/Login';
}
