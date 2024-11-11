class UserDto {
    constructor(user){
        this.first_name = user.first_name,
        this.last_name  = user.last_name,
        this.email      = user.email,
        this.role       = user.role,
        this.password   = user.password,
        this.cart       = user.cart
    }

    toResponse(){
        return {
            'Nombre Completo': `${this.first_name} ${this.last_name}`,
            'Correo electrónico': this.email,
            'Carrito': this.cart
        }
    }
}

module.exports = {
    UserDto
}